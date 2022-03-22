require('dotenv').config();
const express = require('express');
const app = express();
const authRouter = require('./routes/auth');
const connectDB = require('./db/connect');


app.use(express.json());

// Router
app.use('/api/v1/auth', authRouter);

app.get('/', (req, res) => {
    res.send('<h1>Query Management Tool</h1>')
});

const PORT = 5000;


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, () => {
            console.log('listening on port 3000');
          });
    } catch (error) {
        console.log(error);
    }
}

start();
