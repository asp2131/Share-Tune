import { Uploader } from "uploader";
import { useState, useEffect } from "react";
import Dropdown from './components/Dropdown'

export default function Upload({handleChange, list}){
let [counter, setCounter] = useState(1)
const uploader = Uploader({
  // Get production API keys from Upload.io
  apiKey: "public_W142hVk5YBBw5j5BaQ49B6ajMd9Y"
});

return (
    <Dropdown uploader={uploader} handleChange={handleChange} list={list}/>
    )
}