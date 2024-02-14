import { Server, Socket } from "socket.io"


export const socketController = async(socket:Socket, io:Server) => {



    socket.on('open-project', ({ idProject })=> {
        socket.join(idProject)
        // socket.to(idProject).emit('open-project-response', { hola:'Mundo', idProject })    
    })
    
    socket.on('new-task', ({ task })=>{        
        socket.to(task.project).emit('new-task-response', { task })    
    })

    socket.on('edit-task', ({ task })=>{                
        socket.to(task.project._id).emit('edit-task-response', { task })    
    })

    socket.on('delete-task', ({ task })=>{      
        socket.to(task.project._id).emit('delete-task-response', { task })    
    })
    
    socket.on('complete-task', ({ task })=>{
        socket.to(task.project).emit('complete-task-response', { task })    
    })
}