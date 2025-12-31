import { useEffect, useState } from "react";

import "./App.css";

const initialPosition = { x: -50, y: -50 };

function App() {
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const newPosition = {
        x: event.clientX,
        y: event.clientY,
      };
      setPosition(newPosition);
    };

    if (enabled) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      setPosition(initialPosition); // Reset position when disabled
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [enabled]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          border: "1px solid #fff",
          borderRadius: "50%",
          opacity: 0.8,
          pointerEvents: "none",
          left: -25,
          top: -25,
          width: 50,
          height: 50,
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      />
      <button onClick={() => setEnabled(!enabled)}>
        {enabled ? "Disable" : "Enable"} Mouse Follower
      </button>
    </>
  );
}

export default App;
