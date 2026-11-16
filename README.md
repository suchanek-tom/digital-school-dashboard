# Digital School Dashboard

A school team project for managing and displaying information. The project contains two frontend applications in npm workspaces and a Spring Boot backend foundation.

## Project structure

```text
digital-school-dashboard/
├── backend/                         # Spring Boot backend (Maven, Java 25)
│   ├── .mvn/                         # Maven Wrapper configuration
│   ├── Dockerfile.dev                # Development backend image
│   ├── mvnw                          # Maven Wrapper for macOS/Linux
│   ├── pom.xml                       # Maven dependencies and build configuration
│   └── src/
│       ├── main/                     # Backend application and configuration
│       └── test/                     # Backend tests
├── .env.example                      # Development Compose configuration template
├── docker-compose.dev.yml            # Development services
├── frontend/
│   └── packages/
│       ├── Dockerfile.dev            # Development frontend image
│       ├── admin-panel/              # React administration application
│       ├── display-client/           # React client for a school display/kiosk
│       ├── package-lock.json
│       └── package.json              # npm workspaces
└── README.md
```

The frontend applications use React, TypeScript, and Vite. The backend is based on Spring Boot and includes dependencies for JPA, Spring Security, WebClient, and WebSocket.

## Requirements

- Docker and Docker Compose for containerized development
- Node.js 22.12 or later and npm for running the frontend locally
- JDK 25 for running the backend locally or compiling it for Docker hot reload

## Docker development

From the repository root, copy the Compose configuration template:

```sh
cp .env.example .env
```

Edit `.env` and set these values:

| Variable | Development configuration |
| --- | --- |
| `DB_URL` | `jdbc:postgresql://db:5432/digital_dashboard` (use the Compose service name, not `localhost`) |
| `DB_USERNAME`, `DB_PASSWORD` | Choose credentials for the PostgreSQL container and backend. |
| `DB_PORT` | `5432`; Compose publishes PostgreSQL on host port 5432. |
| `JWT_SECRET_KEY` | Generate a unique key with `openssl rand -base64 32`. |
| `JWT_EXPIRATION`, `JWT_REFRESH_EXPIRATION` | Set token lifetimes in seconds, as indicated in the template. |
| `CORS_ALLOWED_ORIGINS` | For example, `http://localhost:3000,http://localhost:3001`. |
| `COMPOSE_FILE` | `docker-compose.dev.yml`, as set in the template. |

Do not commit `.env` or other files containing credentials. The backend mounts `backend/lombok.config`; create that file if it is missing, for example with `touch backend/lombok.config`.

Build and start all services:

```sh
docker compose -f docker-compose.dev.yml up --build
```

| Service | Host address |
| --- | --- |
| Admin panel | http://localhost:3000 |
| Display client | http://localhost:3001 |
| Backend | http://localhost:8081 |
| PostgreSQL 18.6 | localhost:5432 |

Stop the services with Ctrl+C, or run `docker compose -f docker-compose.dev.yml down` from another terminal. The database is stored in a named volume and persists when containers are removed. Existing PostgreSQL data from an older major version requires a proper backup and upgrade before use with PostgreSQL 18.

PostgreSQL initializes its database and credentials only when the data volume is first created. Changing `DB_USERNAME` or `DB_PASSWORD` later does not update an existing database.

The frontend source files, HTML, Vite configuration and TypeScript configuration are bind-mounted for Vite hot reload. Changes to package dependencies require an image rebuild. The frontend image regenerates its lockfile during the build to obtain Linux native dependencies, so resolved versions may differ from the repository lockfile.

The backend uses Spring Boot DevTools and watches the bind-mounted `backend/target/classes` directory. Java source changes must first be compiled into that directory by your IDE or Maven; merely saving source files does not trigger a restart. Changes to dependencies in `pom.xml` may require restarting or rebuilding the backend container.

## Local backend configuration

For running the backend outside Docker, create a local dev profile:

```sh
cp backend/src/main/resources/application-dev.properties.example backend/src/main/resources/application-dev.properties
```

Edit the copied file. Set `spring.datasource.url` to `jdbc:postgresql://localhost:5432/digital_dashboard` when connecting to the Compose database, set `spring.datasource.username` and `spring.datasource.password` to the same database credentials as `.env`, and set `server.port=8081`. The `db` hostname used inside Compose is not available to the backend running directly on the host.

The example's `JWT_SECRET_KEY`, `JWT_EXPIRATION`, and `JWT_REFRESH_EXPIRATION` entries are not mapped to the application's JWT properties in this file. Replace them with `application.security.jwt.secret-key`, `application.security.jwt.expiration`, and `application.security.jwt.refresh-token.expiration`, respectively, and provide appropriate values. Generate a unique secret with `openssl rand -base64 32`. Set `application.cors.allowed-origins` to the frontend origins you use, and leave `app.docker-profile=none`. The local properties file is ignored by Git; do not commit credentials.

You can start only the database with `docker compose -f docker-compose.dev.yml up -d db`. Then run the backend from `backend/` with Spring Boot's Docker Compose integration disabled, since the database is already managed separately:

```sh
SPRING_DOCKER_COMPOSE_ENABLED=false ./mvnw spring-boot:run
```

The default Spring profile is `dev`. Compose instead activates the `docker` profile and uses `.env`; it does not use `application-dev.properties`.

## Frontend

Install dependencies from the frontend workspace root:

```sh
cd frontend/packages
npm ci
```

The checked-in lockfile currently lacks some platform-specific native dependencies. If local Vite fails with a missing native binding, the lockfile needs to be regenerated for the local platform; the Docker image handles this separately.

Start the application you need:

```sh
npm run dev --workspace=admin-panel
```

```sh
npm run dev --workspace=display-client
```

Vite prints the development server URL in the terminal. The applications can be started in separate terminals.

Lint and build both workspaces for production:

```sh
npm run lint --workspaces
npm run build --workspaces
```

## Backend

The backend is a Spring Boot Maven project. Run the following commands from the `backend` directory to test and package it:

```sh
./mvnw test
./mvnw package
```

The project requires JDK 25, as specified in `pom.xml`.

## Current Status

- `admin-panel` and `display-client` are scaffolded applications; their current contents are still default placeholders.
- The backend has a Spring Boot foundation, development database configuration, and a basic application context test.
- The npm workspace packages do not currently define test scripts.
