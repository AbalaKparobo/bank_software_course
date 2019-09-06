const User = require('../models/user')

exports.isActive = (req, res, next) => {
    const username = req.body.username;
    let user;
    User.findOne({where: {username: username}, attributes : {exclude: ['password']}}) 
    .then(result => {
        if(!result) {
            const e = new Error("No matching User found");
            e.statusCode = 404;
            throw e;
        }
        user = result.get({plain: true});
        isActive = user.isActive;
        if(isActive === true) {
            next();
        } else {
          return res.status(402).json({message: "This Account is temporarily Blocked, please contact your finacial adviser for more details"})
        }
    })
}