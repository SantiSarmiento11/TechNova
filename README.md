# TechNova - Sistema Integral de Mesa de Ayuda y Gestion de Tickets Empresariales

Plataforma corporativa de nivel empresarial para la recepcion, clasificacion, resolucion y auditoria de tickets de soporte tecnico y servicios de tecnologia.

[![Dominio](https://img.shields.io/badge/Dominio-Mesa%20de%20Ayuda%20Enterprise-0052CC.svg)]()
[![Java](https://img.shields.io/badge/Java-21-ED8B00.svg)]()
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.1-6DB33F.svg)]()
[![Seguridad](https://img.shields.io/badge/Seguridad-JWT%20%26%20RBAC-6DB33F.svg)]()
[![Base de Datos](https://img.shields.io/badge/Base%20de%20Datos-MySQL-4479A1.svg)]()

## Resumen Ejecutivo

En entornos corporativos medianos y grandes, la falta de trazabilidad en solicitudes de soporte ocasiona incumplimientos de acuerdos de nivel de servicio (SLA), duplicidad de esfuerzos y perdida de visibilidad sobre problemas recurrentes en infraestructura. TechNova proporciona una solucion centralizada y escalable construida sobre Spring Boot 4 y MySQL, permitiendo a las organizaciones canalizar solicitudes, asignar prioridades dinamicas y emitir reportes de desempeno de equipos de soporte.

## Alcance y Objetivos de Negocio

- Registro y ciclo de vida de tickets de soporte (Abierto, Asignado, En Analisis, En Espera de Proveedor, Resuelto, Cerrado).
- Gestion de acuerdos de nivel de servicio (SLA) categorizados por impacto y urgencia.
- Seguridad perimetral robusta con autenticacion JWT y control de acceso basado en roles (Admin, Agente Tecnico, Empleado Solicitante).
- Generacion de metricas operativas, tiempos de primera respuesta y resolucion en modulo de reportes analiticos.
- Documentacion y pruebas estandarizadas de endpoints mediante archivos `.http` y Swagger UI.

## Arquitectura del Sistema

TechNova esta disenado bajo los principios de la Arquitectura Limpia y el patron por Capas de Spring Boot:
1. Capa de Controladores REST (`project/src/.../controller`):
   Expone contratos HTTP, valida datos de entrada con Bean Validation (`@Valid`) y gestiona codigos de estado.
2. Capa de Seguridad y Filtros (`security/`):
   Intercepta cabeceras `Authorization: Bearer <token>`, valida firmas JWT y establece el contexto de seguridad.
3. Capa de Servicios de Negocio (`service/`):
   Implementa la logica transaccional (`@Transactional`), control de SLAs y reglas de transicion de estados.
4. Capa de Repositorios y Persistencia (`repository/`):
   Abstraccion JPA / Hibernate conectada a motor relacional MySQL.
5. Capa Frontend Desacoplada (`frontend/`):
   Interfaz moderna SPA en JavaScript, HTML5 y CSS estructurado por componentes.

### Diagrama de Flujo Arquitectonico

```mermaid
flowchart TD
    A[Usuario / Solicitante / Agente] -->|Peticion HTTP| B[Frontend SPA TechNova]
    B -->|REST JSON + JWT Bearer| C[Spring Boot REST Controller]
    C --> D[JwtAuthenticationFilter / SecurityContext]
    D --> E[Capa de Servicios de Negocio Service Layer]
    E --> F[Validador de Reglas de Transicion de Ticket]
    E -->|Spring Data JPA / Hibernate| G[(Base de Datos MySQL)]
    E --> H[Modulo Analitico de Reportes y SLAs]
    C --> I[SpringDoc OpenAPI / Swagger UI]
    G --> E
    E --> C
    C --> B
```

### Estructura de Directorios

```text
TechNova/
├── .env.example             # Ejemplo de configuracion de base de datos y llaves JWT
├── .gitignore               # Reglas de exclusion de artefactos de compilacion
├── auth-tests.http          # Suite de pruebas HTTP para VS Code REST Client
├── ERS TechNova.md          # Especificacion de Requerimientos de Software formal
├── README.md                # Documentacion tecnica de ingenieria del proyecto
├── frontend/                # Aplicacion de interfaz de usuario desacoplada
│   ├── index.html           # Vista principal y acceso a la plataforma
│   ├── dashboard.html       # Centro de control con metricas e indicadores globales
│   ├── tickets.html         # Bandeja de entrada y gestion tabular de solicitudes
│   ├── ticket-detail.html   # Vista individual de conversacion, adjuntos y cambios de estado
│   ├── reportes.html        # Tableros estadisticos y metricas operativas
│   ├── tests.html           # Interfaz para ejecucion de validaciones en navegador
│   ├── css/                 # Estilos estructurados (base, componentes, layout, paginas)
│   └── js/                  # Modulos JavaScript del cliente (api.js, app.js)
└── project/                 # Modulo Backend Spring Boot en Java
    ├── build.gradle         # Manifiesto de dependencias Gradle y plugins
    ├── gradlew / gradlew.bat# Wrappers de construccion Gradle
    └── src/main/java/...    # Controladores, servicios, modelos y seguridad
```

## Stack Tecnologico

Ecosistema de tecnologias enterprise con soporte a largo plazo (LTS) y maximas garantias de seguridad.

### Backend y Persistencia Relacional

- ![Java](https://img.shields.io/badge/Java_21_LTS-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white) Entorno tipado seguro con caracteristicas modernas del lenguaje.
- ![Spring Boot](https://img.shields.io/badge/Spring_Boot_4.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white) Framework lider en desarrollo de servicios micro y macroempresariales.
- ![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white) Control perimetral de sesiones y autorizacion granular por metodo.
- ![JWT](https://img.shields.io/badge/JSON_Web_Tokens-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) Manejo sin estado de autorizaciones mediante JJWT 0.12.6.
- ![Gradle](https://img.shields.io/badge/Gradle_Build-02303A?style=for-the-badge&logo=gradle&logoColor=white) Construccion declarativa y optimizacion de paquetes jar.
- ![MySQL](https://img.shields.io/badge/MySQL_8-4479A1?style=for-the-badge&logo=mysql&logoColor=white) Motor relacional transaccional cumpliendo estandares ACID.
- ![Swagger](https://img.shields.io/badge/Swagger_OpenAPI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) Documentacion interactiva de contratos REST.

### Frontend y Experiencia de Usuario

- ![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) Cliente REST asincrono estructurado.
- ![HTML5](https://img.shields.io/badge/HTML5_Enterprise-E34F26?style=for-the-badge&logo=html5&logoColor=white) Plantillas semanticas con diseno centrado en productividad.
- ![CSS3](https://img.shields.io/badge/CSS3_Modular-1572B6?style=for-the-badge&logo=css3&logoColor=white) Estilos arquitecturados en capas (Base, Componentes, Layout y Paginas).

### Herramientas de Desarrollo y Calidad

- **Project Lombok**: Reduccion de codigo repetitivo (boilerplate) mediante anotaciones Java (`@Data`, `@Builder`, `@RequiredArgsConstructor`).
- **REST Client (`auth-tests.http`)**: Coleccion interactiva de pruebas de integracion listas para ejecutarse sin requerir herramientas pesadas como Postman.

## Requisitos Previos del Sistema

- Java JDK: Version 21 instalada y activa en variables de entorno.
- Base de Datos: Servidor MySQL 8.0 o superior (puerto local 3306).
- Memoria RAM: Minimo 4 GB disponibles para la JVM y el demonio de base de datos.
- Navegador web moderno con soporte para CSS Grid y Fetch API.

### Variables de Entorno y Parametros de Conexion

Configurar el archivo `.env` o las propiedades de aplicacion en `application.properties`:

| Variable | Descripcion | Valor Predeterminado |
| :--- | :--- | :--- |
| `SERVER_PORT` | Puerto de escucha HTTP del backend | `8080` |
| `SPRING_DATASOURCE_URL` | Cadena JDBC de conexion | `jdbc:mysql://localhost:3306/technova_db?useSSL=false&serverTimezone=UTC` |
| `SPRING_DATASOURCE_USERNAME` | Usuario de base de datos | `root` |
| `SPRING_DATASOURCE_PASSWORD` | Contrasena de acceso a MySQL | `rootpassword` |
| `JWT_SECRET` | Clave criptografica HMAC-SHA256 | Cadena Base64 de minimo 256 bits |
| `JWT_EXPIRATION_MS` | Validez del token en milisegundos | `86400000` (24 horas) |
