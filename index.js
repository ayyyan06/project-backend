import express from "express"
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'

import { registerValidation, loginValidation, postCreateValidation } from './validations.js'

import {UserController, PostController} from './controllers/index.js'
import {handleValidationErrors, checkAuth} from "./utils/index.js"

mongoose.connect
    ('mongodb+srv://ayankunirbaev:wwwwww@cluster0.n1cmf.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0') 
    .then(() => console.log('DB is ok'))
    .catch(() => console.log('DB err', err))

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if(!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000'
}))

app.post('/auth/login', handleValidationErrors, loginValidation, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors,  UserController.register)
// app.post('/register', handleValidationErrors, registerValidation, UserController.register)

app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req,res) => {
    res.json({
        url: ('/uploads/'+req.file.originalname)
    })
})

// app.use(cors())

app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {  
    res.send("Hello world")
})

app.get('/tags', PostController.getLastTags)
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.get('/posts/tags', PostController.getLastTags)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.delete('/posts/:id', checkAuth,  PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

app.listen(process.env.PORT || 4444, (err) => {
    if(err) {
        return console.log(err)
    }
    
    console.log('server is Ok')
})