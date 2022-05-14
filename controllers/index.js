const Router = require('koa-router');

const auth = require('./auth');
const posts = require('./posts');
const postsLikes = require('./posts-likes');
const postsComments = require('./posts-comments');

const router = new Router().prefix('/api');

router.use(auth, posts, postsLikes, postsComments);

module.exports = router;