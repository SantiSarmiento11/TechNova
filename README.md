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

---

## ⚙️ 8. Variables de Entorno y Configuración Local

Para ejecutar el microservicio localmente sin comprometer credenciales en Git:

1. **Crear archivo `.env`** en la raíz del repositorio basándose en `.env.example`:
   ```bash
   SERVER_PORT=8080
   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/TechNovaTest
   SPRING_DATASOURCE_USERNAME=admin
   SPRING_DATASOURCE_PASSWORD=admin123
   JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
   JWT_EXPIRATION_MS=86400000
   ```
2. **Crear archivo `application.yaml`** en `project/src/main/resources/` basándose en `application.example.yaml`. Ambos archivos están protegidos contra commits mediante `.gitignore`.

---

## 🧪 9. Verificación, Pruebas y Swagger UI

### Pruebas Automatizadas con Gradle
Para compilar y ejecutar las pruebas unitarias y de integración de la capa de autenticación:
```powershell
cd project
.\gradlew.bat test --tests "tech.com.project.AuthControllerTest"
```
La suite `AuthControllerTest` valida:
- Autenticación exitosa con credenciales válidas y generación de JWT válido.
- Rechazo de credenciales inválidas (401 Unauthorized).
- Acceso denegado a endpoints protegidos sin token.
- Control de acceso basado en roles (ADMIN vs TECHNICIAN vs USER) sobre `/api/auth-demo/*`.

### Pruebas Manuales con REST Client / HTTP
El archivo `auth-tests.http` contiene las peticiones HTTP listas para ejecutar desde Visual Studio Code (extensión REST Client) o IntelliJ IDEA HTTP Client:
- Login como Administrador (`admin@technova.com`).
- Login como Técnico (`tecnico@technova.com`).
- Login como Usuario final (`usuario@technova.com`).
- Pruebas de consumo de endpoints protegidos con token Bearer.

### Documentación Interactiva (Swagger UI)
Con el backend en ejecución, la documentación de la API y especificación OpenAPI 3 se encuentra disponible en:
- **Swagger UI:** `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI JSON:** `http://localhost:8080/v3/api-docs`

---

## 🗂️ 10. Catálogos Operativos y Matriz SLA

La plataforma expone endpoints para consultar los catálogos maestros requeridos durante el registro y asignación de incidentes:

- `GET /api/categories`: Lista de categorías activas (`HARDWARE`, `SOFTWARE`, `RED`, `ACCESO`).
- `GET /api/priorities`: Catálogo de prioridades con tiempos de respuesta SLA:
  - **ALTA:** Tiempo máximo de resolución: **2 horas**.
  - **MEDIA:** Tiempo máximo de resolución: **8 horas**.
  - **BAJA:** Tiempo máximo de resolución: **24 horas**.
- `GET /api/users/technicians`: Lista de especialistas con rol `TECHNICIAN` disponibles para asignación (restringido a usuarios autenticados con rol `ADMIN`).

---

## 🔄 11. Máquina de Estados y Ciclo de Vida de Tickets

El flujo de vida de un ticket está regido por una máquina de estados finita con validación programática estricta en backend (`TicketStateMachineService`), garantizando las reglas de negocio **RN-01** y **RN-02**:

```
[ABIERTA] --(Asignación manual por ADMIN)--> [ASIGNADA]
    │
    └──>(Inicio de labores por TECHNICIAN)--> [EN_PROCESO]
            │
            └──>(Solución por TECHNICIAN)--> [RESUELTA]
                    │
                    └──>(Conformidad USER / Cierre ADMIN)--> [CERRADA]
```

### Tabla de Transiciones Permitidas:

| Estado Origen | Estado Destino | Rol Autorizado | Acción / Evento |
| :--- | :--- | :--- | :--- |
| *(Creación)* | `ABIERTA` | `USER` / `ADMIN` | Registro inicial del incidente. |
| `ABIERTA` | `ASIGNADA` | `ADMIN` | Asignación manual de especialista técnico. |
| `ASIGNADA` | `EN_PROCESO` | `TECHNICIAN` (Asignado) / `ADMIN` | Inicio formal del trabajo de diagnóstico o soporte. |
| `EN_PROCESO` | `RESUELTA` | `TECHNICIAN` (Asignado) / `ADMIN` | Registro de solución técnica aplicada. |
| `RESUELTA` | `CERRADA` | `USER` (Solicitante) / `ADMIN` | Conformidad del usuario final con el servicio. |

Cualquier transición no listada arroja una excepción `InvalidStatusTransitionException` retornando HTTP 400 Bad Request.

