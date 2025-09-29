const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', socket => {
  let nick = '';

  socket.on('setNick', name => {
    nick = name.trim().substring(0, 20) || 'Anon';
    socket.emit('message', { user: 'System', text: `Добро пожаловать, ${nick}!` });
  });

  socket.on('sendMsg', msg => {
    if (!nick) return;
    const text = msg.trim().substring(0, 300);
    if (!text.length) return;
    io.emit('message', { user: nick, text });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Sealmes чат работает на порту ${PORT}`));
