# Digital School Dashboard

A school team project for managing and displaying information. The project contains two frontend applications in npm workspaces and a Spring Boot backend foundation.

## Project structure

```text
digital-school-dashboard/
├── backend/                         # Spring Boot backend (Maven, Java 25)
│   ├── .mvn/                         # Maven Wrapper configuration
│   ├── compose.yaml                  # Empty Docker Compose configuration for now
│   ├── mvnw                          # Maven Wrapper for macOS/Linux
│   ├── pom.xml                       # Maven dependencies and build configuration
│   └── src/
│       ├── main/                     # Backend application and configuration
│       └── test/                     # Backend tests
├── docker-compose.yml                # TODO: configure startup of the full platform
├── frontend/
│   └── packages/
│       ├── admin-panel/              # React administration application
│       ├── display-client/           # React client for a school display/kiosk
│       ├── package-lock.json
│       └── package.json              # npm workspaces
└── README.md
```

The frontend applications use React, TypeScript, and Vite. The backend is based on Spring Boot and includes dependencies for JPA, Spring Security, WebClient, and WebSocket.

## Requierements

- Node.js 22.12 or later and npm
- JDK 25 for the backend
- Docker Compose for running the full platform in the future

## Frontend

Install dependencies from the frontend workspace root:

```sh
cd frontend/packages
npm ci
```

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

The project requires JDK 25, as specified in `pom.xml`. The application currently contains only the basic Spring Boot entry point; the API and database configuration will be added later.

## Docker and Database

Docker Compose is not yet configured to start the full platform: the root `docker-compose.yml` contains a TODO, and `backend/compose.yaml` does not define any services yet. The backend service and PostgreSQL will be added as the backend is developed. Database files and data are not stored in the repository.

## Current Status

- `admin-panel` and `display-client` are scaffolded applications; their current contents are still default placeholders.
- The backend has a Spring Boot foundation and a basic application context test, but no application API or database configuration yet.
- The npm workspace packages do not currently define test scripts.
