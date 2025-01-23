import { useEffect, useState } from "react";

import Select from "react-select";
import { FiMapPin } from "react-icons/fi";

const CountryStateCity = ({
  setFieldValue,
  values,
  style,
  errors,
  handleChange,
  touched,
  Countries,
  icon,
}) => {
  const [countrySelected, setcountrySelected] = useState(values?.country || "");
  const [statesdata, setStates] = useState([]);
  const [states, sState] = useState(values?.state || "");
  const [cities, setCities] = useState([]);
  const [City, setCity] = useState(values?.city || "");
  useEffect(() => {
    setFieldValue("country", values.country);

    setFieldValue("state", values.state);

    setFieldValue("city", values.city);
  }, []);

  useEffect(() => {
    // Fetch states when country changes
    if (countrySelected) {
      const selectedCountry = Countries?.data?.find(
        (val) => val?.Country_name === countrySelected
      );
      setStates(selectedCountry ? selectedCountry : []); // Set states based on the filtered result
    }
  }, [countrySelected, Countries, setFieldValue]);

  useEffect(() => {
    // Fetch states when country changes
    if (statesdata) {
      const Selectedstates = statesdata?.states?.find(
        (val) => val?.state_name == states
      );
      setCities(Selectedstates ? Selectedstates : []); // Set states based on the filtered result
    }
  }, [statesdata, states, setFieldValue]);
  useEffect(() => {
    if (City) {
      setFieldValue("city", City);
    }
  }, [City, setFieldValue]);
  const handleChangeCountry = (SELECTED) => {
    setcountrySelected(SELECTED.label);
    setFieldValue("country", SELECTED.value);
    setFieldValue("state", "");
    setFieldValue("city", "");
    sState("");
    setCity("");
  };

  const handleChangeState = (SELECTED) => {
    sState(SELECTED.value);
    setFieldValue("state", SELECTED.value);
  };
  const handleCities = (SELECTED) => {
    setFieldValue("city", SELECTED.value);
    setCity(SELECTED.value);
  };
  return (
    <div className={style}>
      <div className="">
        {/* Countries */}
        <label htmlFor="country" className="block text-black mb-1">
          Country*
        </label>

        <div
          className={`flex items-center    bg-gray-200 px-2 ${
            errors.country && touched.country ? " border border-red-600" : ""
          }`}
        >
          <FiMapPin className={icon} />
          <Select
            className="w-full   "
            name="country"
            id="country"
            onChange={handleChangeCountry}
            value={
              countrySelected
                ? { value: countrySelected, label: countrySelected }
                : null
            }
            options={Countries?.data?.map((option) => ({
              value: option.Country_name,
              label: option.Country_name,
            }))}
          />
        </div>

        {errors.country && touched.country && (
          <p className="text-start px-1 text-sm font-semibold text-red-600">
            {errors.country}
          </p>
        )}
      </div>
      <div className="">
        <label htmlFor="state" className="block text-black mb-1">
          State*
        </label>
        <div
          className={`flex items-center   bg-gray-200 px-2 ${
            errors.state && touched.state ? " border border-red-600" : ""
          }`}
        >
          <FiMapPin className={icon} />

          <Select
            className="w-full"
            name="state"
            id="state"
            placeholder="Select State"
            onChange={handleChangeState}
            value={
              states ? { value: values?.state, label: values?.state } : null
            }
            options={statesdata?.states?.map((option) => ({
              value: option.state_name,
              label: option.state_name,
            }))}
          />
        </div>
        <div className="">
          {errors.state && touched.state && (
            <p className="text-start px-1 text-sm font-semibold text-red-600">
              {errors.state}
            </p>
          )}
        </div>
      </div>
      <div className="">
        <label htmlFor="city" className="block text-black mb-1">
          City*
        </label>
        <div
          className={`flex items-center   bg-gray-200 px-2 ${
            errors.city && touched.city ? " border border-red-600" : ""
          }`}
        >
          <FiMapPin className={icon} />

          {cities?.cities?.length > 0 ? (
            <Select
              className="w-full"
              name="city"
              id="city"
              placeholder="Select City"
              onChange={handleCities}
              value={City ? { value: City, label: City } : null}
              options={cities?.cities?.map((option) => ({
                value: option,
                label: option,
              }))}
            />
          ) : (
            <input
              type="text"
              name="city"
              id="city"
              className="py-3 bg-gray-200 px-2 outline-none w-full"
              placeholder="Enter City"
              onChange={handleChange}
              value={values.city}
            />
          )}
        </div>
        <div className="">
          {errors.city && touched.city && (
            <p className="text-start px-1 text-sm font-semibold text-red-600">
              {errors.city}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryStateCity;
