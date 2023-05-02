import React, { useState } from "react";

function Slider() {
  const [value, setValue] = useState(50);

  const handleSliderChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleSliderChange}
      />
      <h1>${value}/Weeks</h1>
    </div>
  );
}

export default Slider;
