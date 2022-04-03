require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const morgan = require('morgan');
// const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');


const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const teamRouter = require('./routes/team');

const connectDB = require('./db/connect');
const { authenticate } = require('./middleware/authentication');

const notFoundMiddleware = require('./middleware/not-found');
const errorMiddlewareHandler = require('./middleware/error-handler');


// @ts-ignore
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Query Management tool</h1>');
});

// Router
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', authenticate, userRouter);
app.use('/api/v1/team', authenticate, teamRouter);

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
