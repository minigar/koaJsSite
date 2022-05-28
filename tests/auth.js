const test = require('ava');
const agent = require('supertest-koa-agent');
const jwtToken = require('../helpers/jwtToken');
const app = require('../app');


const agentInstance = agent(app);

const payload = {
    _id: "628bbc783e08acf3c6b10fd9",
    name: "DDD",
    email: '123@gmail.com'
}

const authLine = `Bearer ${jwtToken({
    payload: payload
})}` // .set('Authorization', authLine)


test('User can successfully login', async t => {
    const res = await agentInstance.post('/api/auth/login').send({
        email: '123@gmail.com',
        password: '12345678'
    })

    t.is(res.status, 200);
    t.truthy(typeof res.body.accessToken === 'string');
    t.truthy(typeof res.body.refreshToken === 'string');
});


test('user gets 403 on invalid credetials', async t => {
    const res = await agentInstance.post('/api/auth/login').send({
        email: 'INVALID',
        password: 'INVALID'
    });

    t.is(res.status, 403);
});


test('Auth user can look at all users', async t => {
    const res = await agentInstance.get('/api/users').set('Authorization', authLine)


    t.is(res.status, 200)
    t.truthy(Array.isArray(res.body))
});

test('User resive 401 on expired token', async t => {
    const expiredToken = jwtToken({ payload: payload }, { expiresIn: '1ms' })
    const res = await agentInstance.get('/api/users').set('Authorization', `Bearer ${expiredToken}`)

    t.is(res.status, 401)
});

// test('User can get new acces token using refresh token', async t => {
//     const res = await agentInstance.post('/api/auth/refresh').send({
//         refreshToken: 'REFRESH_TOKEN_1'
//     })

//     t.is(res.status, 200)
//     t.truthy(typeof res.body.token === 'string');
//     t.truthy(typeof res.body.refreshToken === 'string');
// });


// test('User can use refresh token only once', async t => {});
// test('Refresh tokens become invalid after logout', async t => {});
// test('Multiple refresh token are valid', async t => {});

module.exports = {
    authLine
}