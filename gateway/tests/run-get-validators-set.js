require('dotenv').config();
const config = require('../src/config');
const { sequelize } = require('../src/models');
const express = require('express');
const nearService = require('../src/services/near.service');
const AccountsService = require('../src/services/accounts.service');

const testset = [
  ['bd4edbfb9d1e4d0287eaecfd23534100', '40010', 'Pedro A'],
  ['0de0ce2e7a0c4c0e9290cb481e441c6b', '40011', 'Juan B'],
  ['2acbfc5c9a384b05a27f5b00449ae8e2', '40012', 'Jose C'],
  ['ba86bac12ad747c4b1800e205541f666', '40013', 'Jorge D'],
  ['7e7752c5e859414fb7bc77e1cd2f7f5f', '40014', 'Patricio E'],
  ['4efb2b944a984e028cc19a21db86c2e4', '40015', 'Martin F'],
  ['d9e091c56d5147c799c67d37a3b95294', '40016', 'Pablo G'],
  ['99ed722aab18447bab94135f1dcea51f', '40017', 'Ernesto H'],
  ['67aed78193644b25a74c56650c5d8422', '40018', 'Cristian I'],
  ['80eaf4de78644cafae4cfb13b3925f16', '40019', 'Marcelo J']
];

const templ = {
  uid: '',
  personal_info: { 
    full_name: '',
    languages: 'es', dni: '40002', country: 'ar', 
    birthday: '', age: 0, sex: 'M', region: '',
    comune: '', address: '', coordinates: '', phone: '',        
    preferred: '', health: '', extras: '', email: '',
  },
};

async function run_updateAccount(id, data) {
  const account = await AccountsService.getAccountById(id);
  if (!account) 
    return;
  const r = await AccountsService.updateAccount(id, account, data);
  console.log("Account update uid=", r, id, data);
}

async function run_getFilteredValidators(payload) {
  // Check if it exists or create it
  let theSet = await AccountsService.getFilteredValidators(payload);
  vec = theSet.map((t) => t.linked_account_uid);
  console.log('Validators set=', vec);
}


setTimeout(async () => {
  await sequelize.sync({ 
    // force: true,
    // alter: true 
  });

  // update validators info from test set
  for (var j=0; j < testset.length; j++) {
    let data = templ;
    data.uid = testset[j][0];
    data.personal_info.dni = testset[j][1] ;
    data.personal_info.full_name = testset[j][2];
    await run_updateAccount(data.uid, data);
  }

  let payload = {
    country: 'ar',
    languages: 'es'
  };
  await run_getFilteredValidators(payload);
}, 10);
