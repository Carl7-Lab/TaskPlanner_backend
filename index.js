import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import conectarDB from './config/db.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareaRoutes from './routes/tareaRoutes.js'

const app = express()
app.use(express.json())

dotenv.config()

conectarDB()

//configurar CORS
const whiteList = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function(origin, callback){
        if (whiteList.includes(origin)) {
            //tiene permisos de consultar la api
            callback(null, true)
        } else {
            //no tiene permisos de consultar la api
            callback(new Error("Error de Cors"))
        }
    }
}

app.use(cors(corsOptions))

// Routing 
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/tareas', tareaRoutes)

const PORT = process.env.PORT || 4000

const servidor = app.listen(PORT, () =>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

// socket.io
import { Server } from 'socket.io'

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    }
})

io.on('connection', (socket) => {
    console.log("Conectado a socket.io")

    //definir eventos de socket.io
    socket.on('abrir proyecto', (proyecto) => {
        socket.join(proyecto)
    })

    socket.on("nueva tarea", (tarea) => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit("tarea agregada", tarea)
    })

    socket.on("eliminar tarea", (tarea) => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit("tarea eliminada", tarea)
    })

    socket.on("editar tarea", (tarea) => {
        const proyecto =tarea.proyecto
        socket.to(proyecto._id).emit("tarea editada", tarea)
    })

    socket.on("completar tarea", (tarea) => {
        const proyecto =tarea.proyecto
        socket.to(proyecto._id).emit("tarea completada", tarea)
    })
})