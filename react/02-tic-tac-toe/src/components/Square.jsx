import React from "react";

export function Square({ children, isSelected, updateBoard, index }) {
  const className = `square ${isSelected ? "is-selected" : ""}`;

  const handleClick = () => {
    if (!updateBoard) {
      return;
    }
    updateBoard(index);
  };

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
}
