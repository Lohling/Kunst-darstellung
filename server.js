const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Verzeichnis für deine HTML-Dateien
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Ein Gerät verbunden');

    // Wenn Handy B ein Foto schickt
    socket.on('send-photo', (data) => {
        console.log('Foto erhalten, leite weiter...');
        // Sende es an alle anderen Geräte (Handy A)
        socket.broadcast.emit('receive-photo', data);
    });
});

const PORT = 3000; 
http.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});