---

## 🎫 12. Endpoints de Gestión Core de Tickets (RF-02, RF-03, RF-04)

- `POST /api/tickets`: Creación de solicitudes de soporte (`USER`, `ADMIN`). Recibe título, descripción, `categoryId` y `priorityId`.
- `GET /api/tickets`: Listado paginado y con filtros dinámicos (categoría, prioridad, estado, fechas, búsqueda).
  - Los usuarios con rol `USER` solo pueden visualizar sus tickets propios.
  - Los usuarios `TECHNICIAN` visualizan tickets asignados a su persona o en cola.
  - Los usuarios `ADMIN` visualizan la totalidad de solicitudes.
- `GET /api/tickets/{id}`: Obtener el detalle completo del incidente con asignación y marcas de tiempo.
- `PUT /api/tickets/{id}/assign`: Asignación manual de técnico a un ticket (`ADMIN` únicamente). Transiciona el estado a `ASIGNADA`.
- `PUT /api/tickets/{id}/status`: Actualización programática del estado validada por la máquina de estados.
- `GET /api/tickets/{id}/history`: Historial inmutable de auditoría con la línea de tiempo de cambios de estado y usuario autor.

---

## 💬 13. Comentarios Colaborativos e Interacción Técnica (RF-05)

La plataforma facilita la comunicación bidireccional entre el solicitante y el equipo técnico:

- `POST /api/tickets/{id}/comments`: Publicar un comentario en un ticket abierto o en atención.
  - Valida que el autor sea el solicitante (`USER`), el técnico asignado (`TECHNICIAN`) o un `ADMIN`.
  - Impide comentarios una vez que el ticket se encuentra en estado `CERRADA`.
- `GET /api/tickets/{id}/comments`: Recuperar el hilo cronológico de comentarios asociados al ticket con marcas de tiempo y datos del autor.

---

## 📊 14. Panel de Control Analítico de Administración (RF-07)

El endpoint administrativo centraliza los indicadores clave de rendimiento (KPIs) para la gerencia de TI:

- `GET /api/admin/dashboard`: Retorna métricas globales consolidadas:
  - **Métricas por Estado:** Conteo de tickets clasificados por cada estado del ciclo de vida.
  - **Distribución por Prioridad:** Porcentaje y volumen de incidencias agrupadas por `ALTA`, `MEDIA` y `BAJA`.
  - **Distribución por Categoría:** Desglose temático de fallas operativas reportadas.
  - **Carga de Trabajo por Técnico:** Distribución de tickets activos por cada especialista asignado.
  - **Tiempos Promedio de Resolución:** Medición en horas del tiempo promedio transcurrido desde la creación hasta el estado `RESUELTA`.

---

## 🧪 15. Suites de Pruebas Integradas (Tickets, Auditoría y Dashboard)

Para ejecutar la totalidad de pruebas automatizadas del módulo de tickets y analíticas:
```powershell
cd project
# Ejecutar pruebas completas de tickets
.\gradlew.bat test --tests "tech.com.project.TicketControllerTest"
# Ejecutar pruebas de comentarios y validaciones
.\gradlew.bat test --tests "tech.com.project.CommentControllerTest"
# Ejecutar pruebas de filtros multicriterio y trazabilidad histórica
.\gradlew.bat test --tests "tech.com.project.TicketFilterAndHistoryTest"
# Ejecutar pruebas del panel analítico administrativo
.\gradlew.bat test --tests "tech.com.project.AdminDashboardControllerTest"
```
Todas las suites ejecutan pruebas end-to-end con `MockMvc` simulando usuarios autenticados mediante tokens JWT y verificando códigos HTTP, serialización de DTOs y validaciones de integridad de base de datos.

---

## 🎨 16. Frontend SPA — Arquitectura y Sistema de Diseño

La interfaz de usuario está construida como una **Single Page Application (SPA)** responsiva desarrollada con estándares web nativos sin librerías externas ni empaquetadores complejos:

- **Filosofía Vanilla:** HTML5 semántico, CSS3 moderno y Vanilla JavaScript modular (ES6+ Modules).
- **Sistema de Diseño (`frontend/css/styles.css`):**
  - Paleta de colores institucional basada en tonos esmeralda y cian (`--primary: #1b7f79`, `--teal-dark: #125551`).
  - Variables CSS para consistencia en espaciados, bordes, sombras y tipografía accesible.
  - Componentes reutilizables: botones estilizados, badges de estado del ticket (`badge-abierta`, `badge-asignada`, etc.), tarjetas elevadas, formularios y tablas responsivas con soporte para colapso en pantallas móviles.
