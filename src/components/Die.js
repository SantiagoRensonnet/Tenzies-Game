import React from "react";

export default function Die({ id, value, isHeld, toggleHold, tenzies }) {
  let classStyle;
  if (tenzies) {
    classStyle = "die tenzies";
  } else {
    classStyle = isHeld ? "die held" : "die";
  }

  return (
    <div className={classStyle} onClick={() => toggleHold(id)}>
      {value}
    </div>
  );
}
