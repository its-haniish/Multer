import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null); // State to store the selected file
  const [images, setImages] = useState([]); // State to store fetched images

  // Function to handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the selected file to state
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData(); // Create a new FormData object
    formData.append("image", file); // Append the file to FormData with key "image"

    try {
      // Send a POST request to localhost:8080/save with the form data using fetch
      const response = await fetch("https://multer-f54g.onrender.com/save", {
        method: "POST",
        body: formData,
      });
      const data = await response.text(); // Parse the response JSON
      console.log(data); // Log the response data
    } catch (error) {
      console.error("Error:", error); // Log any errors that occur
    }
  };

  // Function to fetch all images
  const fetchImages = async () => {
    try {
      console.log("Loading images...");
      const response = await fetch("https://multer-f54g.onrender.com/images");
      const data = await response.json();
      console.log("Images:", data);
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // Fetch images when component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <input type="text" value="image" />
        <input type="submit" />
      </form>
      <div className="image-container">
        {images.map((imageName, index) => (
          <img key={index} src={`https://multer-f54g.onrender.com/images/${imageName}`} alt={imageName} />
        ))}
      </div>
    </div>
  );
}

export default App;
