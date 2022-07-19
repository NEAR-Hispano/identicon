require("dotenv").config();
const request = require("supertest");
const { api, VALIDATOR_AUTH_KEY } = require('./test-setup');


describe('Test POST /account/validators endpoint', () => {

  const payload = {
    can_do: ['Remote','Review']
  };

  it('success test-setup', async () => {
    console.log(api, VALIDATOR_AUTH_KEY);
    expect(api !== undefined).toBe(true);
    expect(VALIDATOR_AUTH_KEY !== undefined).toBe(true);
  });

  it('success POST to /accounts/validators', async () => {
    await request(api)
      .post('/v1/accounts/validators')
      .set({ 
        Authorization: `Bearer ${VALIDATOR_AUTH_KEY}` 
      })
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

