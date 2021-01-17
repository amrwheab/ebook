require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
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


app.use(express.json())

app.use('/book', bookRoute);
app.use('/departs', departRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server works on port ${port}`);
})