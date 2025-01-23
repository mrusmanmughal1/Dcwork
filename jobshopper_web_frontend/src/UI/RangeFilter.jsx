import React, { useState } from "react";

const PriceFilter = ({ setsearch }) => {
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(50000); // Adjusted max price for better range

  // Handle changes for both sliders
  const handleMinPriceChange = (e) => {
    const value = Math.min(e.target.value, maxPrice - 50); // Ensure minPrice is at least 50 less than maxPrice
    setMinPrice(value);
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.max(e.target.value, minPrice + 50); // Ensure maxPrice is at least 50 more than minPrice
    setMaxPrice(value);
  };

  const handlePriceFilter = () => {
    setsearch((val) => ({ ...val, rate_min: minPrice, rate_max: maxPrice }));
  };

  return (
    <div className="pt-2   max-w-sm">
      <h2 className="text-purple-900 font-semibold uppercase">Salary Filter</h2>
      <div className="flex justify-between text-gray-600 p-2">
        <span className="font-semibold text-sm text-btn-primary">
          Min : {minPrice}
        </span>
        <span className="font-semibold text-btn-primary text-sm">
          Max : {maxPrice}
        </span>
      </div>
      <div className="relative">
        {/* Range Slider Bar */}
        <div className="absolute inset-0 flex justify-between items-center w-full h-2 rounded-full">
          <div
            className="absolute h-2 bg-btn-primary rounded-full"
            style={{
              left: `${(minPrice / 100000) * 100}%`,
              right: `${100 - (maxPrice / 100000) * 100}%`,
            }}
          ></div>
        </div>

        {/* Min and Max Range Inputs */}
        <input
          type="range"
          min="0"
          max="100000"
          step="1"
          value={minPrice}
          onChange={handleMinPriceChange}
          className="absolute w-full h-2 z-10 bg-transparent cursor-pointer"
        />
        <input
          type="range"
          min="100"
          max="100000"
          step="1"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          className="absolute w-full h-2 z-10 bg-transparent cursor-pointer"
        />
      </div>

      <div className="mt-4">
        <button
          className="px-4 py-2 bg-btn-primary text-white rounded-md text-sm hover:bg-purple-700"
          onClick={handlePriceFilter}
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default PriceFilter;
