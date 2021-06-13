const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 5000;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()



const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.jumub.mongodb.net:27017,cluster0-shard-00-01.jumub.mongodb.net:27017,cluster0-shard-00-02.jumub.mongodb.net:27017/${process.env.DB_Name}?ssl=true&replicaSet=atlas-20e537-shard-0&authSource=admin&retryWrites=true&w=majority`;

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send("Hello Form DB, Its Working Succesfully")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
    
  app.post('/addProduct', (req, res) =>{
      const products = req.body;
    //   console.log(products);
    // productsCollection.insertMany(products)
    productsCollection.insertOne(products)
      .then(result => {
            console.log(result.insertedCount)
            res.send(result.insertedCount)
      })
  })
  
  app.get('/products', (req, res) => {
      productsCollection.find({})  //.limit(20)
      .toArray( (err, documents) => {
          res.send(documents)
      })
  })


  app.get('/product/:key', (req, res) => {
      productsCollection.find({key: req.params.key})  //.limit(20)
      .toArray( (err, documents) => {
          res.send(documents[0])
      })
  })

  app.post('/productByKeys', (req, res) => {
      const productKeys = req.body;
      productsCollection.find({key: { $in: productKeys}})  //.limit(20)
      .toArray( (err, documents) => {
          res.send(documents)
      })
  })

  app.post('/addOrder', (req, res) =>{
    const order = req.body;
  ordersCollection.insertOne(order)
    .then(result => {
          console.log(result.insertedCount)
          res.send(result.insertedCount > 0)
    })
})

});



app.listen(process.env.PORT || port)