Desarrolladores de aplicaciones
================================

Aquí aclaramos preguntas frecuentes de desarrolladores individuales, equipos de desarrollo u organizaciones que desean utilizar nuestro protocolo para solicitar verificaciones desde sus propias aplicaciones.

## Cómo debes registrate

Para registrarse como desarrollador y poder acceder a nuestra API, debes:

- **Crear tu cuenta**, eligiendo la opción indicada más abajo:

<figure markdown>
![](../images/Selecci%C3%B3n_002.png){ width="360px" }
</figure>

- Una vez registrado debes completar tus datos personales tal como se solicita, y esperar a ser verificado.

Habiendo sido verificado ya puedes ingresar a tu tablero de control.

## Genera tu clave

Ya en tu tablero de control puedes ver tu clave de autorización (API_KEY):

<figure markdown>
![](../images/Selecci%C3%B3n_003.png){ width="460px" }
</figure>

Aquí también puedes generar una nueva clave de autorización. 

## Usa la API

Ya disponiendo de tu API_KEY, puedes invoca nuestra API REST desde tus propias aplicaciones, tal como se describe en [Verifications API](https://github.com/NEAR-Hispano/identicon/blob/master/docs/apis/verifications-api.md)

***POST `https://api.identicon.network/verifications`***

La cuenta autorizada que ha iniciado la sesión solicita una nueva verificación para un determinado asunto. Esto cifrará la información del sujeto y enviará la solicitud.

**Request**
~~~ http
headers:
  Authorization: "Bearer ${API_KEY}"
  Content-Type: "application/json"
  Accept: "application/json"
body:
  subject_id // ex: 'AR_DNI_1234567890'
  type // verification type: 'ProofOfLife'
  personal_info: {
    email 
    phone 
    full_name
    birthday // ISODate format, ex: '1956-05-12'
    sex // 'M', 'F', 'U'
    country // ex 'mx', 'ar', 've', 'bo', cl', 'uy', ..
    languages // list of prefered language codes, ex 'es', 'en' 'po' ...
    preferred // preferred way to contact `WHATSAPP`,`TELEGRAM`,`ONSITE`.
  }
~~~

**Precondiciones**:

- Requiere un usuario registrado y autorizado, o ERR => 401.
- El solicitante es la cuenta registrada, o ERR => 401.
- El usuario DEBE haber sido verificado y tener un `subject_id` asociado. Esto puede ser permitido cuando el solicitante pide la verificación para sí mismo, o ERR => 403.
- El `subject_id` NO debe estar vacío y respetar el formato `${country_code}_${doc_type}_${doc_number}`, o ERR => 409.
- Todos los campos de información personal son obligatorios y NO pueden estar vacíos (algunos de ellos pueden requerir una validación adicional, como la fecha de nacimiento), las excepciones son `health, extras` que pueden estar vacíos, o ERR => 409.

**Acciones**

1. Asignar 'request_uid' = UUID.
1. **Llamar al contrato BC `request_verification(request_uid, type, subject_id, personal_info)`**.
1. Si la llamada falló => ERR 409,402,500 (si es posible utilizar el error de la llamada BC)
1. Si subject_id no existe en `Subjects`, **Encriptar la información personal e insertarla en la tabla**.
1. **Insertar en la tabla `Verificaciones`** con request_uid, state='UN', result=NULL, y `must_start, must_end` según lo establecido por la llamada al contrato. 
1. **Añadir la verificación a la cola para poder asignar posteriormente los validadores**. 
1. => Respuesta

**Respuesta**: 

Devolverá el nuevo `uid_solicitado` y la ventana de tiempo de verificación (probable).
~~~
headers:
  Status: 200 Ok. Verification request was successful
  Content-Type: application/json
  Accept: application/json
body: 
  request_uid // the assigned UUID for this request
  must_start // ISODatetime of probable start time
  must_end // ISODatetime of probable end time
~~~

**Errores:**

- `401 Unauthorized`:  No authorizated user or AUTH_KEY invalid.
- `403 Forbidden`:  Invalid AUTH_KEY or it may be due to the user not having the necessary permissions for this action.
- `402 Payment Required`: If the requester has exceeded the allowed number of montly requests, transfer of funds may be needed to allow additional requests.
- `404 Not Found`: The requester account could not be found.
- `409 Conflict`: The request could not be processed because of conflict in the current state of the resource, a malformed body, or invalid data.
