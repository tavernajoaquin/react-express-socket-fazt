//importante poner en le package lock la linea  "type":"module", para poder importa los modulos
import express from 'express' //frame
import morgan from 'morgan' // muestra las llamadas http en la consola GET / 404 0.596 ms - 139
import {Server as SocketServer} from 'socket.io' //permite la comunicacion bidireccional
import http from 'http' //se importa porque hay q crear un servidor http para poder utilizar el socket.io
import cors from 'cors'
import { PORT } from './config.js'  //en backend, la importacion de modulos con "type":"module" necesita q se aclare la extension

const app = express(); //express crea un servidor http (para servir la pagina) pero no es compatible con socket.it
// console.log('app',app)
const server = http.createServer(app); //server http con la configuracion de express
const io = new SocketServer(server, {
  cors: {
    origin: 'http://localhost:3000',  // permiso para q el servidor de frontend se conecte con el backend
  }
}); // pasar servidor http a socket.io
app.use(morgan('dev'));

//tiene q ir antes del listen
io.on('connection', (socket) => { //cuando en socket io ocurre una conexion, se ejecuta la funcion
  console.log('a client connected ', socket.id) // id de conexion segun la instancia de front

  socket.on('message', (messageFrontend) => { //cuando el socket de front te envie un evento tipo 'message'
    console.log('mensaje en el back', messageFrontend);
    socket.broadcast.emit('message', {
      body:messageFrontend,
      from: socket.id
    })
  }) 
})



server.listen(4000)
console.log('Server empezado en puerto',PORT)