require('./config/db')
const cookieParser = require('cookie-parser');
const express = require('express')
const bodyParser = express.json;
const cors = require('cors')
const session = require('express-session');
const routes = require('./routes')
const app = express()
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your React app's origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));
app.use(cookieParser());
app.use(session({
  secret: process.env.TOKEN_SECRET, // Change this to a strong and secure secret
  resave: false,

  saveUninitialized: false,
  cookie: { secure: false, maxAge: 86400000, } // Set secure to true if your application is served over HTTPS
}));
/* `app.use(cors())` is enabling Cross-Origin Resource Sharing (CORS) for the application. CORS is a
mechanism that allows resources (e.g., APIs) on a web page to be requested from another domain
outside the domain from which the resource originated. By using `app.use(cors())`, the application
is allowing requests from any domain to access its resources. */


/* `app.use(bodyParser())` is configuring the application to use the `body-parser` middleware. */
app.use(bodyParser())

/* `app.use("/",routes)` is mounting the `routes` middleware on the root path ("/") of the application.
This means that any incoming request to the root path will be handled by the `routes` middleware.
The `routes` middleware is responsible for handling different routes and their corresponding logic. */
app.use("/", routes)




module.exports = app;
