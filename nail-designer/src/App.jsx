import ImageDetector from "./components/ImageDetector";
import NailScanner from "./components/NailScanner";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">🖼️ Nail Detection</h1>
      <ImageDetector />
      <h1 className="text-2xl font-bold mt-12 mb-4">🎥 Real-Time Detection</h1>
      <NailScanner />
    </div>
  );
};

export default App;
