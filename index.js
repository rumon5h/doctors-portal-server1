const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.local || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2cqrt9g.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    client.connect();
    const serviceCollection = client.db("doctors_portal").collection("services");

    const bookingCollection = client.db("doctors_portal").collection("booking");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/available", async (req, res) => {
      const date = req.query.date;
      // step 1: get all the bookings
      const services = await serviceCollection.find().toArray();

      // step 2 : get the booking of the day
      // const query = {data : req.query.data || 'Oct 31, 2022'}

      const bookings = await bookingCollection.find({ date }).toArray();

      // step 3: for each service
      services.forEach((service) => {

        // step 4: find the booking for that service
        const serviceBookings = bookings.filter(
          (book) => book.treatment === service.name
        );
        const booked = serviceBookings.map(s => s.slot);

        const available = service.slots.filter(s => !booked.includes(s));
        service.slots = available;
      });
      res.send(services);
    });

    app.get('/booking', async (req, res) => {
      const {patient} = req.query;
      const query = {patient: patient};
      const booking = await bookingCollection.find(query).toArray();
      
      res.send(booking);
    })

    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const query = {
        treatment: booking.treatment,
        date: booking.date,
        patientName: booking.patientName,
      };
      const exists = await bookingCollection.findOne(query);
      if (exists) {
        return res.send({ success: false, booking: exists });
      }
      const result = await bookingCollection.insertOne(booking);
      return res.send({ success: true, booking: result });
    });
  } finally {
    //
  }
}

run().catch(console.dir());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log("Server is Listening on port", port);
});
