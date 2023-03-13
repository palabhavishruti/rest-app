const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3005


const {getdatasets}=require('./dbconnection')
const {getdatasetsbyid}=require('./dbconnection')
const {createdatasets}=require('./dbconnection')
const {updatedatasets}=require('./dbconnection')
const {deletedatasets}=require('./dbconnection')

app.get('/', (request, response) => {
    response.json({ info: 'this is datasets database' })
  })
  
  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  app.get('/datasets', getdatasets)
  app.get('/datasets/:id',getdatasetsbyid)
  app.post('/datasets', createdatasets)
  app.patch('/datasets/:id',updatedatasets)

  app.delete('/datasets/:id',deletedatasets)

  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })  