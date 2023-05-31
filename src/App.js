import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [selectedImg, setSelectedImg] = useState(null);
  const [outputImg, setOutputImg] = useState(null);
  const [prompt, setPrompt] = useState(
    "Create WSJ hedcut-style portraits with a vintage newspaper feel, using a simple yet effective line work to capture subjects' unique features. Focus on thick lines, dots, and hatching techniques to suggest contours, facial structure, hair, and accessories. Use stippling to create texture while keeping a minimalist approach. To achieve an old-age newspaper feel, desaturate the colors, limiting them to shades of black and white. Seize the limited color palette to create contrast through shading and bold lines. Apply a texture effect to the portraits and add a halftone filter to create a print-like look. Aim for a WSJ hedcut style while incorporating the vintage printing feel."
  );
  const [strength, setStrength] = useState(0.5);
  const [steps, setSteps] = useState(25);
  const [guidance, setGuidance] = useState(9);
  const [seed, setSeed] = useState(1887667748);
  const [scheduler, setScheduler] = useState("euler_a");

  const handleProcess = async () => {
    const reader = new FileReader();
    let base64String = "";
    reader.readAsDataURL(selectedImg);
    reader.onload = async function () {
      base64String = `${reader.result
        .replace("data:", "")
        .replace(/^.+,/, "")}`;
      const mimeType = "image/png";
      const tempImg = `${base64String}`;
      setOutputImg(tempImg);
      const url = "https://api.getimg.ai/v1/stable-diffusion/controlnet";

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_GETIMG_APIKEY}`,
      };

      const data = {
        model: "realistic-vision-v1-3",
        controlnet: "lineart-1.1",
        prompt: prompt,
        negative_prompt: "Disfigured, cartoon, blurry",
        image: tempImg,
        strength: strength,
        steps: steps,
        guidance: guidance,
        seed: seed,
        num_images: 4,
        scheduler: scheduler,
        output_format: "png",
        width: 512,
        height: 512,
      };
      try {
        const result = await axios.post(url, data, {
          headers: headers,
        });
        const _outputImg = `data:${mimeType};base64,${result.data.image}`;
        setOutputImg(_outputImg);
      } catch (err) {
        console.log("err = ", err);
      }
    };
  };

  return (
    <div>
      <div className="app-container">
        <div className="title">
          <h1>Generate Avatar demo site</h1>
        </div>
        <div className="generate-container">
          <div className="input-part">
            {selectedImg && (
              <div>
                <img
                  className="input-image"
                  src={URL.createObjectURL(selectedImg)}
                  alt="input-image"
                />
              </div>
            )}
            <input
              type="file"
              onChange={(e) => {
                setSelectedImg(e.target.files[0]);
              }}
            />
            <div className="input-field">
              <label>Prompts: </label>
              <input
                className="form-control-input"
                type="string"
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                }}
              />
            </div>
            <div className="input-field">
              <label>Strength: </label>
              <input
                className="form-control-input"
                type="number"
                value={strength}
                onChange={(e) => {
                  setStrength(e.target.value);
                }}
              />
            </div>
            <div className="input-field">
              <label>Seed: </label>
              <input
                className="form-control-input"
                type="number"
                value={seed}
                onChange={(e) => {
                  setSeed(e.target.value);
                }}
              />
            </div>
            <div className="input-field">
              <label>Guidance: </label>
              <input
                className="form-control-input"
                type="number"
                value={guidance}
                onChange={(e) => {
                  setGuidance(e.target.value);
                }}
              />
            </div>
            <div className="input-field">
              <label>Steps: </label>
              <input
                className="form-control-input"
                type="number"
                value={steps}
                onChange={(e) => {
                  setSteps(e.target.value);
                }}
              />
            </div>
            <div className="input-field">
              <label>Scheduler: </label>
              <select
                className="form-control-input"
                value={scheduler}
                onChange={(e) => {
                  setScheduler(e.target.value);
                }}
              >
                <option value={`euler_a`}>Euler_A</option>
                <option value={`euler`}>Euler</option>
                <option value={`lms`}>LMS</option>
                <option value={`ddim`}>DDIM</option>
                <option value={`dpmsolver++`}>DPMSOLVER++</option>
                <option value={`pndm`}>PNDM</option>
              </select>
            </div>
            <button
              style={{ margin: "20px" }}
              className="form-control-input"
              onClick={handleProcess}
            >
              Generate Avatar
            </button>
          </div>
          <div className="output-part">
            {outputImg && (
              <img className="input-image" src={outputImg} alt="output-image" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
