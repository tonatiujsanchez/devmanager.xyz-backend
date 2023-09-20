import express, { Application } from "express"

import socketIO from "socket.io"
import { createServer, Server as HttpServer } from "http"

import cors from 'cors'

import { dbConnection } from '../config/db'
import { projectsRoutes, usersRoutes, tasksRoutes, collaboratorsRoutes } from "../routes"

import { socketController } from "../controllers/socketIO"


class Server {

    private app: Application
    private port: string
    private server: HttpServer
    private io: socketIO.Server

    private paths = {
        users   : '/api/users',
        projects: '/api/projects',
        tasks   : '/api/tasks',
        collaborators: '/api/collaborators',
    }

    constructor() {
        this.app = express()
        this.port =  process.env.PORT || '4000'
        this.server = createServer(this.app)
        this.io = new socketIO.Server( this.server, {
            pingTimeout:60000,
            cors:{
                origin:process.env.FRONTEND_URL
            }
        })

        // db
        this.dbConnection()

        // middlewares
        this.middlewares()

        // Routes
        this.routes()

        // sockets
        this.sockets()
    }

    
    async dbConnection() {
        await dbConnection()
    }

    middlewares() {
        // CORS
        this.app.use( cors() )

        // Body parser
        this.app.use( express.json() )

        // public dir
        this.app.use( express.static('public') )
    }

    routes() {
        this.app.use(this.paths.users, usersRoutes)
        this.app.use(this.paths.projects, projectsRoutes)
        this.app.use(this.paths.tasks, tasksRoutes)
        this.app.use(this.paths.collaborators, collaboratorsRoutes)
        
        this.app.use('/hola', (req, res) => {
            res.send('Hola mundo!! 👾')
        })
    }
    
    sockets(){
        this.io.on('connection', ( socket )=> socketController(socket, this.io));
    }

    listen() {
        this.server.listen( this.port, ()=> {
            console.log(`Servidor corriendo en el puerto ${ this.port }`)
        })
    }
}


export default Server
