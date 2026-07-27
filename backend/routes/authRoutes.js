import express from 'express';
import { getMe, loginUser, registerUser } from '../Controllers/authControllers.js';
import { protect } from '../middleware/middleware.js';

let router=express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/me',protect,getMe)

export default router
