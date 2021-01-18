require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
mongoose.connect(process.env.MONGOURI, 
  { useNewUrlParser: true,
    useUnifiedTopology: true, 
    dbName: 'ebook' }, 
    () => {
  console.log('connected to db')
});

const bookRoute = require('./routs/books.route');
const departRoute = require('./routs/depart.route');
const usersRoute = require('./routs/users.route');
const expressJwtMid = require('./helpers/jwt');


app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(expressJwtMid);

app.use('/book', bookRoute);
app.use('/departs', departRoute);
app.use('/user', usersRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server works on port ${port}`);
})