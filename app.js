const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();
const port = process.env.PORT || 8080;

//load ideas routes
const ideas = require('./routes/ideas');
//load users routes
const users = require('./routes/users');

//load passport config
require('./config/passport')(passport);

//load db config
const db = require('./config/database');

//connect to mongoose, pass in database as param
//since it responds with a promise, you have to use .then after
//if you want to catch errors, use .catch
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true
})
.then(() =>{
    console.log('MongoDB Connected');
})
.catch(err => console.log(err));

//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//methodOverride middleware
app.use(methodOverride('_method'));

//expressSession middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//passport middleware, NEEDS TO BE AFTER EXPRESSSESSION
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//Global variables
app.use((req, res, next) => {
    res.locals.successMessage = req.flash('successMessage');
    res.locals.errorMessage = req.flash('errorMessage');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});




//Index route
app.get('/', (req, res) =>{
    const title = 'Welcome!'
    res.render('index', {
        title: title
    });
});

//about route
app.get('/about', (req, res) => {
    res.render('about');
})

//ideas route
app.use('/ideas', ideas);
//users route
app.use('/users', users);


app.listen(port, () =>{
    console.log(`server started on port ${port}`);
})