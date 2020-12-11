const router = require("express").Router();
const User = require("../../controllers/MasterController/user.controller");

// middleware
const auth = require('../../middlewares/auth')
const admin = require('../../middlewares/admin')

const user = new User();

/**
 * @type Express.Router
 *
 * @api - /api/v1/users/ @method - GET
 */

router.get("/", [auth], user.getAllUsers);

/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */

router.post("/",/* [auth, admin],*/user.createUser);

router.get("/:id", [auth, admin], user.getOneUser)

router.put("/:id", [auth, admin], user.getOneUserAndUpdate)

router.delete("/:id", [auth, admin], user.getOneUserAndRemove)

router.post("/auth", user.authenticate);


module.exports = router;
