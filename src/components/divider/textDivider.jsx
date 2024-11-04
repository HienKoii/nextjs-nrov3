import React from "react";

function TextDivider({ text, colorText }) {
  return (
    <div className="text-divider">
      <hr className="divider-line me-2" />
      <span className={`divider-text text-${colorText ? colorText : "dark"} `}>{text}</span>
      <hr className="divider-line ms-2" />
    </div>
  );
}

export default TextDivider;
