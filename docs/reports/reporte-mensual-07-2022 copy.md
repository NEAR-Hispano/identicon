**Project title**: `Identicon`

**Proposal**: [Identicon Verification Protocol](https://gov.near.org/t/proposal-identicon-identity-verification-protocol/20414)

**Project Summary**

Identicon is a trustless protocol for identity verification in the NEAR network, focused on providing multiple signed verifications of a real world entity and binding it to one (or more) digital identities, and independent of the form these digital identities may take (NFT, DID, etc). It is not an identity vault or a repo for unique identity.

Is based on a set of decentralized and random selection of human nodes (citizens) which will produce the “on-site” verification of the solicited identity, proof of life or proof of existence.

**Series**: Onboarding NEAR Certified Developer bootcamp participants to Developers in Residence program

**Team involved in development:**

- Leandro Manzanal - @leamanza
- Mario Zito - @mariozito

**Facilitators:**

- Alan Estrada - @cloudmex-alan
- Cristian Zambrano. @Cristian

**Periods and Results**

`July 1/2022` →  `July 31/2022`, `(Argentina)`

**Summary:**

This last month we completed our objectives for the project:

- App (Frontend), 
- API (Gateway)
- Verified Credential Contract
- Verifications Contract
- Documents site

The app is already delivered to Tesnet and to our production server under the domain `identicon.network`: 

- App (Fe de vida): `http://fedevida.identicon.network`
- API: `http://api.identicon.network`
- Verifications: `verifications-v0-1-0.identicon.testnet` 
- Credentials: `approval.verifiable-credential-v0-0-1.testnet"`
- Docs: `http://docs.identicon.network`
- Github repo: `https://github.com/NEAR-Hispano/identicon`

While there remains some minor bugs and improvements we can say that we have reached a Minimum Viable Product, and are ready to take Identicon to the next phase.

Next phase will be:

- Make improvements and fix bugs
- Create the Identicon DAO 
- Create a community around the project 
- Secure funding so we can involve more people
- Recruit and involve validators
- Start validating real people.

**Detailed work:**

@leamanza worked mainly on setting up the frontend project and structure, Request Verification form page and PersonalData form, VerifiableCredential contract (NFT), and in creating and presenting the obtained credentials:

- Update credential card
- Credential Metadata - display identicon
- Create random credential identicon
- Add test identicon file creation and submito to Web3.storage
- Create identicon and mint credential
- Credential update receiver id and extra subj info
- Mint_credential after verification approved
- Fix_main_app_build
- Merging and testing build
- Fixes
- Request verification endpoint
- First home page
- Login_signup_error_handling
- Api error handling
- auth_requests_interceptor
- Added axio interceptor - auth requests - logout
- Main_app_wip
- Main app - signup + login + update account
- Fix API account on update

@mariozito worked mainly on the frontend (pages, forms, content and styling), on completing the Tasks Model and Gateway endpoints, and on the documentations site:

-  Complete Home page content, images and styling
-  Prepare deployment to production server
-  Add export and deploy to server
-  Add for account type in Signup
-  Add alert for incomplete personal data
-  Hide Actionbar request button if no subject_id
-  Delete replaced index.tsx file
-  Add .page in to request-verification to be recognized as route
-  Fix icon cenetring in ListItem
-  Fix hero header color
-  Fix query id in /verifications
-  Improve Hero section and call Signup and Login from different buttons
-  Add remarks field to task on GET
-  Add preview mode for report validation result,  refactor alerts and add validation instructions
-  Add state notice to Verification preview
-  Use short description for state in lists
-  Refactor dashboard and verification preview with ListItem. Normalize Section panels/headings
-  Fix styling ov Verification preview
-  Add colors to state icons
-  Add logo to header
-  Refactor  validators list in preview
-  Refactor Verification preview and add loading states
-  Add spinners for loading components
-  Add full_name to requesetr in getVerification
-  Add validations section to Verification preview
-  Fix error in Verification service and controller
-  Add Icons for verification and task states
-  Show pending and completed tasks in Validator dashboard
-  Update Task and VerificationRequest from report of validation result, change Verification state and result is already completed
-  Return the modified VerificationRequest after the  report_validation_result
-  Fix styling, build smaller components, add toast to sending
-  Add Tasks routes, controllers, service and model
-  Add tasks list for validator and page to report validation results incluing gets/puts to Gateway. Fix some stylings
-  Add TaskStates to model definitions
-  Fix bad subject_id in personal_info
-  Add Tasks model and many states and types in model/definitions
-  Fix gitignore for sqbpro files
-  Save testing database
-  Use request_uid as task id for given validator
-  Fill validator dashboard with  assigned tasks
-  Add tasks assigend route to Gateway API
-  Add order param in contract get_assigned_validations
-  Add script for updating validators testset
-  Add state change when creating Verification
-  Add reset_all to contract for full init of state
-  Change assign_validators contract api to return the selected ones
-  Change assign_validators contract api to retuen the selected ones
-  Make contract get_verification and cancel_verification public
-  Assign validators when requesting new verification
-  Fix contract call for assign_validators
-  Fix PersonalInfo for Requester accounts
-  Add can_do to validators PersonalInfo model
-  Change personal info and ActionBar if validator account
-  Select validators using country and language and update with personal data test set
-  Update features and use lang so we can filter validators by country and lang
-  Fix personal info form and create subject_id from dni and country
-  Fix initial created account balance to 1 NEAR
-  Remove debug code form near.service
-  Show verification page, improve styling, refactorr pages and componentes, separate headers for differente pages
-  Add verifications list to dashboard and only display user dashboard when logged
-  Fix account creation and signing contract problems calls caused by bad char in InitialBalace
-  Add create-account test for creating different types of accounts and gen auth token
-  Create subject_id from country and dni when request_verification
-  Create validator account for testing
-  Add /verifications api tests
-  Add PUT /verifications/:uid to API
-  Update and refactor verifications service
-  Add testdb to repo
-  Update subject and refactor subjects service
-  Add GET /verifications/:uid to API
-  Refactor API verifications endpoint
-  Improve error response in controllers
-  Add get verifications controller, service, helpers, params validators and tests to API
-  Fixed header auto width in UI to match Leandro's template
-  Add to verifications API the controller, service, contract call and tests, and fixes to model
-  Fix encoding and decoding encrypted account keys
-  Add validation middleware for verifications API
-  Add subject service to API impl
-  Fix verifications route an other minor formatting
-  Add the token payload to the req obj
-  Add frontend prototype for Landing, Onboarding and Request Verification
-  Extend the theme, add hero section, and starters section and images
-  Change random lib to near_rng
-  Add API test for account
-  Finished Maz/contract refactor
