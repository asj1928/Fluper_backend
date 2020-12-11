const router = require("express").Router();
const Image = require("../../controllers/MasterController/image.controller");

// middleware
const auth = require('../../middlewares/auth')
const admin = require('../../middlewares/admin')

const multer = require('multer')
const inMemoryStorage = multer.memoryStorage()
const uploadStrategy = multer({
    storage: inMemoryStorage
}).single('image')



const image = new Image();


router.post("/", [auth, admin, uploadStrategy], image.createImage);

router.get("/:id", [auth, admin], image.getImage)



module.exports = router;
