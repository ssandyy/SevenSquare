import { useRef, useState } from "react";

const ImageDetector = () => {
  const [imageURL, setImageURL] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [color, setColor] = useState("#e91e63"); // default nail paint

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageURL(URL.createObjectURL(file));
    }
  };

  const drawMockNails = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    // Clear and draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // 🧪 MOCK NAILS (You’ll replace with real detection later)
    const mockNails = [
      { x: 150, y: 200, w: 30, h: 20 },
      { x: 200, y: 190, w: 30, h: 20 },
      { x: 250, y: 185, w: 30, h: 20 },
      { x: 300, y: 190, w: 30, h: 20 },
      { x: 350, y: 200, w: 30, h: 20 },
    ];

    mockNails.forEach((nail) => {
      ctx.beginPath();
      ctx.ellipse(nail.x, nail.y, nail.w / 2, nail.h / 2, 0, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {imageURL && (
        <div className="relative w-[640px] h-[480px]">
          <img
            ref={imageRef}
            src={imageURL}
            alt="Uploaded hand"
            width={640}
            height={480}
            onLoad={drawMockNails}
            className="absolute"
          />
          <canvas ref={canvasRef} width={640} height={480} className="absolute" />
        </div>
      )}

      {imageURL && (
        <div className="mt-2">
          <label className="text-white font-medium mr-2">Nail Color: </label>
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              drawMockNails();
            }}
            className="w-10 h-10 rounded border"
          />
        </div>
      )}
    </div>
  );
};

export default ImageDetector;
