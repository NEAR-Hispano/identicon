**Project title**: `Identicon`

**Proposal**: [Identicon Verification Protocol](https://gov.near.org/t/proposal-identicon-identity-verification-protocol/20414)

**Project Summary**

Identicon is a trustless protocol for identity verification in the NEAR network, focused on providing multiple signed verifications of a real world entity and binding it to one (or more) digital identities, and independent of the form these digital identities may take (NFT, DID, etc). It is not an identity vault or a repo for unique identity.

Is based on a set of decentralized and random selection of human nodes (citizens) which will produce the “on-site” verification of the solicited identity, proof of life or proof of existence.

**Series**: Onboarding NEAR Certified Developer bootcamp participants to Developers in Residence program

**Team involved in development:**

- Juan Mescher - @jmescher
- Leandro Manzanal - @leamanza
- Mario Zito - @mariozito

**Periods and Results**

`May 16/2022` →  `May 20/2022`, `(Argentina)`

This week we assembled the Team, had our first team meetings to bootstrap the project, define criteria and start designing the architecture.
Initial conclusions:

-  As we will be focused on general public not used to using crypto tools/tech, the onboarding MUST be extremely simple (similar to Web2) without the need to use wallets. But we will have wallets and NEAR accounts created on background. @leamanza started designing the onboarding.
- We discussed alternatives to manage privacy in the Blockchain, as the ProofOfLife needs some personal private data that should not be visible to third parties.@jmescher started analyzing this as well as using pub/priv key pairs to encrypt it.
- We needed to clarify general concepts, flow and several discussion points. @mariozito started creating docs and diagrams, organizing work, code and documentation. Also bringing previous work on the NCA, NCD and NCAR bootcamps to this repo.
- Established the [Project Roadmap](https://trello.com/b/xpX9F2IY/roadmap) and [Weekly tasks](https://trello.com/b/KOL9TC5u/semanal)
- Hithub repo is [Identicon Network](https://github.com/NEAR-Hispano/identicon) and [Documents](https://github.com/NEAR-Hispano/identicon/tree/master/docs)

`May 23/2022` → `May 27/2022`, `(Argentina)`

This week we advanced on points mentioned in previous week, and decided that both for simplified onboarding as for encrypting personal data, photos and videos, we would need a dedicated (centralized) Gateway. 

- @leomanza finished the design and documented the onboarding processed. 
- @jmescher defined the Gateway tech stack, did the search for providers and the bootstrap of the Gateway.
- @mariozito designed and documented the Message flow for the onboarding, the initial (partial) Gateway API, and the Gateway DB models.

`May 30/2022` → `Jun 03/2022`, `(Argentina)`

- @leomanza finished the research on how to create a verification certificate, and documented the Verifiable Credentials standard applied to our use case.
- @jmescher implemented the Gateway DB and models and already has a dockerized working instance using Ubuntu20.04, Nodejs, Expressjs, Sequelize ORM and SQLite.
- @mariozito designed and documented the message flow for the Verification request, continued with the Gateway API, and finished the Contract data model.
- As a team we reviewed all work done, assigned priorities for next week, and defined certain points, resumed in the [Meeting briefings](https://github.com/NEAR-Hispano/identicon/blob/master/docs/meetings.md).

**Last weeks results** 

An index of all the created documentation, tech stack and design decisions follows:

### Intro and concepts  ###

[Basic concepts](https://github.com/NEAR-Hispano/identicon/blob/master/docs/conceptos-basicos.md)

General flow

![General flow diagram](upload://rTaxfNk9fg2k7zC5zWsSWRGke9G.png)

[Verifiable Credentials](https://github.com/NEAR-Hispano/identicon/blob/master/docs/conceptos-basicos.md)

### Message flows ###

[Onboarding of new users](https://github.com/NEAR-Hispano/identicon/blob/master/docs/onboarding-nuevos-usuarios.md)

[Verification request](https://github.com/NEAR-Hispano/identicon/blob/master/docs/images/Request_Flow_w_API_srv.png)

### Architecture and design ###

[General arcuitecture](https://github.com/NEAR-Hispano/identicon/blob/master/docs/architecture.md)

[Data models](https://github.com/NEAR-Hispano/identicon/blob/master/docs/data-models.md)

[Open API](https://github.com/NEAR-Hispano/identicon/blob/master/docs/open-api.md)

[Contract and methods](https://github.com/NEAR-Hispano/identicon/blob/master/docs/contracts-api.md)

[Meeting briefings](https://github.com/NEAR-Hispano/identicon/blob/master/docs/meetings.md)

### Resources ###

[Articles and references](https://github.com/NEAR-Hispano/identicon/blob/master/docs/referencias.md)
