import React, { useState, useMemo } from "react";

type QuadrantValues = {
  [key: string]: string;
};

type ActiveQuadrant = "TL" | "TR" | "BL" | "BR" | "CL" | "CR" | "LCL" | "LCR";

interface QuadrantGridProps {
  values?: QuadrantValues;
  activeQuadrant?: ActiveQuadrant;
  numberOfQuadrants?: number;
  showActiveClass: boolean;
}

const QuadrantGrid: React.FC<QuadrantGridProps> = ({
  values = {
    TL: "Top Left",
    TR: "Top Right",
    BL: "Bottom Left",
    BR: "Bottom Right",
    CL: "Center Left",
    CR: "Center Right",
    LCL: "Lower Center Left",
    LCR: "Lower Center Right"
  },
  activeQuadrant,
  numberOfQuadrants = 4,
  showActiveClass
}) => {
  const rows = useMemo(() => {
    const fullRows = Math.floor(numberOfQuadrants / 2);
    const hasExtra = numberOfQuadrants % 2;
    const layout = [];
    for (let i = 0; i < fullRows; i++) {
      layout.push([i * 2, i * 2 + 1]);
    }
    if (hasExtra) {
      layout.push([numberOfQuadrants - 1]);
    }
    return layout;
  }, [numberOfQuadrants]);

  const initialTexts = useMemo(() => {
    const defaultShorthand = ["TL", "TR", "BL", "BR", "CL", "CR", "LCL", "LCR"];
    return defaultShorthand.slice(0, numberOfQuadrants).map((sh) => values[sh]);
  }, [numberOfQuadrants, values]);

  const [texts, setTexts] = useState(initialTexts);

  const getQuadrantClass = (index: number) => {
    const shorthandLabels = ["TL", "TR", "BL", "BR", "CL", "CR", "LCL", "LCR"];
    return activeQuadrant === shorthandLabels[index] && showActiveClass
      ? "quadrant active"
      : "quadrant";
  };

  const handleTextChange = (index: number, value: string) => {
    const updatedTexts = [...texts];
    updatedTexts[index] = value;
    setTexts(updatedTexts);
  };

  return (
    <div className="grid">
      {rows.map((row, rowIndex) => (
        <div
          className={`row ${row.length === 1 ? "full-width" : ""}`}
          key={rowIndex}
        >
          {row.map((index) => (
            <div className={getQuadrantClass(index)} key={index}>
              <input
                className="editable-text"
                value={texts[index]}
                onChange={(e) => handleTextChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default QuadrantGrid;
