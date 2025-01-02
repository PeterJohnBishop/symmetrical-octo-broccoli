// Initiate the server 
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const cors = require('cors');
const app = express();

// Require HTTP and Socket.IO
const http = require('http'); 
const { Server } = require('socket.io');

// Require Routes
const validateFirebaseToken = require('./utils/validate.js')
const GeminiRoutes = require('./routes/GeminiRoutes.js');
const PostRoutes = require('./routes/PostRoutes.js');
const UploadRoutes = require('./routes/UploadRoutes.js');

dotenv.config();

const PORT = process.env.PORT; // 8080

// CORS Setup
const allowedOrigins = [
    /^http:\/\/localhost(:\d+)?$/, // localhost:allports
    process.env.BASE_URL, // https://rocky-bastion-37141-322a4508bb50.herokuapp.com/
    "http://192.168.0.134:8080", // localhost from iOS simulator
    "http://192.168.0.134:3000" // locaalhost from ReactApp
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
        // Allow requests with no origin (like mobile apps or curl requests)
        callback(null, true);
        } else if (allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
        callback(null, true);
        } else {
        callback(new Error('Not allowed by CORS'));
        }
    },
};

app.use(cors());
app.use(cors(corsOptions));

// Socket.IO Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  },
});

const configureSocketIO = (io) => {
    io.on('connection', (socket) => {
      console.log('A user connected on port:', PORT);
  
      socket.on('fromSwiftUI', (data) => {
        console.log(`Message received on port ${PORT}:`, data);
      });

      socket.on('fromReact', (data) => {
        console.log(`Message received on port ${PORT}:`, data);
      });
  
      socket.on('FireAuth', (data) => {
        console.log(`Message received on port ${PORT}:`, data);
      });
  
      socket.on('disconnect', () => {
        console.log(`User disconnected from port ${PORT}`);
      });
    });
  };

configureSocketIO(io); 

// Middleware
app.use(bodyParser.json());
app.use(validateFirebaseToken);
app.post("/test-secured-endpoint", validateFirebaseToken, (req, res) => {
  res.status(200).json({ message: "Authorized request", user: req.user });
});

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Symmetrical Server!');
  });
app.use('/gemini', GeminiRoutes);
app.use('/posts', PostRoutes);
app.use('/files', UploadRoutes);

server.listen(PORT, () => {
    console.log(`HTTP server and Socket.IO listening on http://localhost:${PORT}`);
  });