import mongoose from 'mongoose'


export const dbConnection = async() => {
    try {

        if(!process.env.MONGO_CNN){
            throw new Error('Url de Mongo requerido')
        }

        await mongoose.connect(process.env.MONGO_CNN)
        console.log('DB online')

    } catch (error) {
        console.log(`error => ${error}`)
        process.exit(1)
    }
}