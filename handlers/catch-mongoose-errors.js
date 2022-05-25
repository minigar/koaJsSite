const MongooseError = require('mongoose').Error;

module.exports = async(ctx, next) => {
    try {
        await next();
    }

        catch (err) {
        if (err instanceof MongooseError) {
            ctx.throw(400, "Bad request!");
        }
        else{
            ctx.throw(err);
        }
    }
}