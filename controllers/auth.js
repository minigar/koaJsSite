const Router = require('koa-router')
const bcrypt = require('bcryptjs') // library for generate and compare password hash 
const jwt = require('jsonwebtoken') //library for authentication 
const { v4: uuidv4 } = require('uuid');

const User = require('../models/User')
const config = require('../lib/config')

const router = new Router().prefix('/auth')


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
    const { email, password } = ctx.request.body;
    const user = await User.findOne({ email });

    if (!user) {
        ctx.throw(403, 'Email not found');
    }

    //compare password hash and user's password
    const comparePassword = await bcrypt.compare(password, user.password);

    // if password equal password witch user writed, then create token
    if (comparePassword) {
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
        }

        // create token
        const token = jwt.sign(payload, config.secret, { expiresIn: 3600 * 24 });
        const refreshToken = uuidv4();

        //  for api
        ctx.body = { token: `Bearer ${token}`,
                    refreshToken};
    }
    else {
        ctx.throw(400, 'Password incorrect');
    }
})



module.exports = router.routes();
