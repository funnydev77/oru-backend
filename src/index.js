"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const diagnosticService_1 = require("./services/diagnosticService");
const app = (0, express_1.default)();
const port = 5000;
// Ensure the uploads directory exists
const uploadsDir = path_1.default.join(__dirname, 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Set up multer storage for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Use the absolute path
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Using timestamp to avoid name collisions
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
// API endpoint to upload and process ORU file
app.post('/upload-oru', upload.single('oruFile'), (req, res, next) => {
    if (!req.file) {
        // Send the response and exit the function
        res.status(400).send("No file uploaded.");
        return; // Exit function after sending response
    }
    // Use the path provided by multer which is more reliable
    const oruFilePath = req.file.path;
    try {
        try {
            const result = (0, diagnosticService_1.processDiagnosticData)(oruFilePath);
            res.json(result);
        }
        catch (error) {
            console.error("Error processing ORU file:", error);
            next(error);
        }
    }
    catch (error) {
        console.error("Error processing ORU file:", error);
        next(error);
    }
});
app.get('/upload-oru', (req, res, next) => {
    // Use the path provided by multer which is more reliable
    const oruFilePath = './src/uploads/oru.txt';
    try {
        const result = (0, diagnosticService_1.processDiagnosticData)(oruFilePath);
        res.json(result);
    }
    catch (error) {
        console.error("Error processing ORU file:", error);
        next(error);
    }
});
app.get('/', (req, res, next) => {
    try {
        res.send('hello!');
    }
    catch (error) {
        console.error("Error processing ORU file:", error);
        next(error);
    }
});
// Basic Error Handling Middleware (add after all routes)
app.use((err, req, res, next) => {
    console.error(err.stack);
    // Avoid sending stack trace in production
    res.status(500).send('Something broke!');
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
