const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.local || 5000;
const app = express();

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Doctors portal');
});

app.listen(port, () => {
    console.log('Listening from port', port);
})
