// src/components/NailScanner.jsx
import * as cam from "@mediapipe/camera_utils";
import { Hands } from "@mediapipe/hands";
import { useEffect, useRef } from "react";
import Webcam from "react-webcam";

const NailScanner = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#FF69B4"); // default pink polish

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.8,
    });

    hands.onResults((results) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw video
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.multiHandLandmarks.length > 0) {
        const lm = results.multiHandLandmarks[0];

        const nailTips = [4, 8, 12, 16, 20]; // Thumb, Index, Middle, Ring, Pinky
        const nailBases = [2, 6, 10, 14, 18];

        nailTips.forEach((tipIdx, i) => {
          const baseIdx = nailBases[i];
          const tip = lm[tipIdx];
          const base = lm[baseIdx];

          const x = tip.x * canvas.width;
          const y = tip.y * canvas.height;
          const bx = base.x * canvas.width;
          const by = base.y * canvas.height;

          const width = Math.abs(bx - x) * 1.5;
          const height = Math.abs(by - y) * 1.2;

          // Draw Nail Paint
          ctx.beginPath();
          ctx.ellipse(x, y, width / 2, height / 2, 0, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();

          // Optional: Show size in px
          const length = Math.sqrt((bx - x) ** 2 + (by - y) ** 2);
          ctx.fillStyle = "white";
          ctx.font = "12px Arial";
          ctx.fillText(`${length.toFixed(1)}px`, x - 15, y - 10);
        });
      }
    });

    if (webcamRef.current) {
      const camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, [color]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-[640px] h-[480px]">
        <Webcam ref={webcamRef} className="absolute w-full h-full" />
        <canvas ref={canvasRef} width={640} height={480} className="absolute w-full h-full" />
      </div>

      <div className="mt-4">
        <label className="text-white font-medium mr-2">Select Nail Color: </label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded border"
        />
      </div>
    </div>
  );
};

export default NailScanner;
