// FileUploadForm.js
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const FileUploadForm = () => {
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setErrorMessage("Please select a file.");
      setSuccessMessage("");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/add", formData);

      if (response.status === 200) {
        const message="Thank you, file uploaded successfully. Your records will be processed shortly.";
        setSuccessMessage(message);
        setErrorMessage("");

      } else {
        setErrorMessage("An error occurred while uploading the file.");
        setSuccessMessage("");
      }
    } catch (err) {
      setErrorMessage("An error occurred while uploading the file.");
      console.log(err.message)
      setSuccessMessage("");
    }
  };

  return (
    <div className="form-container">
      <h1>Add Candidates to the Database</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="file">Select Excel File:</label>
          <input type="file" id="file" name="file" accept=".xlsx" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <button type="submit">Upload</button>
        </div>
      </form>

      {successMessage && <div className="message success">{successMessage}</div>}
      {errorMessage && <div className="message error">{errorMessage}</div>}
    </div>
  );
};

export default FileUploadForm;
