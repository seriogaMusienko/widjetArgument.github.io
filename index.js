var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var $isLogin = 0;
server.listen(3000);

//отслеживание ссылки
app.get('/', function(request,respons){
    respons.sendFile(__dirname + '/index.html');
});//если пользователь будет на главной странице оо его перекинет на index.html

app.get('/operator', function(request,respons){
    console.log($isLogin);
    if($isLogin == 0){
        respons.sendFile(__dirname + '/login.html');
    }
    else{
        respons.sendFile(__dirname + '/operator.html');
    }
});

app.get('/login', function(request,respons){
    respons.sendFile(__dirname + '/login.html');
});


users = [];
connections = [];

io.sockets.on('connection', function(socket){
    console.log("Успешное соединение");
    connections.push(socket);

    socket.on('disconnect', function(data){//если человек выход из сайта(отключаеться) то удаляем его из массива
        connections.splice(connections.indexOf(socket), 1);
        console.log("Отключились");
    });

    socket.on('send mess', function(data){//data єто параметр который мы передаем в index.html
        io.sockets.emit('add mess', {mess: data.mess, name: data.name, userID: data.userID});

    });

    socket.on('send messOperator', function(data){//data єто параметр который мы передаем в index.html
        io.sockets.emit('add messOperator', {mess: data.mess, userID: data.userID});

    });

    socket.on('new name', function(data){//data єто параметр который мы передаем в index.html
        io.sockets.emit('add name', {name: data.name, userID: data.userId});

    });
    socket.on('send login', function(data){//data єто параметр который мы передаем в index.html
        $isLogin = data.isTrue;
        io.sockets.emit('add login', {check: data.isTrue});
    });

    
});