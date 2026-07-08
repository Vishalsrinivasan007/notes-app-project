import express from 'express'
import { protect } from '../middleware/middleware.js'
import { createNote, deleteNote, getNotes, updateNote } from '../Controllers/noteControllers.js'

let router=express.Router()

router.get('/',protect,getNotes)
router.post('/',protect,createNote)
router.put('/:id',protect,updateNote)
router.delete('/:id',protect,deleteNote)

export default router
