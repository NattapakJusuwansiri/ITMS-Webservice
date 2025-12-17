const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const { initLogger } = require('./logger');
const logger = initLogger('App');
// middleware
const auth = require('./middleware/auth');


// router
const indexRouter = require('./routes/index');
const roleRouter = require('./routes/role');
const accountRouter = require('./routes/account');
const usersRouter = require('./routes/users');
const profileRouter = require('./routes/profile');
const statusRouter = require('./routes/status');
const fileRouter = require('./routes/file');
const calendarRouter = require('./routes/calendar');
const gspcRouter = require('./routes/gspc');

require('./models/mssql/init-models');


var app = express();
app.set('trust proxy', true);
app.use(
    cors({
        origin: '*',
        exposedHeaders: ['Content-Disposition'],
    }),
);
app.use(
    morgan(
        (tokens, req, res) => {
            return [
                tokens['remote-addr'](req, res),
                tokens.method(req, res),
                tokens.url(req, res),
                tokens.status(req, res),
                tokens.res(req, res, 'content-length'),
                '-',
                tokens['response-time'](req, res),
                'ms',
            ].join(' ');
        },
        { stream: { write: (message) => logger.info(message.trim()) } },
    ),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// --- Map router ---
app.use('/', indexRouter);
// --- account ---
app.use('/account', accountRouter);
// profile
app.use('/profiles', auth, profileRouter);
// --- file ---
app.use('/files', auth, fileRouter);
// --- master ---
app.use('/users', auth, usersRouter);
app.use('/roles', auth, roleRouter);
app.use('/statuses', auth, statusRouter);
app.use('/calendar',auth,calendarRouter);
app.use('/gspc',auth,gspcRouter)

// error handling
app.use((error, req, res, next) => {
  logger.error(`Internal Server Error: ${error.message}`);
  res.status(500).send('Internal Server Error');
});
app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});