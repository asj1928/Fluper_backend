const router = require("express").Router();
const User = require("../../controllers/MasterController/user.controller");

// middleware
const auth = require('../../middlewares/auth')
const admin = require('../../middlewares/admin')

const user = new User();



router.get("/", [auth, admin], user.getAllUsers);


router.post("/",/* [auth, admin],*/user.createUser);

router.get("/:id", [auth, admin], user.getOneUser)

router.put("/:id", [auth, admin], user.getOneUserAndUpdate)

router.post("/auth", user.authenticate);


module.exports = router;
