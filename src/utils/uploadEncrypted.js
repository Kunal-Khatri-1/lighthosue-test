import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";

const encryptionSignature = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const messageRequested = (await lighthouse.getAuthMessage(address)).data
    .message;
  const signedMessage = await signer.signMessage(messageRequested);
  return {
    signedMessage: signedMessage,
    publicKey: address,
  };
};

const progressCallback = (progressData) => {
  let percentageDone =
    100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
  console.log(percentageDone);
};

/* Deploy file along with encryption */
const uploadFileEncrypted = async (file, setShareInfo) => {
  /*
       uploadEncrypted(e, accessToken, publicKey, signedMessage, uploadProgressCallback)
       - e: js event
       - accessToken: your API key
       - publicKey: wallets public key
       - signedMessage: message signed by the owner of publicKey
       - uploadProgressCallback: function to get progress (optional)
    */
  const sig = await encryptionSignature();
  const response = await lighthouse.uploadEncrypted(
    file,
    process.env.REACT_APP_LIGHTHOUSE_API_KEY,
    sig.publicKey,
    sig.signedMessage,
    progressCallback
  );
  console.log(response);

  setShareInfo((prevShareInfo) => {
    return { ...prevShareInfo, cid: response.data.Hash };
  });

  /*
      output:
        data: {
          Name: "c04b017b6b9d1c189e15e6559aeb3ca8.png",
          Size: "318557",
          Hash: "QmcuuAtmYqbPYmPx3vhJvPDi61zMxYvJbfENMjBQjq7aM3"
        }
      Note: Hash in response is CID.
    */
};

export { uploadFileEncrypted };
