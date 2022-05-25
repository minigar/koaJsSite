const test = require('ava');
const agent = require('supertest-koa-agent');

const app =  require('../app');


agentInstance = agent(app);


test('User can successfully login', async t => {
    const res = await agentInstance.post('/api/auth/login').send({
        email: '123@gmail.com',
        password: '12345678'
    });

    t.is(res.status, 200);
    t.truthy(typeof res.body.token === 'string');
    t.truthy(typeof res.body.refreshToken === 'string');
});


test('user gets 403 on invalid credetials', async t => {
    const res = await agentInstance.post('/api/auth/login').send({
        email: 'INVALID',
        password: 'INVALID'
    });

    t.is(res.status, 403);
});

// test('User resive 401 on expired token', async t => {});
// test('User can refresh acces token using refresh token', async t => {});
// test('User can use refresh token only once', async t => {});
// test('Refresh tokens become invalid after logout', async t => {});
// test('Multiple refresh token are valid', async t => {});