require("dotenv").config();
const request = require("supertest");
const { api, AUTH_KEY, AUTH_USER } = require('./test-setup');

const accountId = '2acbfc5c9a384b05a27f5b00449ae8e2.identicon.testnet';
// 7e7752c5e859414fb7bc77e1cd2f7f5f.identicon.testnet

describe('Test GET /tasks endpoint', () => {

  it('success test-setup', async () => {
    console.log(`api-url=${api}, \nAUTH_KEY=${AUTH_KEY}\n, \nAUTH_USER=${AUTH_USER}\n`);
    expect(api !== undefined).toBe(true);
    expect(AUTH_KEY !== undefined).toBe(true);
  });

  it('success GET /tasks/assigned', async () => {
    const result = await request(api)
      .get('/v1/tasks/assigned')
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .expect('Content-Type', /json/)
      .expect(200);
    console.log(result.body);
  });

});
