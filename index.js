'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const User = require('./models/user')

const app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.get('/user',(req,res)=>{
	User.find({}, (err, users)=>{
		if(err) return res.status(500).send({ message : `Error al realizar la peticion ${err}`})
		if(!users) return res.status(404).send({ message: `No existen usuarios`})
		res.send(200, { users })
	})
})

app.get('/user/:userId',(req,res)=>{
	let userId = req.params.userId
	User.findById(userId, (err, user)=>{
		if(err) return res.status(500).send({ message : `Error al realizar la peticion ${err}`})
		if(!user) return res.status(400).send({ message: `El Producto no existe`})
		res.status(200).send({ user })
	})
})

app.post('/user',(req,res)=>{
	console.log('POST /api/user')
	console.log(req.body)
	let user = new User()
	user.name = req.body.name
	user.password = req.body.password
	user.tipo = req.body.tipo

	user.save((err, userStored) => {
		if(err) res.status(500).send({message: `Error al salvar en la base de datos: ${err}`})
		res.status(200).send({ user: userStored })
	})
})

app.put('/user/:userId',(req,res)=>{
	let userId = req.params.userId
	let update = req.body
	User.findByIdAndUpdate(userId, update, (err, userUpdated)=>{
		if(err) res.status(500).send({message: `Error al actualizar al usuario : ${err}`})
		res.status(200).send({ user : userUpdated })
	})
})

app.delete('/user/:userId',(req,res)=>{
	let userId = req.params.userId
	User.findById(userId, (err, user)=>{
		if(err) res.status(500).send({message: `Error al borrar al usuario : ${err}`})
		user.remove(err => {
			if(err) res.status(500).send({message: `Error al borrar al usuario : ${err}`})
			res.status(200).send({ message: `El usuario ha sido eliminado`})
		})
	})
})
//join_walker sera la base de datos
mongoose.connect('mongodb://localhost:27017/join_walker',(err,res)=>{
	if (err) {
		return console.log(`Error al conectar a la base de datos: ${err}`)
	}
	console.log('Conexion a la base de datos extablecida....')

	app.listen(port,()=> {
		console.log(`API REST CORRIENDO EN EL PUERTO ${port}`);
	})

})
