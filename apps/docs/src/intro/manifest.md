# Manifiesto

La "interfaz digital" entre nosotros y el mundo real implica que en muchos casos no sabemos realmente con quién estamos interactuando. ¿Es esta persona quien dice ser? ¿Es una falsificación? ¿Está viva?

Esta falta de conocimiento tiene también toda una serie de implicaciones en la OpenWeb, como conocer e identificar a los colaboradores, a los clientes, evitar los retiros fradudulentos y las estafas. La lista de fraudes aumenta día a día, debido a la falta de identidad de los proyectos y de las personas que los gestionan.

Creemos que la solución de este problema permite la detección anticipada de fraudes sociales y de identidad, preservando la reputación, generando un gran ahorro de fondos perdidos y evitando muchas otras pérdidas sociales y económicas.

También abre todo un conjunto de casos de uso en los que estas identidades validadas pueden utilizarse de forma segura, con profundas repercusiones sociales y económicas.

### Nuestra propuesta

`Identicon.network` es un protocolo **basado en la comunidad** para la **verificación de identidad**, centrado en proporcionar múltiples validaciones firmadas de una entidad del mundo real y vincularla a una (o más) identidades digitales, independiente de la forma que puedan adoptar estas identidades digitales (NFT, DID, etc). 

No es una bóveda segura para la identidad digital ni un depósito de identidades únicas. Es estrictamente un "protocolo de verificación".

Se basa en la selección descentralizada y al azar de validadores humanos anónimos (ciudadanos), que producirán la validación "in situ" o "remota" de la identidad solicitada, prueba de vida o prueba de existencia.

Se puede encontrar información más detallada en nuestro [Whitepaper](https://docs.google.com/document/d/1lDRp3crvEXCSTWXkbAY-ONF3Barg7jDoOdzxh1UjYmE/edit?usp=sharing)

### Por qué 

En la comunidad de la OpenWeb ha habido varios enfoques relacionas con esto, aquí mencionamos solamente algunas:

- [Identidad digital auto-soberana](http://es.wikipedia.org/wiki/Self-sovereign_identity)
- [Bright ID](http://www.brightid.org): La identidad es un derecho humano. BrightID es una red de identidad social que te permite demostrar que sólo utilizas una cuenta. Es el santo grial de la identidad digital.
- [Proof of Humanity](http://www.proofofhumanity.id): un sistema que combina redes de confianza, con pruebas de Turing inversas, y resolución de disputas para crear una lista de humanos a prueba de "sybils".
- [DIDI](http://didi.org.ar): Blockchain para una identidad digital auto-soberana.
- [W3C DID](https://www.did.id/) - también conocido como DAS "Sistema de Cuentas Descentralizadas".

Pero pensamos que las implementaciones actuales presentan problemas que las hacen ineficaces, o no totalmente "confiables":

- Depende de tener que pedir a personas conocidas que respondan por ti, lo que permite esquemas de fraude y además no es viable para todo un conjunto de personas (ProofOfHumanity). 
- Dependen de instituciones gubernamentales o autorizadas para la validación (como RENAPER), con los conocidos efectos centralizadores (DIDI).
- Complejo de usar para usuarios inexpertos que requieren tener una cartera, tener algunos fondos de criptomonedas en ellos, enviar fondos, etc.
- Imposibilidad de uso para personas mayores, cuando serán uno de los principales solicitantes de validación, debido a la baja cultura digital y al bajo nivel de acceso a la tecnología.
- Imposibilidad de uso de monedas "usuales": Dificultad para pagar las solicitudes de validación y las compensaciones de los validadores en moneda de curso legal, aunque esto puede solucionarse cuando más monederos permitan las interacciones en fiduciario.
- Centrado en la identidad única, pero no en el proceso de verificación de la identidad (BrightID).
- Caro: altos costes de transacción y tasas de gas para su funcionamiento.

### Ventajas

Pensamos que nuestro enfoque de verificación "basado en el comunidad" presenta ventajas sobre las soluciones existentes:

- **Descentralización**: el uso de validadores ciudadanos anónimos y aleatorios asegura una descentralización efectiva, sin permitir que ninguna organización autoritaria o central tome el control. Como protocolo, múltiples DAOs pueden actuar como proveedores de servicios de validación utilizando el protocolo.

- **Transparencia**: el uso de validadores aleatorios y anónimos, así como de eventuales auditores aleatorios adicionales, proporciona una nivel de transparencia óptima al protocolo.

- **Inmutabilidad**: una vez reportada cada validación, los resultados de la misma son inmodificables, no siendo susceptibles de alteraciones por terceras partes. 

- **Facilidad de uso**: permitir que el servicio se encargue de todos los aspectos del proceso de validación y llevar las validaciones "in situ" por parte de los validadores registrados, simplifica enormemente su adopción y uso, transformándolo en un servicio, en lugar de una compleja validación digital "hágalo usted mismo".

- **Bajo costo**: el uso de [NEAR Protocol](http://near.org) como base tecnológica permite reducir los costes para el solicitante y compensar mejor a los validadores, un aspecto crítico para la viabilidad.

### Características

- Vincula la identidad del mundo real a una (o más) identidades digitales únicas.

- Pone la validación en manos de la comunidad (verificación ciudadana). 

- Amplia el universo de validadores: cualquiera puede ser un validador.

- Usa personas (en lugar de algoritmos) para reconocer a otras personas, con las ventajas inherentes a ello.

- Lleva la validación al lugar donde viven las personas, sin obligarlas a desplazarse para demostrar su identidad.

- Simplifica las solicitudes de prueba de identidad y el proceso de validación en una Dapp intuitiva y fácil de usar.

- Permite que las validaciones recurrentes (una vez a la semana, una vez al mes, etc.) sean programadas y gestionadas por la red.

Abriendo un conjunto amplio de casos de uso tales como: 

- Validación de la existencia de activos físicos
- Validar a los proveedores de bienes y servicios
- Demostrar la identidad y la vida de los usuarios validados en las plataformas de las redes sociales.
- Implementar facilmente KYC en una app, delegando a nuestro protocolo el proceso de verificación.
