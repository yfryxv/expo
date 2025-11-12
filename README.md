## API Empleos Inclusivos

API REST construida con Node.js, Express y MySQL para conectar empresas que ofrecen plazas inclusivas con candidatos con discapacidad.

### Características
- Registro y autenticación JWT con roles `empresa` y `candidato`.
- CRUD de ofertas laborales restringido a empresas.
- Postulación de candidatos y consulta de postulantes por parte de empresas.
- Recomendaciones básicas de ofertas usando un motor heurístico.
- Documentación interactiva con Swagger en `http://localhost:3000/api/docs`.
- Contenedores Docker para la API y la base de datos MySQL.

### Requisitos
- Node.js 18+
- Docker (opcional, solo si deseas usar `docker-compose`)

### Configuración local
1. Copia `env.example` a `.env` y ajusta los valores.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Inicia la API en modo desarrollo:
   ```bash
   npm run dev
   ```

La API se levantará en `http://localhost:3000`.

### Variables de entorno
| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto HTTP |
| `JWT_SECRET` | Llave para firmar los tokens JWT |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Configuración de MySQL |
| `JWT_EXPIRES_IN` | Tiempo de expiración de los tokens |

### Endpoints principales
- `POST /api/usuarios/registro`
- `POST /api/usuarios/login`
- `GET /api/usuarios/perfil`
- `GET /api/ofertas`
- `POST /api/ofertas` *(empresa)*
- `PUT /api/ofertas/:id` *(empresa propietaria)*
- `DELETE /api/ofertas/:id` *(empresa propietaria)*
- `POST /api/postulaciones` *(candidato)*
- `GET /api/postulaciones/mis` *(candidato)*
- `GET /api/postulaciones/oferta/:offerId` *(empresa)*
- `GET /api/recomendaciones` *(candidato)*

### Uso con Docker
1. Levanta los contenedores:
   ```bash
   docker-compose up --build
   ```
2. La API estará disponible en `http://localhost:3000` y la base en `localhost:3306`.

### Notas
- Al iniciar la API se crean automáticamente las tablas si no existen.
- El servicio de recomendaciones usa coincidencias simples entre habilidades del candidato y requisitos de las ofertas.


