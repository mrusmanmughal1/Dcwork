import { useState } from "react";
import RangeSlider from "react-range-slider-input";
const MultiRange = () => {
  const [value, setValue] = useState([0, 10]);
  return (
    <div>
      <RangeSlider value={value} className="" onInput={setValue} />
    </div>
  );
};

export default MultiRange;
