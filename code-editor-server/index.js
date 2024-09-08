const express = require("express");
const app = express();
const http = require('http');
const env = require("dotenv");
const mongoose = require("mongoose"); // Optional if you are using MongoDB
const path = require("path");
const passport = require("passport");
const cors = require("cors");

// Load environment variables
env.config();

// Load socket initialization
const initializeSocket = require("./config/socket");

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Set up middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use("/uploads", express.static(__dirname + "/uploads"));

// Use routes
app.use("/", require("./routes"));

// Listen on the specified port
const port = process.env.PORT || 8000;

server.listen(port, (err) => {
  if (err) {
    return console.log("Error starting server", err);
  }
  console.log(`Server is running on port ${port}`);
});
