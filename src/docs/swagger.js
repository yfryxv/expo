module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'API Empleos Inclusivos',
    description:
      'API REST para la plataforma de empleos inclusivos donde empresas publican ofertas accesibles para personas con discapacidad.',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor local',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          fullName: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['empresa', 'candidato'] },
          companyName: { type: 'string' },
          profileSummary: { type: 'string' },
          skills: { type: 'array', items: { type: 'string' } },
        },
      },
      Offer: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          companyId: { type: 'integer' },
          title: { type: 'string' },
          description: { type: 'string' },
          location: { type: 'string' },
          salaryRange: { type: 'string' },
          employmentType: { type: 'string' },
          remoteAvailable: { type: 'boolean' },
        },
      },
      Application: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          offerId: { type: 'integer' },
          candidateId: { type: 'integer' },
          coverLetter: { type: 'string' },
          status: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/usuarios/registro': {
      post: {
        summary: 'Registro de usuario',
        tags: ['Usuarios'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullName', 'email', 'password', 'role'],
                properties: {
                  fullName: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                  role: { type: 'string', enum: ['empresa', 'candidato'] },
                  companyName: { type: 'string' },
                  profileSummary: { type: 'string' },
                  skills: { type: 'array', items: { type: 'string' } },
                  accessibilityNeeds: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuario creado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                        token: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/usuarios/login': {
      post: {
        summary: 'Inicio de sesión',
        tags: ['Usuarios'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login correcto',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                        token: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/ofertas': {
      get: {
        summary: 'Listar ofertas activas',
        tags: ['Ofertas'],
        responses: {
          200: {
            description: 'Listado de ofertas',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Offer' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Crear oferta (empresas)',
        security: [{ bearerAuth: [] }],
        tags: ['Ofertas'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'description'],
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  location: { type: 'string' },
                  salaryRange: { type: 'string' },
                  employmentType: { type: 'string' },
                  requirements: { type: 'array', items: { type: 'string' } },
                  accessibilityFeatures: { type: 'array', items: { type: 'string' } },
                  remoteAvailable: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Oferta creada',
          },
        },
      },
    },
    '/ofertas/{id}': {
      get: {
        summary: 'Detalle de oferta',
        tags: ['Ofertas'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: { 200: { description: 'Oferta encontrada' }, 404: { description: 'No encontrada' } },
      },
      put: {
        summary: 'Actualizar oferta (empresas)',
        security: [{ bearerAuth: [] }],
        tags: ['Ofertas'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: { 200: { description: 'Oferta actualizada' } },
      },
      delete: {
        summary: 'Eliminar oferta (empresas)',
        security: [{ bearerAuth: [] }],
        tags: ['Ofertas'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: { 204: { description: 'Oferta eliminada' } },
      },
    },
    '/postulaciones': {
      post: {
        summary: 'Postularse a una oferta (candidatos)',
        security: [{ bearerAuth: [] }],
        tags: ['Postulaciones'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['offerId'],
                properties: {
                  offerId: { type: 'integer' },
                  coverLetter: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Postulación creada' } },
      },
    },
    '/postulaciones/mis': {
      get: {
        summary: 'Mis postulaciones (candidato)',
        security: [{ bearerAuth: [] }],
        tags: ['Postulaciones'],
        responses: { 200: { description: 'Listado de postulaciones' } },
      },
    },
    '/postulaciones/oferta/{offerId}': {
      get: {
        summary: 'Postulantes por oferta (empresa)',
        security: [{ bearerAuth: [] }],
        tags: ['Postulaciones'],
        parameters: [
          { name: 'offerId', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: { 200: { description: 'Listado de candidatos' } },
      },
    },
    '/recomendaciones': {
      get: {
        summary: 'Recomendaciones de ofertas para un candidato',
        security: [{ bearerAuth: [] }],
        tags: ['IA'],
        responses: {
          200: {
            description: 'Listado de ofertas recomendadas',
          },
        },
      },
    },
  },
};


