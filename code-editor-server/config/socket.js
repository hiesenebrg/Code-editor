const { Server } = require('socket.io');
const { handleSocketConnection } = require('../controllers/socket');


const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // For development, allow all origins
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        },
        transports: ['websocket', 'polling'] // Use WebSocket as the preferred transport
    });

    handleSocketConnection(io);
};

module.exports = initializeSocket;

