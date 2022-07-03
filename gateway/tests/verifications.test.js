require("dotenv").config();
const request = require("supertest");
const app = 'http://127.0.0.1:4000';

const AUTH_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2RhdGEiOnsiaWQiOiIzNjg5ZGJhOC1kMTgxLTRkN2YtYmQzNi0xODM5OTljZTc4NjAiLCJlbWFpbCI6Im1heml0by52MisxQGdtYWlsLmNvbSIsInBob25lIjoibWF6aXRvLnYyKzFAZ21haWwuY29tIiwidmVyaWZpZWQiOmZhbHNlfSwibmVhcl9hY2NvdW50X2RhdGEiOnsiYWNjb3VudF9pZCI6IjA5YzAzMTU1MmM3OTQxM2E4NmMxYjI2MmE4ZGYwOWJiLmlkZW50aWNvbi50ZXN0bmV0In0sImlhdCI6MTY1NjgwOTM0NiwiZXhwIjoxNjU2ODk1NzQ2fQ.IBJehTWJbJ1dOtpdG_rqTisCmwA1Zeepafy0YApoQVk";

describe('Test verifications endpoint', () => {

  it('should POST to /verifications', async () => {
    // get keys from "~/.near-creadentials/testnet/maz.testnet"
    const ret = await request(app)
      .post('/v1/verifications')
      .set({ 
        Authorization: `Bearer ${AUTH_KEY}` 
      })
      .send({
        subject_id: 'AR_DNI_1234567801',
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
      });

    console.log('POST /verifications ret=', ret);
    expect(ret !== null).toBe(true);
  });
});
