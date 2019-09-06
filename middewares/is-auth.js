const jwt = require('jsonwebtoken');

exports.isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if(!authHeader) {
        const error = new Error("Not Authenticated");
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.jwt_secret);
    } catch (e) {
        e.statusCode = 500;
        throw e;
    }
    if (!decodedToken) {
        const error = new Error("Invalid Authentication Detials");
        error.statusCode = 401;
        throw error;
    }
    req.user = decodedToken
    next();
}