require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();
mongoose.connect(process.env.MONGOURI, 
  { useNewUrlParser: true,
    useUnifiedTopology: true, 
    useCreateIndex: true,
    dbName: 'ebook' }, 
    () => {
      console.log('connected to db')
    });
    
const bookRoute = require('./routs/books.route');
const departRoute = require('./routs/depart.route');
const usersRoute = require('./routs/users.route');
const authersRoute = require('./routs/auther.route');
const carouselRoute = require('./routs/carousel.route');
const expressJwtMid = require('./helpers/jwt');

app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'view')));
app.use(expressJwtMid);

// app.post('/modifyurl', async (req, res) => {
// const Auther = require('./models/auther.model');


//   try {
//     let authors = await Auther.find();
    
//     for (let i = 0; i < authors.length; i++) {
//       authors[i].slug = authors[i].name.replace(' ', '-')
//     }
  
//     await Auther.deleteMany();
//     await Auther.insertMany(authors)
//     res.send(authors)
//   } catch (err) {
//     console.log(err);
//   }
// })

app.use('/book', bookRoute);
app.use('/departs', departRoute);
app.use('/user', usersRoute);
app.use('/auther', authersRoute);
app.use('/carousel', carouselRoute);

app.all('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'))
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server works on port ${port}`);
});