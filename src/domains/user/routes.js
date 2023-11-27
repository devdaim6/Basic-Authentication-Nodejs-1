const express = require("express");
const router = express.Router();
const { createNewUser, authenticateUser } = require("./controller");
const auth = require("../../middleware/auth");
const {
  sendVerificationOTPEmail,
} = require("./../email_verification/controller");
const User = require("../user/model");
//Signin
router.post("/signin", async (req, res) => {
  if (req.session.user) {
    return res.status(403).json({
      message: "Logged In Already"
    })
  }
  try {
    let { email, password } = req.body;
    /* The code `email=email.trim()` and `password=password.trim()` is trimming any leading or trailing
   whitespace from the `email` and `password` variables. This is done using the `trim()` method,
   which removes whitespace from both ends of a string. */
    email = email.trim();
    password = password.trim();

    if (!(email && password)) {
      throw Error("Empty Credentials Supplied!");
    }

    /* The code `const authenticatedUser=await authenticateUser({email,password})` is calling the
   `authenticateUser` function and passing in an object with the `email` and `password` as
   parameters. It then waits for the `authenticateUser` function to complete using the `await`
   keyword. */

    const authenticatedUser = await authenticateUser(req, res, {
      email,
      password,
    });
    req.session.user = {
      name: authenticatedUser?.name,
      username: authenticatedUser?.username,
      token: authenticatedUser?.token,
      secret: authenticatedUser?.secret,
      verified: authenticatedUser?.verified,
    };
    req.secret = authenticatedUser?.secret
    console.log(req.session)
    res.setHeader('x-access-token', authenticatedUser?.token);
    res.cookie('token-secret', authenticatedUser?.secret, { maxAge: 86400000, httpOnly: true, secure: false });
    res.cookie('token', authenticatedUser?.token, { maxAge: 86400000, httpOnly: true, secure: false });
    res.status(200).json(authenticatedUser)
  } catch (error) {
    res.status(400).send(error.message);
  }
});
//SignOut
router.post("/signout", async (req, res) => {
  try {
    const { email } = req.body;
    if (!req.session.user) {
      return res.status(403).send("Login First");

    }
    if (!email) throw Error("Login required");
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }

      // Clear the  cookies
      res.clearCookie('token');
      res.clearCookie('token-secret');
      res.clearCookie('connect.sid');
      res.removeHeader('x-access-token');
      res.status(200).send("Logged Out");
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//Signup
router.post("/register", async (req, res) => {
  try {
    /* `const {name,email,password}= req.body;` is destructuring the `req.body` object and extracting
     the `name`, `email`, and `password` properties. This allows you to directly access these
     properties without having to use `req.body.name`, `req.body.email`, and `req.body.password`. */
    const { name, email, password } = req.body;


    if (!(name, email, password)) {
      res.status(400).json({ message: "Empty Input Fields" });

    } else if (!/^[a-zA-Z ]*$/.test(name)) {
      res.status(402).json({ message: "Enter Valid Username" });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      res.status(401).json({ message: "Enter Valid Email Address" });
      console.log(email)
    } else if (password.length < 8) {
      if (
        !(
          (password.includes("!") ||
            password.includes("@") ||
            password.includes("#") ||
            password.includes("$") ||
            password.includes("%") ||
            password.includes("^") ||
            password.includes("*") ||
            password.includes("(") ||
            password.includes(")") ||
            password.includes("{") ||
            password.includes("}") ||
            password.includes("|") ||
            password.includes("/") ||
            password.includes(";") ||
            password.includes(":") ||
            password.includes(".") ||
            password.includes(",") ||
            password.includes("<") ||
            password.includes(">") ||
            password.includes("`") ||
            password.includes("&")) &&
          password.includes(/^[0-9]*$/)
        )
      ) {
        res.status(415).json({
          message: "Password is Weak,Must include specials symbols and numbers",
        });
      }
      res.status(408).json({ message: "Password Length must be > 8" });
    } else {
      /* This code is creating a new user by calling the `createNewUser` function and passing in the
       `name`, `email`, and `password` as parameters. It then waits for the `createNewUser` function
       to complete using the `await` keyword. */
      const newUser = await createNewUser({ name, email, password });
      await sendVerificationOTPEmail(email);
      res
        .status(200)
        .json({ message: "Account Created Successfully. Login Now!", newUser });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/data", auth, async (req, res) => {

  const resp = await fetch("https://jsonplaceholder.typicode.com/users/1")
  const jsonData = await resp.json()
  res.status(200).json(jsonData);
  // res.status(200).send(`Private Credentials : ${req.currentUser.email}`);
});

router.get("/checkSession", async (req, res) => {
  console.log(req.cookies)
  if (!req.cookies.token)
    res.status(200).json({
      message: "User is not authenticated",
      session: req.session
    });
  res.status(200).json({
    message: "User is Logged In",
    session: req.session

  });
  // res.status(200).send(`Private Credentials : ${req.currentUser.email}`);
});

module.exports = router;
