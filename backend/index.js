import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import noteRoutes from './routes/noteRoutes.js'
import connectDB from './config/db.js'

dotenv.config()
const app=express()
app.use(cors())
app.use(express.json())

app.use('/api/auth',authRoutes)
app.use('/api/notes',noteRoutes)

app.use((err,req,res,next)=>{
    res.status(500).json({message:err.message})
})
let PORT=process.env.PORT || 5000
await connectDB()
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})