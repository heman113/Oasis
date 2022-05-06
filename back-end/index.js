const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer,{
    cors: {origin: '*'}
});

let users = {};

const PORT = process.env.PORT || 3000;

io.on('connection', (client)=>{
    client.on('join',(name)=>{
        users[client.id]=name;
        client.emit("You have joined the chat");
        client.broadcast.emit("updtae", name+"has joined the chat");
        io.sockets.emit("update-people",users);
        console.log(users)
    });

    client.on('send',(msg)=>{
        io.sockets.emit("chat",users[client.id] ,msg , new Date());
    });

    client.on('disconnect',()=>{
        io.sockets.emit("updtae", users[client.id] + " has left the chat.");
        delete users[client.id];
        console.log(users);
        io.sockets.emit("update-people", users);
    });
});

httpServer.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})