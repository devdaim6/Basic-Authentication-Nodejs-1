require('./config/db')
const cookieParser = require('cookie-parser');
const express=require('express')
const bodyParser=express.json;
const cors = require('cors')
const routes = require('./routes')
const app = express()
app.use(cookieParser()); 

/* `app.use(cors())` is enabling Cross-Origin Resource Sharing (CORS) for the application. CORS is a
mechanism that allows resources (e.g., APIs) on a web page to be requested from another domain
outside the domain from which the resource originated. By using `app.use(cors())`, the application
is allowing requests from any domain to access its resources. */
app.use(cors())


/* `app.use(bodyParser())` is configuring the application to use the `body-parser` middleware. */
app.use(bodyParser())

/* `app.use("/",routes)` is mounting the `routes` middleware on the root path ("/") of the application.
This means that any incoming request to the root path will be handled by the `routes` middleware.
The `routes` middleware is responsible for handling different routes and their corresponding logic. */
app.use("/",routes)

module.exports=app;
