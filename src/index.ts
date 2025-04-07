// src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';

import fs from 'fs';
import { processDiagnosticData } from './services/diagnosticService';

const app = express();
app.use(cors({
    origin: '*'
}));
app.use(express.json());

const port = 5000;

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use the absolute path
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Using timestamp to avoid name collisions
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// Define a type for the request to include the file property
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

// API endpoint to upload and process ORU file
app.post('/upload-oru', upload.single('oruFile'), (req: MulterRequest, res: Response, next: NextFunction) => {
    if (!req.file) {
        // Send the response and exit the function
        res.status(400).send("No file uploaded.");
        return; // Exit function after sending response
    }

    // Use the path provided by multer which is more reliable
    const oruFilePath = req.file.path;

    try {
        try {
            const result = processDiagnosticData(oruFilePath);
            res.json(result);
        } catch (error) {
            console.error("Error processing ORU file:", error);
            next(error);
        }
    } catch (error) {
        console.error("Error processing ORU file:", error);
        next(error);
    }
});

app.get('/upload-oru', (req: MulterRequest, res: Response, next: NextFunction) => {
    // Use the path provided by multer which is more reliable
    const oruFilePath = './src/uploads/oru.txt';

    try {
        const result = processDiagnosticData(oruFilePath);
        res.json(result);
    } catch (error) {
        console.error("Error processing ORU file:", error);
        next(error);
    }
});

app.get('/', (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
        res.send('hello!');
    } catch (error) {
        console.error("Error processing ORU file:", error);
        next(error);
    }
});

// Basic Error Handling Middleware (add after all routes)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    // Avoid sending stack trace in production
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
