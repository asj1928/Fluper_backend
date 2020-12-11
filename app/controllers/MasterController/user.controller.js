const Users = require('../../models/master/Users')
const validate = require('../../validators/user.validator')
const bcrypt = require('bcrypt');

/**
 * @class - User class containing all the controllers
 */

class User {
  /**
   * @function - Get all the registered users from the db
   *
   * @param - Express.req , Express.res
   *
   * @returns - List of registered users
   */

  async getAllUsers(req, res) {

    let limit
    let page
    if (req.query.limit) {
      limit = (parseInt(req.query.limit) ? parseInt(req.query.limit) : 10);
      page = req.query.page ? (parseInt(req.query.page) ? parseInt(req.query.page) : 1) : 1;
    }

    const createdAt = req.query.createdAt ? (req.query.createdAt == 'desc' ? -1 : 1) : 1

    const users = await Users.find({}).select("-password").limit(limit).skip((page - 1) * limit).sort({ createdAt: createdAt }).lean()

    res.status(200).send({
      status: true,
      users: users,
    });
  }

  async getOneUser(req, res) {
    let userId = req.params.id;
    let user = await Users.findById(userId).select("-password").lean()
    if (!user) {
      return res.status(404).send({ message: "user doesnt exist" })
    }

    res.status(200).send({
      status: true,
      users: user,
    });

  }

  async getOneUserAndUpdate(req, res) {
    let userId = req.params.id;
    let user = await Users.findById(userId).select("-password")
    if (!user) {
      return res.status(404).send({ message: "user doesnt exist" })
    }


    let { error } = validate.validateUpdateuser(req.body)
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error
      })
    }

    user.set(req.body)

    await user.save()

    res.status(200).send({
      status: true,
      users: user,
    });

  }

  async getOneUserAndRemove(req, res) {
    let userId = req.params.id;
    let user = await Users.findByIdAndRemove(userId)
    let status = false
    if (user) {
      status = true
    }
    res.status(200).send({
      status: status,
      user: user,
    });

  }

  async createUser(req, res) {
    console.log(req.files)
    // throw new Error("could not create a user")
    let { error } = validate.validateUser(req.body)
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error
      })
    }
    let existingUser = await Users.findOne({ email: req.body.email })
    if (existingUser) {
      return res.status(400).send({
        message: "failed to register, user already exist",
        existingUser: req.body.email
      })
    }
    let user = new Users({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      username: req.body.username
    })
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    await user.save()

    return res.status(200).send({
      message: "user Created",
    });

  }

  async authenticate(req, res) {

    let { error } = validate.authenticateUser(req.body)
    if (error) {
      return res.status(400).send({
        status: false,
        message: "failed",
        result: error
      })
    }

    let user = await Users.findOne({ email: req.body.email }).populate({ path: "userRoles", select: 'roles -_id -userId', populate: { path: "roles" } })
    // dont use 404 for this dont what user to know why this failed
    if (!user) return res.status(400).send({
      status: false,
      message: "invalid username or password",
      username: req.body.email
    })

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send({
      status: false,
      message: "invalid username or password",
      username: req.body.email
    })

    // check user for admin
    let isAdmin = user.isAdmin
    console.log("🔥 this user is Admin 🔥");

    const token = user.generateAuthToken()
    return res.status(200).send({
      status: true,
      username: req.body.email,
      user: user,
      token: token
    })
  }


}

module.exports = User;
