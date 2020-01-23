const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect('mongodb+srv://johnny:jo1661213@omnistack-0j3pc.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

const connectedUsers = {};

io.on('connection', socket => {
	const { user_id } = socket.handshake.query;

	connectedUsers[user_id] = socket.id;
});

app.use((req,res, next) => {
	req.io = io;
	req.connectedUsers = connectedUsers;

	return next();
})
//(BACKEND da Aplicação)

// GET, POST, PUT, DELETE -> Metódos HTTP

//req.query = Acessar query params (para filtros)
//req.params = Acessar route params (para edição, delete)
//req.body = Acessar corpo da requisição (para criação, edição)

//Sequelize - Banco de Dados (Se quiser procurar outro tipo de banco)
app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3333);