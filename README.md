# 🎯 API REST de Empleos Inclusivos

API REST construida con **Node.js**, **Express** y **MySQL** para conectar empresas que ofrecen plazas inclusivas con candidatos con discapacidades. Incluye autenticación JWT, roles de usuario, CRUD de ofertas, sistema de postulaciones y recomendaciones inteligentes.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Endpoints](#-endpoints)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Docker](#-docker)
- [Documentación Swagger](#-documentación-swagger)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Características

- ✅ **Autenticación JWT** con roles (`empresa` / `candidato`)
- ✅ **CRUD completo de ofertas laborales** (solo empresas)
- ✅ **Sistema de postulaciones** para candidatos
- ✅ **Recomendaciones inteligentes** basadas en habilidades
- ✅ **Validación de datos** con express-validator
- ✅ **Documentación interactiva** con Swagger
- ✅ **Docker Compose** para despliegue fácil
- ✅ **Middleware de seguridad** y control de acceso por roles

---

## 🔧 Requisitos

- **Node.js** 18 o superior
- **MySQL** 8.0 o superior (o usar Docker)
- **npm** o **yarn**
- **Docker** (opcional, solo si usas docker-compose)

---

## 🚀 Instalación

### Opción 1: Instalación Local

1. **Clona o descarga el proyecto:**
   ```bash
   cd expo
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   ```bash
   cp env.example .env
   ```

4. **Edita el archivo `.env`** con tus credenciales de MySQL:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=empleos_inclusivos
   JWT_SECRET=tu-secreto-super-seguro
   ```

5. **Crea la base de datos en MySQL:**
   - Abre MySQL Workbench o tu cliente MySQL
   - Ejecuta el siguiente script SQL:

   ```sql
   CREATE DATABASE IF NOT EXISTS empleos_inclusivos
     DEFAULT CHARACTER SET utf8mb4
     DEFAULT COLLATE utf8mb4_unicode_ci;

   USE empleos_inclusivos;

   CREATE TABLE IF NOT EXISTS users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     full_name VARCHAR(150) NOT NULL,
     email VARCHAR(150) NOT NULL UNIQUE,
     password_hash VARCHAR(255) NOT NULL,
     role ENUM('empresa', 'candidato') NOT NULL,
     company_name VARCHAR(150),
     profile_summary TEXT,
     skills TEXT,
     accessibility_needs TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     INDEX idx_users_role (role),
     INDEX idx_users_email (email)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

   CREATE TABLE IF NOT EXISTS job_offers (
     id INT AUTO_INCREMENT PRIMARY KEY,
     company_id INT NOT NULL,
     title VARCHAR(200) NOT NULL,
     description TEXT NOT NULL,
     location VARCHAR(200),
     salary_range VARCHAR(100),
     employment_type VARCHAR(100),
     requirements TEXT,
     accessibility_features TEXT,
     remote_available TINYINT(1) DEFAULT 0,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     CONSTRAINT fk_job_offers_company
       FOREIGN KEY (company_id) REFERENCES users (id)
       ON DELETE CASCADE,
     INDEX idx_job_offers_company (company_id),
     INDEX idx_job_offers_location (location),
     INDEX idx_job_offers_remote (remote_available)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

   CREATE TABLE IF NOT EXISTS applications (
     id INT AUTO_INCREMENT PRIMARY KEY,
     offer_id INT NOT NULL,
     candidate_id INT NOT NULL,
     cover_letter TEXT,
     status ENUM('postulado', 'en_revision', 'entrevista', 'oferta', 'rechazado') DEFAULT 'postulado',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     CONSTRAINT fk_applications_offer
       FOREIGN KEY (offer_id) REFERENCES job_offers (id)
       ON DELETE CASCADE,
     CONSTRAINT fk_applications_candidate
       FOREIGN KEY (candidate_id) REFERENCES users (id)
       ON DELETE CASCADE,
     CONSTRAINT uq_applications UNIQUE (offer_id, candidate_id),
     INDEX idx_applications_candidate (candidate_id),
     INDEX idx_applications_offer (offer_id)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
   ```

6. **Inicia el servidor:**
   ```bash
   npm run dev
   ```

   La API estará disponible en `http://localhost:3000`

### Opción 2: Con Docker

1. **Asegúrate de tener Docker y Docker Compose instalados**

2. **Edita `docker-compose.yml`** si necesitas cambiar credenciales

3. **Levanta los contenedores:**
   ```bash
   docker-compose up --build
   ```

   Esto levantará:
   - MySQL en `localhost:3306`
   - API en `http://localhost:3000`

---

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto del servidor | `3000` |
| `JWT_SECRET` | Secreto para firmar tokens JWT | Requerido |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `4h` |
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_USER` | Usuario de MySQL | Requerido |
| `DB_PASSWORD` | Contraseña de MySQL | Requerido |
| `DB_NAME` | Nombre de la base de datos | `empleos_inclusivos` |

---

## 📖 Uso

### Verificar que la API está funcionando

```bash
curl http://localhost:3000/api/health
```

Respuesta esperada:
```json
{
  "status": "ok"
}
```

### Documentación Interactiva

Visita `http://localhost:3000/api/docs` para acceder a la documentación Swagger y probar los endpoints directamente desde el navegador.

---

## 🔌 Endpoints

### Autenticación (`/api/usuarios`)

#### `POST /api/usuarios/registro`
Registra un nuevo usuario (empresa o candidato).

**Body:**
```json
{
  "fullName": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "role": "candidato",
  "skills": "JavaScript, Node.js, MySQL",
  "accessibilityNeeds": "Acceso a silla de ruedas"
}
```

**Para empresa:**
```json
{
  "fullName": "María González",
  "email": "empresa@example.com",
  "password": "password123",
  "role": "empresa",
  "companyName": "Tech Inclusivo S.A."
}
```

#### `POST /api/usuarios/login`
Inicia sesión y obtiene un token JWT.

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "user": {
    "id": 1,
    "fullName": "Juan Pérez",
    "email": "juan@example.com",
    "role": "candidato"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### `GET /api/usuarios/perfil`
Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

---

### Ofertas Laborales (`/api/ofertas`)

#### `GET /api/ofertas`
Lista todas las ofertas disponibles (público).

**Query params opcionales:**
- `location`: Filtrar por ubicación
- `remote`: `true`/`false` para trabajo remoto
- `limit`: Número de resultados (default: 20)
- `offset`: Paginación (default: 0)

**Ejemplo:**
```bash
GET /api/ofertas?location=CDMX&remote=true&limit=10
```

#### `GET /api/ofertas/:id`
Obtiene los detalles de una oferta específica.

#### `POST /api/ofertas`
Crea una nueva oferta (solo empresas).

**Headers:**
```
Authorization: Bearer <token_empresa>
```

**Body:**
```json
{
  "title": "Desarrollador Backend",
  "description": "Buscamos desarrollador con experiencia en Node.js",
  "location": "Ciudad de México",
  "salaryRange": "$20,000 - $30,000",
  "employmentType": "Tiempo completo",
  "requirements": "Node.js, Express, MySQL, Git",
  "accessibilityFeatures": "Oficina accesible, teletrabajo disponible",
  "remoteAvailable": true
}
```

#### `PUT /api/ofertas/:id`
Actualiza una oferta (solo la empresa propietaria).

**Headers:**
```
Authorization: Bearer <token_empresa>
```

**Body:** (campos opcionales)
```json
{
  "title": "Desarrollador Backend Senior",
  "description": "Descripción actualizada"
}
```

#### `DELETE /api/ofertas/:id`
Elimina una oferta (solo la empresa propietaria).

**Headers:**
```
Authorization: Bearer <token_empresa>
```

---

### Postulaciones (`/api/postulaciones`)

#### `POST /api/postulaciones`
Un candidato se postula a una oferta.

**Headers:**
```
Authorization: Bearer <token_candidato>
```

**Body:**
```json
{
  "offerId": 1,
  "coverLetter": "Me interesa mucho esta posición porque..."
}
```

#### `GET /api/postulaciones/mis`
Lista las postulaciones del candidato autenticado.

**Headers:**
```
Authorization: Bearer <token_candidato>
```

#### `GET /api/postulaciones/oferta/:offerId`
Lista las postulaciones de una oferta (solo la empresa propietaria).

**Headers:**
```
Authorization: Bearer <token_empresa>
```

---

### Recomendaciones (`/api/recomendaciones`)

#### `GET /api/recomendaciones`
Obtiene ofertas recomendadas basadas en las habilidades del candidato.

**Headers:**
```
Authorization: Bearer <token_candidato>
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "title": "Desarrollador Backend",
    "description": "...",
    "matchScore": 3,
    ...
  }
]
```

---

## 💡 Ejemplos de Uso

### Flujo Completo: Empresa publica oferta y candidato se postula

#### 1. Registrar una empresa
```bash
curl -X POST http://localhost:3000/api/usuarios/registro \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Tech Inclusivo",
    "email": "empresa@tech.com",
    "password": "empresa123",
    "role": "empresa",
    "companyName": "Tech Inclusivo S.A."
  }'
```

#### 2. Login de la empresa
```bash
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "empresa@tech.com",
    "password": "empresa123"
  }'
```

**Guarda el `token` de la respuesta.**

#### 3. Crear una oferta
```bash
curl -X POST http://localhost:3000/api/ofertas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "Desarrollador Full Stack",
    "description": "Buscamos desarrollador con experiencia en Node.js y React",
    "location": "CDMX",
    "salaryRange": "$25,000 - $35,000",
    "employmentType": "Tiempo completo",
    "requirements": "Node.js, React, MySQL",
    "accessibilityFeatures": "Oficina accesible, trabajo remoto disponible",
    "remoteAvailable": true
  }'
```

**Anota el `id` de la oferta creada.**

#### 4. Registrar un candidato
```bash
curl -X POST http://localhost:3000/api/usuarios/registro \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Ana García",
    "email": "ana@example.com",
    "password": "candidato123",
    "role": "candidato",
    "skills": "Node.js, React, MySQL, Express",
    "accessibilityNeeds": "Acceso a silla de ruedas"
  }'
```

#### 5. Login del candidato
```bash
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ana@example.com",
    "password": "candidato123"
  }'
```

**Guarda el `token` del candidato.**

#### 6. Ver recomendaciones
```bash
curl http://localhost:3000/api/recomendaciones \
  -H "Authorization: Bearer TOKEN_CANDIDATO"
```

#### 7. Postularse a la oferta
```bash
curl -X POST http://localhost:3000/api/postulaciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_CANDIDATO" \
  -d '{
    "offerId": 1,
    "coverLetter": "Me interesa mucho esta posición porque tengo experiencia en las tecnologías requeridas."
  }'
```

#### 8. La empresa ve las postulaciones
```bash
curl http://localhost:3000/api/postulaciones/oferta/1 \
  -H "Authorization: Bearer TOKEN_EMPRESA"
```

---

## 🐳 Docker

### Levantar todo con Docker Compose

```bash
docker-compose up --build
```

### Solo la base de datos

```bash
docker-compose up -d db
```

### Ver logs

```bash
docker-compose logs -f api
```

### Detener contenedores

```bash
docker-compose down
```

### Detener y eliminar volúmenes

```bash
docker-compose down -v
```

---

## 📚 Documentación Swagger

Una vez que la API esté corriendo, visita:

**http://localhost:3000/api/docs**

Desde ahí podrás:
- Ver todos los endpoints disponibles
- Probar cada endpoint directamente
- Ver ejemplos de request/response
- Autenticarte con el botón "Authorize"

---

## 📁 Estructura del Proyecto

```
expo/
├── src/
│   ├── config/          # Configuración (DB, env)
│   ├── controllers/     # Lógica de controladores
│   ├── middleware/      # Middlewares (auth, validación, errores)
│   ├── models/          # Modelos de base de datos
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades (hash de passwords)
│   ├── docs/            # Configuración Swagger
│   ├── app.js           # Configuración de Express
│   └── server.js        # Punto de entrada
├── docs/                # Documentación adicional
├── docker-compose.yml   # Configuración Docker
├── Dockerfile           # Imagen Docker de la API
├── .env                 # Variables de entorno (no versionar)
├── env.example          # Ejemplo de variables de entorno
├── package.json         # Dependencias y scripts
└── README.md            # Este archivo
```

---

## 🔍 Troubleshooting

### Error: "Cannot connect to MySQL"

- Verifica que MySQL esté corriendo
- Revisa las credenciales en `.env`
- Asegúrate de que la base de datos `empleos_inclusivos` exista

### Error: "JWT malformed" o "Token inválido"

- Verifica que estés enviando el header `Authorization: Bearer <token>`
- Asegúrate de que el token no haya expirado (por defecto 4 horas)
- Haz login nuevamente para obtener un token fresco

### Error: "Acceso restringido a empresas"

- Verifica que el usuario tenga el rol `empresa`
- Solo las empresas pueden crear/editar/eliminar ofertas

### Error: "Oferta no encontrada o sin permisos"

- Solo la empresa que creó la oferta puede editarla o eliminarla
- Verifica que el `id` de la oferta sea correcto

### La API no inicia

- Verifica que el puerto 3000 no esté en uso
- Revisa los logs: `npm run dev` mostrará errores
- Asegúrate de que todas las dependencias estén instaladas: `npm install`

### Docker no conecta a MySQL local

Si usas Docker para la API pero MySQL está en tu máquina local:
- Cambia `DB_HOST=host.docker.internal` en `docker-compose.yml` (Windows/Mac)
- O usa `DB_HOST=172.17.0.1` en Linux

---

## 📝 Notas Adicionales

- Las contraseñas se hashean con `bcryptjs` antes de guardarse
- Los tokens JWT expiran después de 4 horas (configurable en `.env`)
- Las tablas se crean automáticamente al iniciar la API si no existen
- El sistema de recomendaciones usa coincidencias simples entre habilidades y requisitos
- Cada candidato solo puede postularse una vez por oferta

---

## 🤝 Contribuir

Si deseas mejorar esta API, puedes:
1. Agregar más validaciones
2. Implementar un sistema de recomendaciones más avanzado (con IA)
3. Agregar tests automatizados
4. Mejorar la documentación

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y proyectos con impacto social.

---

**¡Listo para usar! 🚀**

Si tienes dudas, revisa la documentación Swagger en `http://localhost:3000/api/docs` o los ejemplos de uso en este README.
