const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.local || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();

app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2cqrt9g.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{
        client.connect();
        const serviceCollection = client.db("doctors_portal").collection("services");
        const bookingCollection = client.db("doctors_portal").collection("booking");

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        });

        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const query = {treatment: booking.treatment, date: booking.date, patient: booking.pa};
            
        })
    }
    finally{

    }


}

run().catch(console.dir());

app.get('/', (req, res) => {
    res.send('Hello Doctors portal');
});

app.listen(port, () => {
    console.log('Listening from port', port);
})