- **Configuración de Red (`frontend/js/config.js`):**
  - Define `API_BASE` (`http://localhost:8080`) permitiendo personalización dinámica en tiempo de ejecución mediante la variable global `window.TECHNOVA_API_BASE`.

---

## ⚡ 17. Módulos Cliente y Gestión de Sesión

El frontend se estructura en módulos ES6 independientes con responsabilidades delimitadas:

- **Cliente HTTP (`frontend/js/api.js`):**
  - Wrapper sobre la API estándar `fetch`.
  - Inyecta automáticamente el token de autenticación (`Authorization: Bearer <token>`) en cada petición saliente.
  - Gestión centralizada de errores HTTP y formateo de respuestas JSON.
- **Gestión de Sesión (`frontend/js/session.js`):**
  - Almacena de forma segura el token JWT y el perfil de usuario en `localStorage`.
  - Provee funciones de validación de permisos: `hasRole('ADMIN')`, `can('TICKET_ASSIGN')`, `getUser()`, y `logout()`.
- **Componentes UI Dinámicos (`frontend/js/ui.js`):**
  - Sistema de modales accesibles (`openDialog`, `closeDialog`).
  - Notificaciones emergentes (*toasts*) no intrusivas para retroalimentación operativa.
  - Utilidades de renderizado seguro contra XSS (`escapeHtml`), formateo de fechas y plantillas de formulario.
- **Layout y Shell Global (`frontend/js/layout.js`):**
  - Inyecta dinámicamente la barra de navegación superior y el menú lateral según el rol activo del usuario autenticado.

---

## 🔑 18. Interfaz de Autenticación (`frontend/index.html` y `auth.js`)

- **Pantalla de Inicio de Sesión (`index.html`):**
  - Formulario de credenciales con validación reactiva de formato de correo electrónico y contraseña.
  - Alerta dinámica de expiración de sesión (`?expired=true`).
- **Controlador de Autenticación (`frontend/js/pages/auth.js`):**
  - Consume el endpoint `POST /api/auth/login`.
  - Almacena el token recibido y el objeto de perfil mediante `setSession()`.
  - Redirecciona de forma inteligente según el rol del usuario: administradores a `/admin.html` o `/tickets.html`, y empleados a `/tickets.html`.

---

## 🎫 19. Vistas de Gestión y Detalle de Incidentes

- **Catálogo de Tickets (`frontend/tickets.html` y `tickets.js`):**
  - Panel de filtros dinámicos por estado, prioridad, categoría y búsqueda en tiempo real.
  - Tabla responsiva con paginación interactiva (página actual, total de elementos, selector de tamaño).
  - Modal para registro de nueva solicitud (`Nueva Solicitud de Soporte`) con selector dinámico de categoría y prioridad.
- **Detalle de Incidente (`frontend/ticket-detail.html` y `ticket.js`):**
  - Visualización del solicitante, técnico asignado, nivel de prioridad y estado actual.
  - Botones contextuales según rol para ejecutar transiciones de estado permitidas por la máquina de estados.
  - Hilo de comentarios colaborativos en tiempo real con formulario de nuevo aporte.
  - Línea de tiempo interactiva de auditoría (*Audit Timeline*) mostrando cada cambio de estado, fecha y autor.

---

## 📊 20. Vistas de Administración y Supervisión (`admin.html` y `dashboard.html`)

- **Panel de Administración TI (`admin.html` y `admin.js`):**
  - **Cola de Asignación Manual:** Lista de incidentes en estado `ABIERTA` con selector para asignar un técnico especialista de forma inmediata.
  - **Distribución de Carga Técnica:** Tabla resumen que detalla la cantidad de tickets asignados por cada técnico activo.
- **Dashboard de Métricas Analíticas (`dashboard.html` y `dashboard.js`):**
  - Tarjetas de resumen con indicadores de totales por estado.
  - Gráficos y barras de distribución por categoría y prioridad de incidentes.
  - Métricas de cumplimiento de tiempos de respuesta y tiempos medios de resolución.

---

## 🌐 21. Guía de Ejecución Local del Frontend

Para ejecutar la aplicación cliente e interactuar con el backend:

1. **Asegurar que el backend Spring Boot esté activo:**
   ```powershell
   cd project
   .\gradlew.bat bootRun
   ```
   El backend escuchará en `http://localhost:8080`.

