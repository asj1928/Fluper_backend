const express = require("express")
const helmet = require('helmet')
const morgan = require('morgan')
var cors = require('cors');
const error = require('../middlewares/error.middleware')
require('express-async-errors')
const _app_folder = "dashboard";



module.exports = function (server) {

    /**
     * Middlewares
     */
    // server.use(require("../middlewares/path.middleware"));
    server.use(morgan('tiny'))
    server.use(express.json())
    server.use(express.urlencoded({ extended: true }))
    server.use(helmet())
    // server.use((req,res,next)=>{
    //     console.log(req.headers);
    //     next()
    // })
    // server.use(cors(corsOption))
    server.use(cors())


    /**
     * Server Routes here
     */
    server.use("/api/v1/users", require("../routes/master/user.routes"));


    // ---- SERVE STATIC FILES ---- //
    server.get("*.*", express.static(_app_folder, { maxAge: "1y" }));

    // ---- SERVE APLICATION PATHS ---- //
    server.all("*", function (req, res) {
        res.status(200).sendFile(`/`, { root: _app_folder });
    });




    // server.get("/", (req, res) => res.send("Hello World! tms"));

    /**
     * error handling middleware
     */
    server.use(error)

}