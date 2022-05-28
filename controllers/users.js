const  Router = require('koa-router');
const jwtMiddleware = require("koa-jwt");
const { authLine } = require('./auth');

const config = require('../lib/config');
const User = require("../models/User");

const router = new Router();


router.use(jwtMiddleware({
    secret: config.jwt.secret
}));

router.prefix('/users');


router.get('/:_id', async (ctx) => {
    const { _id } = ctx.params;
    const user = await User.findById(_id);

    if (user) {
        ctx.body = user;
    }
    else {
        ctx.throw(404);
    }
})

router.get('/', async (ctx) => {
    const users = await User.find();
    ctx.body = users;
})


module.exports = router.routes();