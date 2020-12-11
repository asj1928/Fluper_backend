module.exports = function (req, res, next) {

    // 401 unautherize
    // 403 forbidden

    // console.log(req.user);

    if (!req.user.isAdmin) return res.status(403).send({ message: "Access denied. Admin" })

    next();
}