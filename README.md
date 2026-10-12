# TechNova IT Helpdesk 🚀

Plataforma integral de soporte y gestión de incidencias de Tecnologías de la Información desarrollada para **TechNova Solutions**. El sistema optimiza el registro, categorización, asignación manual y ciclo de vida de tickets de soporte técnico, garantizando el cumplimiento de Acuerdos de Nivel de Servicio (SLA) y la trazabilidad de auditoría.

---

## 📌 1. Visión General y Objetivos

- **Objetivo Central:** Proveer una solución centralizada y segura para la administración de tickets de soporte técnico, erradicando la dispersión de solicitudes por canales no auditables.
- **Roles del Sistema:**
  - `ADMIN`: Gestión operativa total, asignación manual de técnicos a tickets y visualización de analíticas operativas.
  - `TECHNICIAN`: Atención, actualización de estados de incidentes y registro de comentarios de solución.
  - `USER`: Empleados que registran solicitudes de asistencia, agregan comentarios y validan el cierre de sus tickets.
- **Documentación de Requerimientos:** Consulta el documento completo de especificación de requisitos en [ERS TechNova.md](file:///C:/Users/Santiago%20Sarmiento/Desktop/TechNova/ERS%20TechNova.md).

---

## 🛠️ 2. Tecnologías y Frameworks

### Backend
- **Lenguaje:** Java 21 (LTS)
- **Framework Principal:** Spring Boot 3.x / 4.1.1
- **Motor de Construcción:** Gradle 9.7.1
- **Seguridad:** Spring Security 6 & JJWT (Java JWT 0.12.6) con cifrado BCrypt
- **Acceso a Datos:** Spring Data JPA / Hibernate ORM con pool HikariCP
- **Base de Datos:** PostgreSQL 15+
- **Validación:** Jakarta Bean Validation (Hibernate Validator)
- **Documentación de API:** SpringDoc OpenAPI 2.8.5 (Swagger UI)
- **Testing:** JUnit 5, MockMvc, AssertJ

### Frontend (Fase Posterior)
- **Arquitectura:** Single Page Application (SPA)
- **Tecnologías:** HTML5 semántico, CSS3 moderno (Variables CSS, Flexbox, Grid) y Vanilla JavaScript ES6+ puro (sin dependencias ni frameworks pesados).

---

## 📂 3. Estructura de Directorios y Paquetes

El proyecto sigue una arquitectura en capas limpia (*Layered Architecture*) que promueve la separación de responsabilidades y la alta mantenibilidad:

```text
TechNova/
├── .env.example                               # Plantilla de variables de entorno seguras
├── .gitignore                                 # Reglas de exclusión para credenciales y compilados
├── auth-tests.http                            # Pruebas HTTP para el módulo de autenticación
├── ERS TechNova.md                            # Especificación formal de requisitos de software
├── README.md                                  # Documentación principal del proyecto
├── media/                                     # Diagramas y evidencias visuales de configuración
└── project/                                   # Raíz del microservicio backend en Spring Boot
    ├── build.gradle                           # Definición de dependencias y plugins Gradle
    ├── settings.gradle                        # Configuración de proyectos Gradle
    ├── gradlew / gradlew.bat                  # Wrapper portable de Gradle
    └── src/
        ├── main/
        │   ├── java/tech/com/project/
        │   │   ├── ProjectApplication.java    # Clase principal de arranque Spring Boot
        │   │   ├── config/                    # Configuraciones de seguridad, OpenAPI y Seeders
        │   │   ├── controller/                # Controladores REST expuestos
        │   │   ├── dto/                       # Data Transfer Objects (Requests y Responses)
        │   │   ├── exception/                 # Manejo centralizado de excepciones de la API
        │   │   ├── model/                     # Entidades de dominio JPA mapeadas a PostgreSQL
        │   │   ├── repository/                # Interfaces de persistencia Spring Data JPA
        │   │   ├── security/                  # Filtros JWT, UserDetailsService y WebSecurity
        │   │   └── service/                   # Lógica de negocio e interfaces de servicio
        │   │       └── impl/                  # Implementaciones de servicios
        │   └── resources/
        │       ├── application.example.yaml   # Plantilla pública de configuración Spring
        │       └── technova_schema_and_data.sql # DDL y DML de base de datos inicial
        └── test/
            └── java/tech/com/project/         # Pruebas unitarias y de integración
```

---

## 🔀 4. Modelo de Ramas de Git

El ciclo de desarrollo y control de versiones adopta el siguiente flujo estructurado:

```
main  <--  test  <--  develop  <--  Dev(Santiago, Jason, Brayan, Fabio)
```

- **`main`**: Rama de producción con releases estables y verificados.
- **`test`**: Entorno de integración pre-productiva y validación de suites de pruebas automáticas.
- **`develop`**: Rama troncal de integración de desarrollo continuo.
- **Ramas de Especialistas (`Dev*`)**:
  - `DevSantiago`: Estructura base, persistencia JPA, seguridad Spring Security y autenticación JWT.
  - `DevJason`: Dominio de tickets, máquina de estados finita, comentarios, auditoría y panel analítico.
  - `DevBrayan`: Cliente Frontend SPA responsivo en Vanilla JS y consumo de API REST.
  - `DevFabio`: Soporte de requerimientos, documentación y homologación de artefactos.

---

## 🔒 5. Políticas de Seguridad y Manejo de Secretos

> [!IMPORTANT]
> **No subir credenciales ni secretos a Git**:
> - Archivos como `.env` y `application.yaml` que contienen credenciales reales de base de datos o claves JWT **están expresamente ignorados** en `.gitignore`.
> - Se debe utilizar siempre `.env.example` y `application.example.yaml` como referencia para crear las configuraciones locales.

---

## 🏛️ 6. Modelo de Dominio y Persistencia (JPA & PostgreSQL)

El modelo de datos implementa las reglas de negocio descritas en la ERS:

| Entidad JPA | Tabla SQL | Descripción |
| :--- | :--- | :--- |
| `UserAccount` | `user_account` | Usuarios del sistema con credenciales encriptadas en BCrypt. |
| `Role` | `role` | Catálogo de roles de seguridad (`ADMIN`, `TECHNICIAN`, `USER`). |
| `Permission` | `permission` | Permisos atómicos del sistema (`TICKET_READ`, `TICKET_CREATE`, etc.). |
| `UserRole` | `user_role` | Asociación muchos a muchos entre usuarios y roles. |
| `RolePermission` | `role_permission` | Matriz de privilegios otorgados a cada rol. |
| `Category` | `category` | Categorías de soporte técnico (`HARDWARE`, `SOFTWARE`, `RED`, `ACCESO`). |
| `Priority` | `priority` | Prioridades y SLA: `ALTA` (2h), `MEDIA` (8h), `BAJA` (24h). |
| `TicketStatus` | `ticket_status` | Estados del ticket: `ABIERTA`, `ASIGNADA`, `EN_PROCESO`, `RESUELTA`, `CERRADA`. |
| `StatusTransition` | `status_transition` | Matriz permitida de transiciones de estados del ciclo de vida. |
| `Ticket` | `ticket` | Solicitud principal de soporte asociada a solicitante, categoría y prioridad. |
| `TicketAssignment` | `ticket_assignment` | Histórico de asignaciones y reasignaciones de técnicos por el ADMIN. |
| `TicketHistory` | `ticket_history` | Registro inmutable de auditoría de cada cambio de estado. |
| `Comment` | `comment` | Comentarios e intercambios entre usuarios y técnicos en un ticket. |

### Inicialización y Seeding
El sistema cuenta con:
1. `DataInitializer.java`: Componente `CommandLineRunner` que asegura la creación de roles, permisos, categorías, prioridades, transiciones y usuarios predeterminados de prueba si las tablas están vacías.
2. `technova_schema_and_data.sql`: Script DDL/DML para aprovisionamiento manual o en entornos de base de datos PostgreSQL independientes.

---

## 🔐 7. Seguridad, Autenticación y Control de Acceso (JWT & Spring Security)

La capa de seguridad está desacoplada y diseñada bajo una arquitectura stateless basada en tokens:

- **Algoritmo de Firma:** HMAC-SHA256 (HS256) configurado con secreto criptográfico de 256 bits.
- **Expiración de Tokens:** 24 horas (86,400,000 ms) por defecto.
- **Claims del Token:**
  - `sub`: Correo electrónico institucional del usuario autenticado.
  - `userId`: Identificador numérico del usuario en base de datos.
  - `roles`: Colección de roles asignados (`ROLE_ADMIN`, `ROLE_TECHNICIAN`, `ROLE_USER`).
  - `permissions`: Privilegios granulares asociados (`TICKET_READ`, `TICKET_CREATE`, `TICKET_ASSIGN`, etc.).
- **Filtro de Intercepción (`JwtAuthenticationFilter`):**
  - Intercepta cada solicitud HTTP entrante buscando la cabecera `Authorization: Bearer <token>`.
  - Valida la integridad y caducidad mediante `JwtUtils`.
  - Carga los detalles en `UserDetailsServiceImpl` y establece la autenticación en `SecurityContextHolder`.
- **Controladores Expuestos:**
  - `POST /api/auth/login`: Autenticación con email y contraseña, retorna JWT y perfil del usuario.
  - `GET /api/auth/me`: Retorna los datos del usuario autenticado actual.
  - `GET /api/auth-demo/*`: Endpoints de demostración para verificar autorización por rol (`/admin-only`, `/technician-only`, `/user-only`, `/authenticated`).
- **Manejo Centralizado de Excepciones:**
  - Respuestas JSON uniformes (`ApiErrorResponse`) con timestamp, código de estado HTTP, mensaje de error y ruta.


