const Router = require('koa-router');
const bcrypt = require('bcryptjs'); // library for generate and compare password hash 
const jwt = require('jsonwebtoken'); //library for authentication 
const { v4: uuidv4 } = require('uuid');

const jwtMethods = require('../helpers/jwtMethods');
const User = require('../models/User');
const Token = require('../models/Token');
const config = require('../lib/config');

const router = new Router().prefix('/auth')


const updateTokens = (userId) => {
    const accessToken = jwtMethods.generateAccessToken(userId);
    const refreshToken = jwtMethods.generateRefreshToken();

    return jwtMethods.replaceRefreshTokenInDb(refreshToken.id, userId)
        .then(() => ({
            accessToken,
            refreshToken: refreshToken.token,
        }));
};


router.post('/register', async (ctx) => {
    const { name, email, password } = ctx.request.body;
    const user = await User.findOne({ email });

    if (user) {
        ctx.throw(400, 'Email already exists')
    }

    if (password.length < 8) {
        ctx.throw(403, 'Password too short minimum length is 8 characters');
    }

    // if user not exists then create user's password hash(with salt), user's email and user's name 
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await new User({ email, name, password: hash }).save();
    ctx.status = 201;
})


router.post('/login', async (ctx) => {
    console.log(ctx.href);
    const { email, password } = ctx.request.body;
    const user = await User.findOne({ email });

    if (!user) {
        ctx.throw(403, 'Email not found');
    }

    //compare password hash and user's password
    const comparePassword = await bcrypt.compare(password, user.password);

    // if password equal password witch user writed, then create tokens
    if (comparePassword) {
        // create access token and refresh token and writes in body
        updateTokens(user._id)
            .then(tokens => ctx.body = tokens)
    }

    else {
        ctx.throw(400, 'Password incorrect');
    }
})



router.post('/refresh', async (ctx) => {
    console.log(ctx.href)
    const { refreshToken } = ctx.request.body;
    let payload;

    try{
        // verify token
        payload = jwt.verify(refreshToken, config.jwt.secret);

        if (payload.type !== 'refresh') {
            ctx.throw(400, 'your token Invalid !')
            return;
        }
    }

    catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            ctx.throw(400, 'Expired token')
        }

        else if (e instanceof jwt.JsonWebTokenError) {
            ctx.throw(400, 'your token Invalid!')
            return;
        }
    }
    
    Token.findOne({ _id: payload.id })
        .exec()
        .then((token) => {
            if (token === null) {
                ctx.throw(400, 'Invalid token!');
            }
            // create new access token and new refresh token
            return updateTokens(token.userId)
        })
        // write 2 new tokens in body 
        .then(tokens => ctx.body = tokens)
        .then(tokens => console.log(tokens))
        .catch(err => console.log(err))
})


module.exports = router.routes();