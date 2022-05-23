# Onboarding de nuevos usuarios

**Objetivos** 

- Facilitar el onboarding de nuevos usuarios que no tienen ningún conocimiento del mundo cripto, utilizando técnicas ya conocidas y probadas en la Web2.
- Vincular las cuentas en NEAR a correos de los usuarios y acceder a la App usando solo un passcode.
- Permitir que los nuevos usuarios puedan solicitar una verificación en forma inmediata, sin tener que "fondear" sus cuentas.

**Changelog**

- May 23 2022 - @MAZ - documentación final
- May 20-23 2022 - @MAZ, @LM - análisis y revisiones sobre propuesta inicial
- May 19 2020 - @LM - propuesta inicial

## Actores

**Solicitantes (Requester)**: Es quien realiza la solicitud de verificación, que puede ser distinto a la persona que será verificada. Actualmente, limitamos los solicitantes a personas físicas (max dos solicitudes por mes). En el futuro podrían ser organizaciones (muchas solicitudes).

**Sujeto (Subject)**: Es quien será verificado y cuyos datos y resultado quedarán asentados en la BC.

**Validador (Validator)**: Es quien realizará la tarea de verificación en sí misma y reportará el resultado. DEBEN ser personas (no organizaciones) y se limitará la cantidad de verificaciones a un cierto máximo diario.

**Externo (External) y Devs**: Es un desarrollador o una organización que, a través de la API y desde su propia dApp, solicita verificaciones. Inicialmente, se limitará la cantidad de verificaciones a un cierto máximo diario a determinar.

**App o Frontend (aka UI)**: la aplicación que corre en el navegador del usuario y que interactúa con el mismo.

**Gateway (aka GW)**: un servicio que actúa como mediador entre la App (UI) y los contratos en la Blockchain (BC). 

**Blockchain contracts (aka BC)**: los "smart contracts" creados sobre la Blockchain (NEAR en nuestro caso).

## Cuentas

La interacción entre la UI y el GW se produce utilizando `una cuenta NEAR por cada usuario registrado`. Estas cuentas residen exclusivamente en el GW, y tienen las siguientes características:

- La cuenta se crea durante el proceso de Onboarding usando email o telefono. 

- El nombre de la cuenta se asignará automaticamente, usando la convención de cuentas implícitas de NEAR: [Implicit Accounts | NEAR Documentation](https://docs.near.org/docs/roles/integrator/implicit-accounts) que se menciona más abajo

- En el GW se guardan los datos de la cuenta, su **account_id** y su **vinculación unívoca con el email o teléfono** y su conjunto de claves (public/private).

- Las cuentas solo son accesibles *dentro* del GW. Los usuarios no conocen sus claves públicas ni privadas y NO tienen acceso a las mismas. 

- Las cuentas se fondearán inicialmente con el monto necesario para cubrir dos (2) verificaciones.

- Un usuario con un wallet de NEAR puede fondear esta cuenta para habilitar más verificaciones, desde sus propias cuantas a las cuentas así creadas.

#### Asignación de nombres de cuentas

Los nombres de cuentas serán asignadas por el GW del modo en que se asignan la cuentas implicitas en NEAR [Implicit Accounts | NEAR Documentation](https://docs.near.org/docs/roles/integrator/implicit-accounts)

> Implicit accounts work similarly to Bitcoin/Ethereum accounts.
> - They allow you to reserve an account ID before it's created by generating a ED25519 key-pair locally.
> - This key-pair has a public key that maps to the account ID.
> - The account ID is a lowercase hex representation of the public key.
> - An ED25519 Public key contains 32 bytes that maps to 64 characters account ID.
> - The corresponding secret key allows you to sign transactions on behalf of this account once it's created on chain.

El `account_id` de la cuenta es su clave pública: `BGCCDDHfysuuVnaNVtEhhqeT4k9Muyem3Kpgq2U1m9HX`.

#### Uso de la API por usuarios externos

Cuando un usuario externo desea usar la API de Identicon, se debe logear inicialmente como cualquier otro usuario. 

Obtendra así un `API_KEY` (similar a como funcionan muchas APIs) y además dispondrá del nombre de la cuenta creada para su uso. La información estará disponible en su Dashboard, desde donde puede renovar su API_KEY.

Para usar la API deberá usar esta API_KEY pasando el header  `Authorization = Bearer API_KEY` en el cada llamado.

Debido a que las cuentas se fondearán inicialmente solo con el monto necesario para cubrir dos (2) verificaciones, y esto puede ser insuficiente para una API, la App que usa la API puede fondear esta cuenta cuando lo necesite. O podríamos facturar servicios contra el consumo de dicha cuenta.

#### Datos básicos de una cuenta 

En el GW se resguardan los datos básicos de la cuenta y su relación con el email, por ejemplo:

|type|email|account_id|verified| keys                             |
|--|--|--|--|--|
|R|marux2022@gx.com|BGCC...m9HX|false|{"public":"...","private":"..."}|
|S|mlauvalez@gx.com|ACCC...67HX|true| {...}                            |
| V    |jperez2021@gx.com|DECC...yzHX|true| {...}                            |
| X    |dev@someone.com|0123...nmUV|true|{...}|

Donde `type`:

- `R`: Requester

- `S`: Subject

- `V`: Validator

- `X`: Extern

## Flujo de mensajes 

El flujo final del Onboarding de un nuevo usuarios:

![](/home/mzito/dev/work/identicon/docs/images/signup-flow-final.png)

## Propuesta 

El flujo e interacciones se detalla en el siguiente diagrama:

![](/home/mzito/dev/work/identicon/docs/images/signup-flow-proposal.png)

