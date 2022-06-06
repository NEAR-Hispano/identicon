
Naming conventions:

- `BC`: NEAR Blockchain
- `GW`: Gateway (mediator)
- `DB`: Gateway hosted DB
- `TX`: A BC transaction 

Design goals: 

- Keep most of the info *inside* the BC data space.
- Use the GW as an encryption layer *over* the BC.
- Use the GW DB as an indexer and for onboarding new users.
- Keep the GW as minimum layer for a simple OpenAPI.
