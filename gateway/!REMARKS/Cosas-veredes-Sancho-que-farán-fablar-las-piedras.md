
# @MAZ - 07-JUN-2022

Por algun MUY extraño motivo esto no funciona usando JEST:
~~~sh
npm run test create-near-account
~~~

Resulta en: 
~~~
> identicon-gw@0.0.1 test
> jest --coverage "create-near-account"

 PASS  tests/create-near-account.test.js
  Create NEAR implicit account
    ✓ should test that nearService is loaded (27 ms)

  console.log
    getConfig testnet identicon.testnet ed25519:4bjVeXSn6zh4sZRVc56xB2KyuFdFrZ6WCEzPYCRR2h6hC8qY2EfwQnG1F7XszzY4sVUXBWeVKcXKEV3UFQbfzuAo

      at Object.getConfig (src/services/near.service.js:52:11)

  console.log
    getConfig testnet identicon.testnet ed25519:4bjVeXSn6zh4sZRVc56xB2KyuFdFrZ6WCEzPYCRR2h6hC8qY2EfwQnG1F7XszzY4sVUXBWeVKcXKEV3UFQbfzuAo

      at getConfig (src/services/near.service.js:52:11)

  console.log
    ERR= TypeError: unexpected type, use Uint8Array
        at checkArrayTypes (/home/mzito/dev/work/identicon/gateway/node_modules/near-api-js/node_modules/tweetnacl/nacl-fast.js:2165:13)
        at Function.Object.<anonymous>.nacl.sign.keyPair.fromSecretKey (/home/mzito/dev/work/identicon/gateway/node_modules/near-api-js/node_modules/tweetnacl/nacl-fast.js:2318:3)
        at new KeyPairEd25519 (/home/mzito/dev/work/identicon/gateway/node_modules/near-api-js/lib/utils/key_pair.js:100:58)
        at Function.fromString (/home/mzito/dev/work/identicon/gateway/node_modules/near-api-js/lib/utils/key_pair.js:78:40)
        at Object.getConfig (/home/mzito/dev/work/identicon/gateway/src/services/near.service.js:61:27)
        at Object.run (/home/mzito/dev/work/identicon/gateway/tests/run-create-account.js:5:15)
        at Object.<anonymous> (/home/mzito/dev/work/identicon/gateway/tests/create-near-account.test.js:7:13)
        at Object.asyncJestTest (/home/mzito/dev/work/identicon/gateway/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:106:37)
        at /home/mzito/dev/work/identicon/gateway/node_modules/jest-jasmine2/build/queueRunner.js:45:12
        at new Promise (<anonymous>)
        at mapper (/home/mzito/dev/work/identicon/gateway/node_modules/jest-jasmine2/build/queueRunner.js:28:19)
        at /home/mzito/dev/work/identicon/gateway/node_modules/jest-jasmine2/build/queueRunner.js:75:41
        at processTicksAndRejections (internal/process/task_queues.js:95:5)

      at tests/run-create-account.js:10:15

  console.log
    DONE= [
      null,
      TypeError: unexpected type, use Uint8Array
          at checkArrayTypes (/home/mzito/dev/work/identicon/gateway/node_modules/near-api-js/node_modules/tweetnacl/nacl-fast.js:2165:13)
          at Function.Object.<anonymous>.nacl.sign.keyPair.fromSecretKey (/home/mzito/dev/work/identicon/gateway/node_modules/near-api-js/node_modules/tweetnacl/nacl-fast.js:2318:3)
          at new KeyPairEd25519 (/home/mzito/dev/work/identicon/gateway/node_modules/near-api-js/lib/utils/key_pair.js:100:58)
          at Function.fromString (/home/mzito/dev/work/identicon/gateway/node_modules/near-api-js/lib/utils/key_pair.js:78:40)
          at getConfig (/home/mzito/dev/work/identicon/gateway/src/services/near.service.js:61:27)
          at Object.createImplicitAccount (/home/mzito/dev/work/identicon/gateway/src/services/near.service.js:85:26)
          at Object.run (/home/mzito/dev/work/identicon/gateway/tests/run-create-account.js:13:15)
          at Object.<anonymous> (/home/mzito/dev/work/identicon/gateway/tests/create-near-account.test.js:7:13)
          at Object.asyncJestTest (/home/mzito/dev/work/identicon/gateway/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:106:37)
          at /home/mzito/dev/work/identicon/gateway/node_modules/jest-jasmine2/build/queueRunner.js:45:12
          at new Promise (<anonymous>)
          at mapper (/home/mzito/dev/work/identicon/gateway/node_modules/jest-jasmine2/build/queueRunner.js:28:19)
          at /home/mzito/dev/work/identicon/gateway/node_modules/jest-jasmine2/build/queueRunner.js:75:41
          at processTicksAndRejections (internal/process/task_queues.js:95:5)
    ]

      at tests/run-create-account.js:15:15

------------------------|---------|----------|---------|---------|-------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------------------|---------|----------|---------|---------|-------------------
All files               |   60.53 |      100 |   71.43 |   60.53 |                   
 src/services           |   55.17 |      100 |     100 |   55.17 |                   
  near.service.js       |   55.17 |      100 |     100 |   55.17 | 64-67,89-110      
 tests                  |   77.78 |      100 |      60 |   77.78 |                   
  run-create-account.js |   77.78 |      100 |      60 |   77.78 | 7,18              
------------------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.102 s
~~~

PERO esto SÍ funciona:
~~~sh
node tests/run-create-account.js
~~~

Resultado:
~~~sh
getConfig testnet identicon.testnet ed25519:4bjVeXSn6zh4sZRVc56xB2KyuFdFrZ6WCEzPYCRR2h6hC8qY2EfwQnG1F7XszzY4sVUXBWeVKcXKEV3UFQbfzuAo
getConfig testnet identicon.testnet ed25519:4bjVeXSn6zh4sZRVc56xB2KyuFdFrZ6WCEzPYCRR2h6hC8qY2EfwQnG1F7XszzY4sVUXBWeVKcXKEV3UFQbfzuAo
DONE= {
  networkId: 'testnet',
  keyStore: InMemoryKeyStore {
    keys: {
      'identicon.testnet:testnet': 'ed25519:4bjVeXSn6zh4sZRVc56xB2KyuFdFrZ6WCEzPYCRR2h6hC8qY2EfwQnG1F7XszzY4sVUXBWeVKcXKEV3UFQbfzuAo'
    }
  },
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org'
}
createImplicitAccount id='bf8060f82a904194bb3fabe8fbd85b43.identicon.testnet' initial=2000000000000000000000
DONE= [
  {
    id: 'bf8060f82a904194bb3fabe8fbd85b43.identicon.testnet',
    public_key: 'ed25519:6jTxUBoacoaTT2rKMjryLRPSECcF1XUAxyuu618Zskic',
    private_key: '5Mf7M3uTeaPYtjsVYXr3XuhbJPvaLveaLAUS4SnrrVyMxohD82J1JmNrwe8HE4Y4QKDcFB2iHx4f83RiNi9dqGVv'
  },
  null
]
~~~
