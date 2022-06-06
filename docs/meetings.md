# Minutas y anotaciones

Aquí anotamos decisiones tomadas durante reuniones de equipo que afectan el desarrollo, o impactan en los alcances para llegar a un MVP en tiempos razonables.

El avance y tablero de tareas del proyecto puede verse en [Identicon Semanal](https://trello.com/b/KOL9TC5u/semanal) e [Identicon Roadmap](https://trello.com/b/xpX9F2IY/roadmap).

## 02 Junio 2022

### Fondeo de pedidos
Hasta cuanto vamos a fondear a una nueva cuenta, es decir, cuantos pedidos de verificacion puede hacer hasta que debamos refondearla

**Decidido**: Fondear nueva cuenta con el valor de **dos (2) verificaciones por mes**. Más de dos, el usuario debe transferir fondos a la cuenta correspondiente. Por ahora, y hasta que tengamos un mejor analisis económico parece suficiente.

Porque ? Vamos a fondear una cierta cantidad de verificaciones y no un monto en NEAR para la cuenta, debido a que los problemas de cambio, etc, pueden hacer inviable otras variantes. Esto sigue de algún modo el modelo FREEMIUM, una cantidad gratuita, despues tiene un costo

### Quienes pueden ser solicitantes

**Decidido**: Por ahora limitaremos los solicitantes a personas físicas que puedan ser validadas. No trataremos (por ahora) el caso de Organizaciones actuando como solicitantes. El caso de desarrolladores que usen la API es similar al de personas físicas, tal vez solo cambiando la cantidad de solicitudes gratuitas admitidas.

### Pago a validadores

¿Debemos pagar a los validadores un precio fijo o los validadores pueden competir por una determinada verificación, de modo que los validadores más cercanos al sujeto den un presupuesto más bajo? @LM: ¿debemos crear un token que se utilice para pagar a los validadores?

**Decidido**: Usar una moneda estable para definir el monto, por ej USN. Y agregar un metodo al contrato para poder modificar estos parametros:

- `VALIDATOR_REMOTE_VERIFICATION_FEE` (en USN)

- `VALIDATOR_ONSITE_VERIFICATION_FEE` (en USN)

### Emisión de certificado

Cómo vamos a proporcionar las pruebas de identidad a otras terceras partes interesadas, una vez que se haya verificado a alguien (como las NFT, etc.) y cómo vamos a almacenar los datos de identidad teniendo en cuenta las cuestiones de privacidad.

**Decidido**: Nos basaremos en el trabajo del  @LM: [Credencial Verificable](https://github.com/NEAR-Hispano/identicon/blob/master/docs/verifiable-credential.md) para generar la Credencial. Esta credencial tomará la forma de un NFT No transferible.

**Propuesta**: (no aprobado aún) Los metadatos para el NFT serían:

- SubjectId: ex `AR_DNI_123456789`
- SubjectName: ex `María Lucía Robles Perez`
- RequesterId: ex `AR_DNI_444555666`
- RequesterName: ex `Mercedes Benavidez Robles` 
- List of ValidatorIds: ex [`0FG3...897`, `A034...878`, `BECD...999`]  
- EmittedDate: ex `2022-06-02` 
- DueDate: ex `202-07-10` 
  
### Bootstrap del Gateway

**Decidido**: Se aprobó la contratación del servidor y la intalación y bootstrap realizada por @JM. Stack: Nodejs, Express, Sequalize ORM y SQLite. Se implemento el modelo de datos del GW ya aprobado. Se comienza desarrollo de la PI de onboarding.

### Preview dashboard del Solicitante

**Decidido**: Se considera suficiente como punto de partida inicial y para aclarar ideas.

### Modelo de datos Gateway

**Decidido** ya esta aprobado y es parte del ciclo de desarrollo. NO habrá más cambios por ahora. Pude verse en [Modelo de Datos](./data-models.md)

### Modelo de datos Contrato 

**En revision**: Aunque está finalizado, lo dejamos en revisión por ahora dado que es muy reciente. Pude verse en [Modelo de Datos](./data-models.md)
