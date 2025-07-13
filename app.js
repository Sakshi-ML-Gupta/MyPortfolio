const express=require('express');
const app=express();
const http=require('http');//socket.io runs on http server
const socketio=require('socket.io');//Socket.IO is an event-driven(external events are passed to the server) library for real-time web applications
const path=require('path');

const server=http.createServer(app);
const io =socketio(server);//Socket.IO is a JavaScript library that enables real-time, bidirectional communication between the client (browser) and server

app.set('view engine','ejs')//EJS (Embedded JavaScript) is useful when you need to dynamically generate HTML on the server in a Node.js and Express.js application. Here’s why you might want to use it:
app.use(express.static(path.join(__dirname,'public')));

//this is reciever's end when on is used it means that is reciever's end
io.on('connection',(socket)=>{  //chatting apps are also created with socket.io
    socket.on('sendLocation',function(data){//sending the location to the backend
        io.emit('receiveLocation',{id:socket.id, ...data})//and then receiving the location from the frontend
    })
    socket.on('disconnect',function(){
        io.emit('userDisconnected',socket.id)
    })
})

app.get('/',(req,res)=>{
    res.render("index")
})

server.listen(3000);  //because we are using Socket.IO, which requires an HTTP server instance to work properly.