const express = require('express');
const multer = require('multer');
const path = require('path');

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Configure Multer storage
// Use diskStorage to customize file storage, filename, etc.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the folder to store uploaded files
    const uploadPath = path.join(__dirname, 'uploads');
    
    // Ensure the 'uploads' folder exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Use the original name or create a custom filename
    const ext = path.extname(file.originalname); // Get file extension
    const fileName = Date.now() + ext + ".webm"; // Unique filename (timestamp + extension)
    cb(null, fileName); // Save the file with the new name
  }
});

// Initialize multer with the defined storage configuration
const upload = multer({ storage: storage });

// Enable CORS (you can refine this as needed)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// POST route to handle file upload
app.post('/upload', upload.single('video'), (req, res) => {
  // Check if file exists in request
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // The uploaded file is available in req.file
  console.log('File uploaded:', req.file);

  // Respond with the file information or a success message
  res.status(200).send({
    message: 'Video uploaded successfully!',
    file: req.file
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
