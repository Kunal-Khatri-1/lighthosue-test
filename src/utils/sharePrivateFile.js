import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";

const signAuthMessage = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const publicKey = (await signer.getAddress()).toLowerCase();
  const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data
    .message;
  const signedMessage = await signer.signMessage(messageRequested);
  return { publicKey: publicKey, signedMessage: signedMessage };
};

const shareFile = async (shareInfo, setShareInfo) => {
  const cid = shareInfo.cid;

  // Then get auth message and sign
  // Note: the owner of the file should sign the message.
  const { publicKey, signedMessage } = await signAuthMessage();

  const publicKeyUserB = [shareInfo.publicKeyUserB];

  const res = await lighthouse.shareFile(
    publicKey,
    publicKeyUserB,
    cid,
    signedMessage
  );

  console.log(res);

  setShareInfo((prevShareInfo) => {
    return {
      ...prevShareInfo,
      publicKeyUserB: res.data.shareTo[0],
      shareStatus: res.data.status,
    };
  });
};

export { shareFile };
