require("dotenv").config()

const Koa = require('koa');
const bodyParser = require('body-parser');

const config = require('./lib/config');
const handlers = require("./handlers");
const controllers = require("./controllers");
const mongooseConfig = require("./lib/mongoose-config");

const app = new Koa();

handlers.forEach((h) => {app.use(h)});


//Use the routes defined using the router
app.use(controllers.routes());
// allowed methods for controllers
app.use(controllers.allowedMethods());

app.use(bodyParser.json());



// called function(module.exports = () => {}) from ../lib/mongoose-config.js
mongooseConfig();

app.listen(config.port, () => {console.log(`server has been started on port ${config.port}`)});

module.exports = app;