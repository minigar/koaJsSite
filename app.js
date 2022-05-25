require("dotenv").config()

const Koa = require('koa');
const jwtMiddleware = require("koa-jwt");

const config = require('./lib/config');
const handlers = require("./handlers");
const controllers = require("./controllers");
const mongooseConfig = require("./lib/mongoose-config");

const app = new Koa();

handlers.forEach((h) => {app.use(h)});

// Middleware below this line is only reached if JWT token is valid

//Use the routes defined using the router
app.use(controllers.routes());
// allowed mehtods for controllers
app.use(controllers.allowedMethods());



// called function(module.exports = () => {}) from ../lib/mongoose-config.js
mongooseConfig();

app.listen(config.port, () => {console.log(`server has been started on port ${config.port}`)});


module.exports = app;