import mongoose from 'mongoose';

// Conecta con mongodb atlas usando la cadena de conexion del archivo .env
export async function conectarDB(){
    const uri = process.env.MONGODB_URI;
    if (!uri){
        throw new Error('falta MONGODB_URI en el archivo .env');
    }
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB Atlas');
}
