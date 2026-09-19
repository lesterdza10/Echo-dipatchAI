import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import User from './models/user.model.js';
dotenv.config();
const port=process.env.PORT || 5000;
const mongodbUrl=process.env.MONGODB_URI

const connectDb=async () => {
    try {
        await mongoose.connect(mongodbUrl)
        console.log('MongoDB connected')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
    }
}

const app = express();
const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin: process.env.NEXT_BASE_URL,
    }
});
io.on('connection',(socket)=>{

    
    socket.on("identity",async (userId)=>{
        socket.userId=userId;
        await User.findByIdAndUpdate(userId, { socketId: socket.id, isOnline: true });
    })

    socket.on("updateLocation",async({userId, latitude, longitude})=>{
        await User.findByIdAndUpdate(userId, { location: { type: 'Point', coordinates: [longitude, latitude] } });
        
    })
    socket.on("disconnect",async ()=>{
        if(!socket.userId) return;
        await User.findByIdAndUpdate(socket.userId, { socketId: null, isOnline: false });
    })
    
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDb();
    
})


