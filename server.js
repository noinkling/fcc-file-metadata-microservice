'use strict';
const express = require("express");
const Busboy = require('busboy');

const app = express();

app.set('views', __dirname);
app.set('view engine', 'jade');


app.get("*", (req, res) => {
  res.render("index");
});


app.post("*", getFileSizes, (req, res, next) => {
  
  if (!req.fileSizes[0])
    return next(new Error("There was a problem uploading the file"));
  
  res.json(req.fileSizes[0]);
  
});


// Start the server
const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Server listening on port ${server.address().port}`);
});


function getFileSizes(req, res, next) {
  // Provide an array for the data
  req.fileSizes = [];
  
  // Use Busboy to work with incoming file(s) as streams
  const busboy = new Busboy({ headers: req.headers });
  
  // For each incoming file...
  busboy.on("file", (fieldName, file, fileName, transferEncoding, type) => {
    let fileSize = 0;
    
    console.log(`Receiving file "${fileName}" of type "${type}" using "${transferEncoding}" encoding.`);
    
    // Increment size with each chunk received
    file.on("data", chunk => fileSize += chunk.length);
    
    // Push object into req.fileSizes array once entire file has been processed
    file.on("end", () => {
      req.fileSizes.push({
        name: fileName,
        size: fileSize
      });
      console.log(`File processed. Size: ${fileSize} bytes.`);
    });
    
  });
  
  // Continue normally once all files have been processed
  busboy.on("finish", next);
  
  // Start the processing
  req.pipe(busboy);
}
