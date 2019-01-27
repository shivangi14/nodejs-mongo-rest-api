const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const errorHandler = require('errorhandler')
const mongodb = require('mongodb')

const url = 'mongodb://localhost:27017/lab-db'
let app = express()
const mongoClient = mongodb.MongoClient
app.use(logger('dev'))
app.use(bodyParser.json())

mongoClient.connect(url,(err,database)=>{
    if(err) return process.exit(1)
    console.log("Successfully connected")
    let db = database.db('lab-db')

    app.get('/accounts',(req,res,next)=>{
        db.collection('accounts')
            .find({},{sort :{_id :-1}})
            .toArray((err,data)=>{
                if(err) return next(err)
                res.send(data)
            })
    })

    app.post('/accounts',(req,res,next)=>{
        let newAccount = {}
        if(req.body.email && req.body.username){
            newAccount.email = req.body.email
            newAccount.username = req.body.username
        }
        db.collection('accounts')
            .insertOne(newAccount,(err,result)=>{
                if(err) return next(err)
                console.log('Account added.')
                res.send(result)
            })
    })

// mongodb.ObjectID(req.params.id) -> convert string id to mongodb ObjectID

    app.put('/accounts/:id',(req,res,next)=>{
        db.collection('accounts')
            .update({_id: mongodb.ObjectID(req.params.id)},{$set: req.body},(error, results)=>{
                if(error) return next(error)
                console.log('Account updated.')
                res.send(results)
            })
    })

    app.delete('/accounts/:id',(req,res,next)=>{
        db.collection('accounts')
            .remove({_id: mongodb.ObjectID(req.params.id)},(err, results)=>{
                if(err) return next(err)
                console.log('Account deleted')
                res.send(results)
            })
    })

   // database.close()

    app.use(errorHandler())
    app.listen(3000)
})

