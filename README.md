# Convert Files to PDF

This project is a simple website to convert various file formats (like images) to PDF using Node.js and Express.

## Prerequisites

- Node.js and npm installed on your machine
- Git installed on your machine

## Installation

1. **Clone the repository**:

   Open your terminal or command prompt and run:

   ```sh
   git clone https://github.com/your-username/your-repository.git
2. Navigate to the project directory:

cd your-repository
3. Install the necessary packages:

Run the following command to install all the required packages:

npm install express multer pdf-lib cors libreoffice-convert sharp

 ## 4. File Structure
your-repository/
├── node_modules/
├── uploads/
├── public/
│   └── index.html
├── server.js
├── package.json
└── README.md
server.js: The main server file that handles file uploads and conversion

public/index.html: The frontend of the website where users can upload files for conversion

## 5. Running the Server
5.1. Starting the Server
To start the server, run the following command in your terminal:

node server.js
Once the server is running, you can access the application at http://localhost:3000.

5.2. Stopping the Server
To stop the server, press Ctrl + C in the terminal where the server is running.

## 6. Usage
Open your web browser: Navigate to http://localhost:3000.

Upload a file: Click the "Choose File" button and select the file you want to convert.

Convert the file: Click the "Convert" button to convert the file to PDF.

Download the PDF: The converted PDF will be downloaded automatically.

## 7. Code Overview
server.js
This file contains the backend logic to handle file uploads and conversion.
