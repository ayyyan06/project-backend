import express from "express"
import mongoose from 'mongoose'

import { registerValidation, loginValidation, postCreateValidation } from './validations.js'

import checkAuth from "./utils/checkAuth.js"

import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'

mongoose.connect
    (
        'mongodb+srv://ayankunirbaev:wwwwww@cluster0.n1cmf.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'
    ) 
    .then(() => console.log('DB is ok'))
    .catch(() => console.log('DB err', err))
const app = express()

app.use(express.json())

app.get('/', (req, res) => {  
    res.send("Hello world")
})

app.post('/auth/login', loginValidation, UserController.login)

app.post('/auth/register', registerValidation, UserController.register)

app.post('/posts', checkAuth, postCreateValidation, PostController.create)

app.get('/posts', PostController.getAll)

app.get('/posts/:id', PostController.getOne)

app.patch('/posts/:id', checkAuth, PostController.update)

app.delete('/posts/:id', checkAuth,  PostController.remove)

app.get('/auth/me', checkAuth, UserController.getMe)

app.listen(4444, (err) => {
    if(err) {
        return console.log(err)
    }

    console.log('server is Ok')
})