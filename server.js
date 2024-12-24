// Import the express module
const express = require('express');

// Import the multer module for handling file uploads
const multer = require('multer');

// Import the libreoffice-convert module for converting files to PDF
const libre = require('libreoffice-convert');

// Import the PDFDocument class from the pdf-lib module for creating PDF documents
const { PDFDocument } = require('pdf-lib');

// Import the fs module for file system operations
const fs = require('fs');

// Import the path module for working with file and directory paths
const path = require('path');

// Import the cors module to enable Cross-Origin Resource Sharing
const cors = require('cors');

// Create an instance of express
const app = express();

// Set up multer for handling file uploads, storing files in the 'uploads' directory
const upload = multer({ dest: 'uploads/' });

// Use the cors middleware to enable Cross-Origin Resource Sharing
app.use(cors());

// Enable pre-flight requests for all routes
app.options('*', cors());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define a POST route for converting files to PDF
app.post('/convert', upload.single('file'), async (req, res) => {
    // Get the uploaded file from the request
    const file = req.file;

    // Check if a file was uploaded
    if (!file) {
        // Log an error message and send a 400 status response if no file was uploaded
        console.error('No file uploaded.');
        return res.status(400).send('No file uploaded.');
    }

    // Log the name of the uploaded file
    console.log(`File uploaded: ${file.originalname}`);

    // Define the input and output file paths
    const inputPath = path.join(__dirname, file.path);
    const outputPath = path.join(__dirname, `${file.path}.pdf`);

    try {
        // Check if the uploaded file is an image
        if (file.mimetype.startsWith('image/')) {
            // Handle image files
            console.log('Converting image to PDF...');
            
            // Read the image file
            const imageBytes = fs.readFileSync(inputPath);

            // Create a new PDF document
            const pdfDoc = await PDFDocument.create();

            // Embed the image into the PDF
            let image;
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
                image = await pdfDoc.embedJpg(imageBytes);
            } else if (file.mimetype === 'image/png') {
                image = await pdfDoc.embedPng(imageBytes);
            } else {
                // Throw an error if the image type is unsupported
                throw new Error('Unsupported image type.');
            }

            // Get the dimensions of the image
            const { width, height } = image.scale(1);

            // Add a page to the PDF and draw the image
            const page = pdfDoc.addPage([width, height]);
            page.drawImage(image, { x: 0, y: 0, width, height });

            // Serialize the PDF to bytes and save to a file
            const pdfBytes = await pdfDoc.save();
            fs.writeFileSync(outputPath, pdfBytes);
        } else {
            // Handle non-image files (documents, spreadsheets, etc.)
            console.log('Converting document to PDF...');

            // Read the file to a buffer
            const buffer = fs.readFileSync(inputPath);

            // Convert the file to PDF using libreoffice-convert
            const converted = await new Promise((resolve, reject) => {
                libre.convert(buffer, '.pdf', undefined, (err, done) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(done);
                    }
                });
            });

            // Write the converted PDF to a file
            fs.writeFileSync(outputPath, converted);
        }

        // Send the converted PDF file to the client
        res.download(outputPath, `${file.originalname.replace(/\.[^/.]+$/, '')}.pdf`, (err) => {
            // Clean up the uploaded and converted files
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        });
    } catch (error) {
        // Log an error message and send a 500 status response if an error occurs
        console.error('Error converting file:', error);
        res.status(500).send('Error converting file.');
    }
});

// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});