

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.locals.token = null;
        res.cookies=null // ✅ Ensure token is removed
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        res.locals.token = token;
    } catch (error) {
        res.cookie("token", "", { expires: new Date(0), path: "/" }); // ✅ Delete the token if invalid
        res.locals.token = null;
        res.cookies.token= null;
          }

    next();
};
