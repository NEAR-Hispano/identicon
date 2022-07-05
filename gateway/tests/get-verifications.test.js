require("dotenv").config();
const request = require("supertest");
const { api, AUTH_KEY, AUTH_USER } = require('./test-setup');


describe('Test GET /verifications endpoint', () => {

  it('success test-setup', async () => {
    console.log(`api-url=${api}, \nAUTH_KEY=${AUTH_KEY}\n, \nAUTH_USER=${AUTH_USER}\n`);
    expect(api !== undefined).toBe(true);
    expect(AUTH_KEY !== undefined).toBe(true);
  });

  it('fail GET /verifications: No requester_uid', async () => {
    await request(api)
      .get('/v1/verifications')
      .query({ states: ['UN','PN','ST'] })      
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('fail GET /verifications: Invalid requester_uid', async () => {
    await request(api)
      .get('/v1/verifications')
      .query({ states: ['UN','PN','ST'], requester_uid: '1234' })      
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .expect('Content-Type', /json/)
      .expect(409);
  });

  it('fail GET /verifications: Empty states', async () => {
    await request(api)
      .get('/v1/verifications')
      .query({ requester_uid: AUTH_USER })      
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('fail GET /verifications: Some invalid state', async () => {
    await request(api)
      .get('/v1/verifications')
      .query({ states: ['UX','PN','ST'] })      
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('success GET /verifications', async () => {
    const result = await request(api)
      .get('/v1/verifications')
      .query({ requester_uid: AUTH_USER, states:['UN','PN'] })   
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .expect('Content-Type', /json/)
      .expect(200);
    //console.log(result.body);
  });

  it('fail GET /verifications/:uid: Invalid uid', async () => {
    await request(api)
      .get('/v1/verifications/1234')
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('success GET /verifications/:uid', async () => {
    const result = await request(api)
      .get('/v1/verifications/2efc2522-ebdd-401e-8799-0eba047af229')
      .query({ requester_uid: AUTH_USER, states:['UN','PN'] })   
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .expect('Content-Type', /json/)
      .expect(200);
    console.log(result.body);
  });
});
