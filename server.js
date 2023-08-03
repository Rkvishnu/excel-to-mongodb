// server.js
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from 'cors';
import xlsx from 'xlsx';
import { addCandidates } from "./controllers/candidateController.js";

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());

// Prepare for the change by setting 'strictQuery' to false
mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/candidatesDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Function to read Excel and extract candidates
function readExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const candidates = xlsx.utils.sheet_to_json(sheet, { raw: true, defval: null });
  return candidates;
}

// Serve the HTML form for uploading the Excel file
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

// API endpoint to upload Excel file
app.post("/add", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const excelFilePath = req.file.path;
  // Read the Excel file and extract candidate data into an array of objects
  const candidates = readExcel(excelFilePath);
  // Call the function to add candidates to the database
  addCandidates(candidates, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: "An error occurred while processing the Excel file." });
    } else {
      res.setHeader("Content-Type", "application/json"); // Set the response content type
      res.json({ message: "Excel file processed successfully." });
    }
  });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
