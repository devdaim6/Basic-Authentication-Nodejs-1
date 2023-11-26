const jwt = require('jsonwebtoken')
const { TOKEN_KEY } = process.env


/**
 * The function `verifyToken` is a middleware function in JavaScript that checks if a token is present
 * in the request and verifies its authenticity using a secret key.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client.
 * It contains information such as the request headers, request body, request method, request URL, etc.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to manipulate the response, such as
 * setting the status code, sending data, and setting headers.
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically called at the end of the current
 * middleware function to indicate that it has completed its processing and the next middleware
 * function should be called.
 * @returns the result of calling the `next()` function.
 */
const verifyToken = async (req, res, next) => {

    const token = req.body.token || req.query.token || req.headers["x-access-token"]

    if (!token) {
        return res.status(403).send("An Authentication token is required")
    }

    try {
        const decodedToken = await jwt.verify(token, TOKEN_KEY)
        req.currentUser = decodedToken

    } catch (error) {
        return res.status(401).send("Invalid Token")

    }

    return next();
}


module.exports = verifyToken