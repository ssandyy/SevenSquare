import { Camera } from '@mediapipe/camera_utils';
import { Hands } from '@mediapipe/hands';
import { useEffect, useRef, useState } from 'react';

const NailScanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [pattern, setPattern] = useState('flower.png');
  const patternImage = useRef(new Image());

  useEffect(() => {
    patternImage.current.src = `/patterns/${pattern}`;
  }, [pattern]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const nailTips = [4, 8, 12, 16, 20];

        nailTips.forEach((tipIndex) => {
          const tip = landmarks[tipIndex];
          const x = tip.x * canvas.width;
          const y = tip.y * canvas.height;

          // Draw the pattern image
          ctx.drawImage(patternImage.current, x - 16, y - 16, 32, 32);
        });
      }
    });

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <video ref={videoRef} className="hidden" />
      <canvas ref={canvasRef} width={640} height={480} className="border rounded" />

      <label className="text-white font-semibold">Choose Nail Pattern:</label>
      <select
        value={pattern}
        onChange={(e) => setPattern(e.target.value)}
        className="border p-1 rounded"
      >
        <option value="flower.png">🌸 Flower</option>
        <option value="heart.png">❤️ Heart</option>
        <option value="star.png">⭐ Star</option>
      </select>
    </div>
  );
};

export default NailScanner;
