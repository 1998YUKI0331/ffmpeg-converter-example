import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useState, useRef } from "react";

const ffmpeg = createFFmpeg({
  log: true,
  corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
});

function App() {
  const videoRef = useRef();
  const [file, setFile] = useState();
  const [previewSrc, setPreviewSrc] = useState("");

  const handleFileSelected = async (e) => {
    setFile(() => e.target.files[0]);
    doTranscode(e.target.files[0]);
  };

  const doTranscode = async (file) => {
    console.log("Loading ffmpeg-core.js");
    await ffmpeg.load();

    console.log("Start transcoding");
    ffmpeg.FS(
      "writeFile",
      file.name,
      await fetchFile(URL.createObjectURL(file))
    );
    await ffmpeg.run("-i", file.name, "-r", "60", "test.mp4");

    console.log("Complete transcoding");

    const mp4File = ffmpeg.FS("readFile", "test.mp4");
    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });

    setPreviewSrc(URL.createObjectURL(mp4Blob));
  };

  return (
    <div className="App">
      <input type="file" accept="video/*" onChange={handleFileSelected} />
      <video
        ref={videoRef}
        width="100%"
        height="100%"
        controls
        preload="metadata"
        src={previewSrc}
      />
    </div>
  );
}

export default App;
