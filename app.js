if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mongoSanitize = require('express-mongo-sanitize');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash');
const Expresserror = require('./utility/ExpressError');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const user = require('./models/user');
const userRoutes = require('./routes/Auth');
const passport = require('passport');
const LocalStrategy = require('passport-local');


const app = express();
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoDbStore = require('connect-mongo');


//const dbUrl = process.env.DB_URL

// var bodyParser = require('body-parser')
// var urlencodedParser = bodyParser.urlencoded({ extended: true })
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl, {
    // useNewUrlPraser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const secret = process.env.SECRET || 'thisisasecret'


const store = new MongoDbStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
})

store.on("error", function (e) {
    console.log("SESSION ERROR->", e)
})


const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(flash());

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize())
app.use((req, res, next) => {
    res.locals.loggedUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
// app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com",
//     "https://api.tiles.mapbox.com",
//     "https://api.mapbox.com",
//     "https://kit.fontawesome.com",
//     "https://cdnjs.cloudflare.com",
//     "https://cdn.jsdelivr.net",
//     "https://cdn.tailwindcss.com/",
//     "https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.js",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com",
//     "https://stackpath.bootstrapcdn.com",
//     "https://api.mapbox.com",
//     "https://api.tiles.mapbox.com",
//     "https://fonts.googleapis.com",
//     "https://use.fontawesome.com",
//     "https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.css",
//     "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
//     "https://cdn.tailwindcss.com/",
//     "https://ka-f.fontawesome.com/releases/v6.1.1/css/free.min.css?token=b790902e3a",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com",
//     "https://*.tiles.mapbox.com",
//     "https://events.mapbox.com",
//     "https://fonts.googleapis.com",
//     "https://fonts.gstatic.com/s/poppins/v19/pxiEyp8kv8JHgFVrJJnecmNE.woff2",
//     "https://cdn.tailwindcss.com/",
// ];
// const fontSrcUrls = [
//     "https://fonts.gstatic.com/s/poppins/v19/pxiDyp8kv8JHgFVrJJLmv1pVFteOcEg.woff2"
// ];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             childSrc: ["blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/douqbebwk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );









app.get('/', (req, res) => {
    res.render('home')
});
app.use('/', userRoutes);

app.use('/campgrounds', campgroundsRoutes);

app.use('/campgrounds/:id/reviews', reviewsRoutes);



app.get('/fakeuser', async (req, res) => {
    const User = new user({ email: 'khan@gmail.com', username: 'khan' });
    const newUser = await user.register(User, 'monkey');
    res.send(newUser);
})



app.all('*', (req, res, next) => {
    next(new Expresserror('Page not Found', 404))

})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}!!!`)
})






