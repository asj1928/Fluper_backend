require("dotenv").config();
const server = require("./app/server");
const db = require("./app/startup/db");

const { info } = require("./app/utils/chalk");

const port = process.env.PORT;

server.listen(port, async () => {
  db();
  console.log(info("Server started on port " + port));
});
