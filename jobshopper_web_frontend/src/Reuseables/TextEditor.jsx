import { useState } from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
 // Import styles

const TextEditor = ({
  errors,
  values,
  touched,
  setFieldValue,
  handleBlur,
  handleChange,
  validateInuts,
}) => {
  const modules = {
    toolbar: [
      [{ 'bold': true }, { 'italic': true } , { 'underline': true }  ] ,
      [{ 'header': '2' }],
      [{ 'list': 'bullet' }]   // Only allow bold and italic
    ],
  };

  const handleChanges = (value) => {
    setFieldValue("job_description", value);
  };

  return (
    <div>
      <p>Job Description *</p>
      <div
        className={`${
          errors.job_description && touched.job_description
            ? "border border-red-600"
            : ""
        }`}
      >
        <ReactQuill
          theme="snow"
          value={values.job_description}
          onChange={handleChanges} // handle change
          modules={modules} // Only allow bold and italic
          onBlur={handleBlur} // Optional: if you need to track blur for validation
        />
      </div>
      {errors.job_description && touched.job_description && (
        <p className="text-start px-1 text-sm font-semibold text-red-600">
          {errors.job_description}
        </p>
      )}
    </div>
  );
};

export default TextEditor;
