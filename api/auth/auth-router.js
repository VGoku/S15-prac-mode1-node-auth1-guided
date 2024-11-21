const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../users/users-model")

router.post("/register", async (req, res, next) => {
   try {
    const { username, password } = req.body
    const hash = bcrypt.hashSync(password, 8) // 2 ^ 8
    const newUser = { username, password: hash }
    const result = await User.add(newUser)
    res.status(201).json({
     message: `nice to have you, ${result.username}`,
     //  res.json({ message: "register working" }) use this to check your connections
    })
   } catch (err) {
    next(err)
   }
})
router.post("/login", async (req, res, next) => {
   try {
      const { username, password } = req.body
      const [user] = await User.findBy({ username })
      if (user && bcrypt.compareSync(password, user.password)) {
         req.session.user = user
         res.json({ message: `The great ${user.username}, is back!`})
         // console.log("we should start a session for you")
      } else {
         next({ status: 401, message: "bad credentials" })
      }
      // console.log(user)
      // res.json({ message: "login working" })
   } catch (err) {
      next(err)
   }
})
router.get("/logout", async (req, res, next) => {
   if (req.session.user) {
      const { username } = req.session.user
      req.session.destroy(err => {
         if (err) {
            res.json({ message: `You are stuck in hell!, ${username}` })
         } else {
             // the following line is optional: compliant browsers will delete the cookie from their storage
        res.set('Set-Cookie', 'monkey=; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00')//to set if logout will not send new cookie
            res.json({ message: `You may leave, ${username}` })
         }
      })
   } else {
      res.json({ message: "I don't know you." })
   }
})
//res.json({ message: "logout working" })
module.exports = router;