import express from "express";
import multer from "multer";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import UploadModel from './model/upload.schema.js';
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Corrected static path

// Multer configuration for file uploads
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "uploads");
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
   },
});

const upload = multer({ storage });

// Route for uploading a file
app.post('/upload', upload.single('file'), async (req, res) => {

   if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
   }
   // Save the uploaded file information in the database
   const newFile = new UploadModel({
      name: req.file.filename,
      mimeType: req.file.mimetype,
      path: req.file.path,
   });

   await newFile.save();

   res.status(201).json({ message: 'File uploaded successfully' });

});

// Route for getting all uploaded files
app.get('/files', async (req, res) => {
   const files = await UploadModel.find().lean().exec();
   return res.status(200).json({ files });
});

// Route for deleting a file by ID
app.delete('/files/:id', async (req, res) => {
   try {
      const fileId = req.params.id;

      // Find the file in the database
      const file = await UploadModel.findById(fileId);
      if (!file) {
         return res.status(404).json({ message: 'File not found' });
      }

      // Delete the file from the filesystem
      fs.unlinkSync(file.path);

      // Delete the file record from the database
      await UploadModel.findByIdAndDelete(fileId);

      res.status(200).json({ message: 'File deleted successfully' });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
   }
});

// Server starting
app.listen(8080, async () => {
   await connectDB();
   console.log("Server is running on port 8080");
});
