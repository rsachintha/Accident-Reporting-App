const router = require('express').Router();
const {
    userRegister,
    userLogin,
    checkRole,
    userAuth,
    serializeUser
} = require('../utils/Auth');


router.post("/register", async (req, res) => {
    await userRegister(req.body, "user", res);
})


router.post("/login-user", async (req, res) => {
    await userLogin(req.body, "user", res);
})


router.post("/login-police", async (req, res) => {
    await userLogin(req.body, "police", res);
})


router.post("/login-insurance", async (req, res) => {
    await userLogin(req.body, "insurance", res);
})

router.get("/user-protected", userAuth, checkRole(["user"]), async (req, res) => {
    return res.redirect('http://localhost:3000/')
})

router.get("/police-protected", userAuth, checkRole(["polic"]), async (req, res) => {
    return res.redirect('http://localhost:3000/reportslist')
})

router.get("/insurance-protected", userAuth, checkRole(["insurance"]), async (req, res) => {
    return res.redirect('http://localhost:3000/reportslist')
})


module.exports = router;