2. **Servir la carpeta `frontend/` mediante cualquier servidor HTTP local:**
   - **Opción A (VS Code Live Server):** Hacer clic derecho sobre `frontend/index.html` y seleccionar *Open with Live Server* (típicamente en puerto 5500).
   - **Opción B (Python):**
     ```powershell
     cd frontend
     python -m http.server 5500
     ```
   - **Opción C (Node.js http-server o npx serve):**
     ```powershell
     npx serve frontend -p 5500
     ```

3. **Acceder a la aplicación:**
   Abrir el navegador web en `http://localhost:5500` para iniciar sesión y gestionar tickets.

---

## 📋 22. Especificación y Cumplimiento de Requisitos ERS

El desarrollo del sistema responde directamente a los requerimientos funcionales aprobados en [ERS TechNova.md](file:///C:/Users/Santiago%20Sarmiento/Desktop/TechNova/ERS%20TechNova.md):

| Código | Requisito Funcional | Implementación Backend | Interfaz Frontend | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **RF-01** | Autenticación y Autorización | `AuthController`, `JwtUtils`, Spring Security | `index.html`, `js/pages/auth.js` | ✅ Conforme |
| **RF-02** | Creación de Tickets | `TicketController.createTicket` | Modal en `tickets.html`, `tickets.js` | ✅ Conforme |
| **RF-03** | Asignación Manual | `TicketController.assignTechnician` | Modal en `ticket-detail.html`, `admin.html` | ✅ Conforme |
| **RF-04** | Ciclo de Vida y Máquina de Estados | `TicketStateMachineService` | Botones contextuales en `ticket-detail.html` | ✅ Conforme |
| **RF-05** | Comentarios e Historial | `CommentController`, `TicketHistory` | Hilo de chat y timeline en `ticket.js` | ✅ Conforme |
| **RF-06** | Notificaciones / Trazabilidad | Registro inmutable de auditoría en BD | Indicadores y estados en interfaz | ✅ Conforme |
| **RF-07** | Dashboard de Administración | `AdminDashboardController` | Panel analítico en `dashboard.html` | ✅ Conforme |
| **RF-08** | Filtros y Búsqueda Avanzada | JPA Criteria en `TicketSpecification` | Barra de filtros en `tickets.html` | ✅ Conforme |

---

## 🛡️ 23. Atributos de Calidad y Requisitos Técnicos (RT-01 a RT-06)

El diseño del sistema cumple con los estándares no funcionales de la ingeniería de software:

- **RT-01 — Rendimiento:** Respuestas rápidas de la API REST optimizadas con `@EntityGraph` para prevenir el problema de consultas $N+1$ en Hibernate.
- **RT-02 — Seguridad:** Arquitectura de autenticación *stateless* basada en tokens JWT con algoritmo criptográfico HS256, contraseñas hasheadas con BCrypt y control estricto de acceso basado en roles (`RBAC`).
- **RT-03 — Disponibilidad:** Gestión eficiente de conexiones a base de datos mediante el pool HikariCP de alto rendimiento.
- **RT-04 — Escalabilidad:** Microservicio modular sin estado de sesión en servidor, preparado para escalado horizontal y empaquetamiento en contenedores Docker.
- **RT-05 — Usabilidad:** Interfaz web SPA intuitiva, adaptada a pantallas móviles y de escritorio, con tiempos de aprendizaje mínimos.
- **RT-06 — Mantenibilidad:** Separación estricta de responsabilidades en capas (Controller $\rightarrow$ Service $\rightarrow$ Repository), uso de DTOs para aislar el modelo de datos de la capa web y manejo global unificado de excepciones (`GlobalExceptionHandler`).

---

## ✅ 24. Checklist de Control de Calidad y Auditoría Pre-Productiva (QA)

Antes de promover los cambios hacia las ramas `develop` y `test`, se realiza la siguiente lista de verificación:

- [x] **Compilación Limpia:** Compilación de código backend sin warnings críticos ni errores de sintaxis (`./gradlew compileJava`).
- [x] **Suites de Pruebas Automatizadas:** 100% de tests unitarios y de integración aprobados en `./gradlew test`.
- [x] **Seguridad de Secretos:** Exclusión total de `.env` y `application.yaml` mediante `.gitignore`.
- [x] **Reglas de Negocio Validadas:** Máquina de estados (RN-02) rechaza transiciones ilegales y la matriz SLA (RN-03) calcula prioridades correctamente.
- [x] **Aislamiento por Rol:** Endpoints protegidos impiden IDOR y respetan la jerarquía ADMIN, TECHNICIAN y USER.
- [x] **Documentación Actualizada:** `README.md` y `ERS TechNova.md` completamente sincronizados con la implementación real del proyecto.















