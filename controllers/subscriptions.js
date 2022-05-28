const Router = require('koa-router');
const passport = require('koa-passport');
const jwtMiddleware = require("koa-jwt");
const config = require('../lib/config');
const Subscription = require('../models/Subscription');

const router = new Router();

router.use(jwtMiddleware({
    secret: config.jwt.secret
}));

router.prefix('/subscriptions');

router.post('/', passport.authenticate('jwt', { session: false }), async(ctx) => {
    const { profile } = ctx.request.body;
    const subscriber_id = ctx.state.user._id; // current_user's id

    if(profile !== subscriber_id.toString()) {
        const checkSubscription = await Subscription.findOne({ subscriber_id, profile});
    
        if (checkSubscription) {
            ctx.throw('You have already subscriped')
        }
    
        ctx.body = await new Subscription({ subscriber_id, profile }).save();
        ctx.status = 201;
    }
    else{
        ctx.throw(400, "YYou can't follow yourself");
    }


});


router.get('/', async(ctx) => {
    ctx.body = await Subscription.find(ctx.query);
});

// '/:_id' : subscription id
router.delete('/:_id', passport.authenticate('jwt', {session: false}), async (ctx) => {
    await Subscription.findOneAndDelete({
        _id: ctx.params._id,
        subscriber_id: ctx.state.user._id
    })
    ctx.body = { message: 'You was unsubscribed' }
})

module.exports = router.routes();

