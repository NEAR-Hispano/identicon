require("dotenv").config();
const request = require("supertest");
const app = 'http://127.0.0.1:4000';

const AUTH_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2RhdGEiOnsiaWQiOiJiZDRlZGJmYjlkMWU0ZDAyODdlYWVjZmQyMzUzNDEwMC5pZGVudGljb24udGVzdG5ldCIsImVtYWlsIjoibWF6aXRvLnYyKzJAZ21haWwuY29tIiwicGhvbmUiOiJtYXppdG8udjIrMkBnbWFpbC5jb20iLCJ2ZXJpZmllZCI6ZmFsc2V9LCJuZWFyX2FjY291bnRfZGF0YSI6eyJhY2NvdW50X2lkIjpudWxsfSwiaWF0IjoxNjU2ODg1OTE1LCJleHAiOjE2NTY5NzIzMTV9.MCzSsn2gubJf-ODiK7wmZ_tmz5CoW5KASkW6D9QYQ2I";

describe('Test verifications endpoint', () => {

  const payload = {
    subject_id: 'AR_DNI_1234567808',
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

  it('fail POST /verifications: Invalid subject_id', async () => {
    let invalidPayload = JSON.parse(JSON.stringify(payload)) ;
    invalidPayload.subject_id = ''; // Invalid subject_id
    await request(app)
      .post('/v1/verifications')
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .send(invalidPayload)
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('fail POST /verifications: Invalid type ', async () => {
    let invalidPayload = JSON.parse(JSON.stringify(payload)) ;
    invalidPayload.type = ''; // Invalid subject_id
    await request(app)
      .post('/v1/verifications')
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .send(invalidPayload)
      .expect('Content-Type', /json/)
      .expect(400);
  });


  it('fail POST /verifications: Empty full_name', async () => {
    let invalidPayload = JSON.parse(JSON.stringify(payload)) ;
    invalidPayload.personal_info.full_name = ''; 
    await request(app)
      .post('/v1/verifications')
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .send(invalidPayload)
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('fail POST /verifications: Invalid phone ', async () => {
    let invalidPayload = JSON.parse(JSON.stringify(payload)) ;
    invalidPayload.personal_info.phone = ''; 
    await request(app)
      .post('/v1/verifications')
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .send(invalidPayload)
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('fail POST /verifications: Invalid email ', async () => {
    let invalidPayload = JSON.parse(JSON.stringify(payload)) ;
    invalidPayload.personal_info.email = 'pperino'; 
    await request(app)
      .post('/v1/verifications')
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .send(invalidPayload)
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('fail POST /verifications: Invalid country ', async () => {
    let invalidPayload = JSON.parse(JSON.stringify(payload)) ;
    invalidPayload.personal_info.country = ''; 
    await request(app)
      .post('/v1/verifications')
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .send(invalidPayload)
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('success POST to /verifications', async () => {
    await request(app)
      .post('/v1/verifications')
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
  });
});
