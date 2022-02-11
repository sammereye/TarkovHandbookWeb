const express = require('express');
const path = require('path')
const exphbs = require('express-handlebars');

const app = express();
const port = 3002;

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs.engine({ extname: '.hbs' }))

app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/tarkov', express.static(path.join(__dirname, 'public')));

app.get('/tarkov', (req, res) => {
  res.render('index', {title: 'Tarkov Handbook (Web)', root_path: 'tarkov'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})