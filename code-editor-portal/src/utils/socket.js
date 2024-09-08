import { io } from 'socket.io-client';
import { SOCKET_BASE_URL } from '../requestMethod';
export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    return io(SOCKET_BASE_URL, options);
};
