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
