import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import { useState, useEffect } from "react";

export default function Upload({handleChange, list}){
let [counter, setCounter] = useState(1)
const uploader = Uploader({
  // Get production API keys from Upload.io
  apiKey: "public_W142hVk5YBBw5j5BaQ49B6ajMd9Y"
});

return (
    <UploadButton uploader={uploader}
                options={{multi: true}}
                onComplete={files => {
                  handleChange(files[0].fileUrl, files)
                }}>
    {({onClick}) =>
        <button style={{color: "black"}} onClick={onClick}>
        Upload file...
        </button>
    }
    </UploadButton>
    )
}