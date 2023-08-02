import React, { useState } from "react";
import { uploadFileEncrypted, shareFile } from "./utils";

function App() {
  const [shareInfo, setShareInfo] = useState({
    cid: "",
    publicKeyUserB: "",
    shareStatus: "",
  });
  return (
    <div className="App">
      <div>
        <p>
          Upload File Encrypted:
          <input
            onChange={(e) => uploadFileEncrypted(e.target.files, setShareInfo)}
            type="file"
          />
        </p>
      </div>

      <div>
        <p>
          Share the file at CID: <br /> {shareInfo.cid} <br /> to:
          <input
            type="text"
            name="publicKeyUserB"
            value={shareInfo.publicKeyUserB}
            onChange={(e) => {
              setShareInfo((prevShareInfo) => ({
                ...prevShareInfo,
                publicKeyUserB: e.target.value,
              }));
            }}
          />
          <button onClick={() => shareFile(shareInfo, setShareInfo)}>
            share file
          </button>
          <br />
          <br />
          <span>
            File shared to: <br />
            {shareInfo.publicKeyUserB} with status: {shareInfo.shareStatus}
          </span>
          <br />
          <span>
            Visit at:
            {`https://files.lighthouse.storage/viewFile/${shareInfo.cid}`}
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;
