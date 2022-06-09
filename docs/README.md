
# Índice de documentación

### Qué es ? ###

![Flujo general](./images/General_Flow_Diagram.png)

[Conceptos básicos](./conceptos-basicos.md)

[Credencial Verificable](./verifiable-credential.md)

## Flujos de mensajes ##

[Onboarding nuevos usuarios](./onboarding-nuevos-usuarios.md)

[Solicitud de verificación](./images/Request_Flow_w_API_srv.png)

## Diseño y arquitectura ###

**Convenciones y nomenclatura**:

- `UI`: La interfaz de usuario (Web App).
- `BC`: La Blockchain NEAR y sus "smart contracts".
- `GW`: El Gateway, un "mediador" entre la UI y la BC.
- `DB`: Base de datos alojada en el GW.
- `TX`: Una transacción en la BC.

**Objetivos de diseño**:

- Mantener la mayor parte de la información *dentro* del espacio de datos de la BC.
- Generar una API simple que pueda ser usada por terceras partes.
- Facilitar el onboarding simple y sencillo de nuevos usuarios, simplificando la creación de nuevas cuentas y sus respectivas "wallets".
- Proveer privacidad adicional sobre los datos personales y la anonimidad de los validadores.

**Arquitectura**

Auí se describe la [Arquitectura general](./architecture.md) de la solución.

**Modelo de datos**:

Dada la arquitectura existen dos modelos de datos relacionados:

- El [Modelo de datos usado por el GW](./models/gateway-data-model.md)

- El [Modelo de datos del Contrato en la BC](./models/contract-data-model.md)

**API**:

La UI y las terceras partes que utilizen el servicio, usarán:
- La [API del GW](./apis/gateway-api.md)

EL GW en sí mismo (y las Apps que necesiten acceso directo a la BC) pueden usar:
- La [API del Contrato](./apis/contracts-api.md)

**User Interface**

Flujos de interacción para cada actor y sus endpoints:

- [Solicitantes](./images/Requester_UI_Flow.png)
- [Validadores](./images/Validator_UI_Flow.png)

**Minutas**

Mantenemos documentadas en nuestras [Minutas de reunión](./meetings.md) las decisiones de diseño y de desarrollo (y su justificación) que tomamos a lo largo del proyecto.

### Otros recursos ###

[Artículos y notas](./referencias.md)
