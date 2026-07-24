import User from '../models/UserModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

function generateToken(id){
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'1d'})
}

export const registerUser=async(req,res)=>{
    try {
        let {name,email,password}=req.body;
        name=name?.trim()
        email=email?.trim().toLowerCase()
        if(!name || !email || !password){
            return res.status(400).json({success:false,message:"All fields required"})
        }
        if(!/^\S+@\S+\.\S+$/.test(email)){
            return res.status(400).json({success:false,message:"Please enter a valid email"})
        }
        if(password.length<6){
            return res.status(400).json({success:false,message:"Password must be at least 6 characters"})
        }
        let exist=await User.findOne({email})
        if(exist){
            return res.status(400).json({success:false,message:'Email already exist'})
        }
        let salt=await bcrypt.genSalt(10)
        let hashedpassword=await bcrypt.hash(password,salt)
        let newUser=await User.create({
            name,
            email,
            password:hashedpassword
        })
        res.status(201).json({success:true,message:'User Registered',token:generateToken(newUser._id)})
    } catch (error) {
        res.status(500).json({success:false,error:error.message})
    }
}

export const loginUser=async(req,res)=>{
    try {
        let {email,password}=req.body;
        email=email?.trim().toLowerCase()
        if(!email || !password){
            return res.status(400).json({success:false,message:'All fields required'})
        }
        let user=await User.findOne({email})
        if(!user){
            return res.status(400).json({success:false,message:'Invalid Credentials'})
        }
        let compare=await bcrypt.compare(password,user.password)
        if(!compare){
            return res.status(400).json({success:false,message:'Invalid Credentials'})
        }
        let token=generateToken(user._id)
        res.status(200).json({success:true,token:token,message:'Login Success'})
    }
     catch (error) {
        res.status(500).json({success:false,error:error.message})
    }
}
