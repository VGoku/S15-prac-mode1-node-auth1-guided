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
res.json({ message: "logout working" })
})

module.exports = router;