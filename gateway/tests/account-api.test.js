require("dotenv").config();
const request = require("supertest");

const SRV = 'http://127.0.0.1:3000';
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2RhdGEiOnsiaWQiOiJiN2YzMmRiYy00MmVhLTRmMDktYjhmOC1kYzNhZTQxNDdmZjUiLCJlbWFpbCI6Im1heml0by52MisxQGdtYWlsLmNvbSIsInBob25lIjoibWF6aXRvLnYyKzFAZ21haWwuY29tIiwidmVyaWZpZWQiOmZhbHNlfSwibmVhcl9hY2NvdW50X2RhdGEiOnsiYWNjb3VudF9pZCI6IjBmM2M5NjU4YmQzYzRhOTY5NWNhNGNlYzBmZWRiZmIxLmlkZW50aWNvbi50ZXN0bmV0In0sImlhdCI6MTY1NjAwNTEwNiwiZXhwIjoxNjU2MDkxNTA2fQ.efzG1oWKGaVjO76rjRL70uQTVqr1cqU-4pKVEFrY56Q";
const ACCOUNT_ID = "b7f32dbc-42ea-4f09-b8f8-dc3ae4147ff5";

describe('Account API', () => {

  it('get account', async () => {
    const response = await request(SRV)
      .get(`/v1/accounts/${ACCOUNT_ID}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${AUTH_TOKEN}`)
      .expect("Content-Type", /json/)
      .expect(200)
    // More logic goes here    
  })
})
