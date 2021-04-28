const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/api/v1/quack', require('./controllers/quack-users'));
app.use('/api/v1/admin', require('./controllers/quack-admin'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
