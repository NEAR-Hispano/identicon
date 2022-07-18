require("dotenv").config();
const request = require("supertest");
const { api, AUTH_KEY } = require('./test-setup');


describe('Test PUT /verifications/:uid endpoint', () => {

  const payload = {
    subject_id: 'AR_DNI_1234567804',
    type: 'ProofOfLife',
    personal_info: {
      email: 'mazito.v2+1@gmail.com', 
      phone: '15-1234-5678', 
      full_name: 'Mario A. Zito',
      birthday: '1956-01-01', // ISODate format, ex: '1956-05-12'
      age: 66,
      sex: 'M', // 'M', 'F', 'U'
      country: 'ar', // ex 'mx', 'ar', 've', 'bo', cl', 'uy', ..
      region: 'ba', // region/state/province code 
      comune: 'adrogue', // city code 
      address: 'J de la Pepa 1077', // free format full address data, understandable by Maps 
      coordinates: '', // GPS coords
      languages: '', // list of prefered language codes, ex 'es', 'en' 'po' ...
      preferred: 'WHATSAPP', // preferred way to contact `WHATSAPP`,`TELEGRAM`,`ONSITE`.
      health: '', // free format description of health status if it applies
      extras: {} // extra (future) info (such as preferences/other) as JSON obj
    }   
  };

  it('success test-setup', async () => {
    console.log(api, AUTH_KEY);
    expect(api !== undefined).toBe(true);
    expect(AUTH_KEY !== undefined).toBe(true);
  });

  it('fail PUT /verifications/:uid: Invalid uid', async () => {
    await request(api)
      .put('/v1/verifications/1234')
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('success PUT /verifications/:uid', async () => {
    await request(api)
      .put('/v1/verifications/2efc2522-ebdd-401e-8799-0eba047af229')
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

