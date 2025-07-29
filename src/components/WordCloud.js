"use client";
import React, { useEffect, useRef } from "react";
import WordCloud from "wordcloud";

// Accept `wordcloud` as a prop
const WordCloudComponent = ({ wordcloud }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && Array.isArray(wordcloud) && wordcloud.length > 0) {
      WordCloud(canvasRef.current, {
        list: wordcloud,
        gridSize: 10,
        weightFactor: 30,
        fontFamily: "Kaisei Tokumin, sans-serif",
        color: () => {
          const darkColors = [
            "#0f172a", "#1e293b", "#334155",
            "#0c4a6e", "#082f49", "#172554",
            "#1e1b4b", "#000000"
          ];
          return darkColors[Math.floor(Math.random() * darkColors.length)];
        },
        backgroundColor: "#f8f9fc",
        rotateRatio: 0.3,
        rotationSteps: 2,
        drawOutOfBound: false
      });
    }
  }, [wordcloud]); // Watch for wordcloud prop change

  // If data is not available yet
  if (!Array.isArray(wordcloud) || wordcloud.length === 0) {
    return (
      <div className="flex justify-center items-center h-[400px] text-gray-500">
        Loading word cloud...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-white py-10">
      <canvas ref={canvasRef} width={800} height={400}></canvas>
    </div>
  );
};

export default WordCloudComponent;
