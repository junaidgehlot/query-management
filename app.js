require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

const connectDB = require('./db/connect');

app.use(express.json());

const notFoundMiddleware = require('./middleware/not-found');
const errorMiddlewareHandler = require('./middleware/error-handler');

// Router
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

// error handlers
app.use(notFoundMiddleware);
app.use(errorMiddlewareHandler);

const PORT = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, () => {
            console.log(`listening on port ${PORT}`);
          });
    } catch (error) {
        console.log(error);
    }
}

start();
