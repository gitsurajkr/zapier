# Zapier Clone

This project is a Zapier-like automation platform built with Node.js, Express, TypeScript, and PostgreSQL. It follows a microservice architecture to handle different aspects of the automation workflow.

## Architecture

The project consists of four main services:

1.  **Primary Backend** - Main API service for user-facing interactions
2.  **Hooks** - Service for receiving webhook events from external services
3.  **Processor** - Service for processing events from hooks and sending them to the worker
4.  **Worker** - Service that executes the actual automation tasks

## Data Flow

1.  External services send events to the **Hooks** service.
2.  **Hooks** service stores the events in the database.
3.  **Processor** polls the database for new events and sends them to Kafka.
4.  **Worker** consumes messages from Kafka and executes the corresponding actions.

## Technologies

-   **Backend**: Node.js, Express, TypeScript
-   **Database**: PostgreSQL
-   **ORM**: Prisma
-   **Message Broker**: Kafka
-   **Containerization**: Docker

## Getting Started

### Prerequisites

-   Node.js (v18+)
-   Docker and Docker Compose
-   pnpm (recommended) or npm

### Setup

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd zapier
    ```

2.  **Setup Docker Services**

    ```bash
    # Start PostgreSQL
    docker run -d -p 5432:5432 --name primary_backend -e POSTGRES_PASSWORD=mysecretpassword postgres

    # Start Kafka (if not already running)
    # Add your kafka setup command here, for example:
    # docker-compose up -d kafka # (if you have a docker-compose.yml for Kafka)
    ```

3.  **Setup each service**

    For each service (`primary-backend`, `hooks`, `processor`, `worker`):

    ```bash
    cd <service-directory>
    pnpm install
    cp .env.example .env  # Create and customize your .env file
    npx prisma migrate dev  # Apply database migrations (if the service uses Prisma)
    pnpm start
    ```

## API Documentation

### User Endpoints (Example - from `primary-backend`)

-   `POST /api/v1/user/signup` - Register a new user
-   `POST /api/v1/user/signin` - Login a user
-   `GET /api/v1/user/user` - Get current user information (authenticated)

### Zap Endpoints (Example - from `primary-backend`)

-   `POST /api/v1/zap` - Create a new automation
-   `GET /api/v1/zap` - List user automations
-   `GET /api/v1/zap/:id` - Get automation details

### Webhook Endpoints (Example - from `hooks`)

-   `POST /hooks/catch/:hookId/:zapId` - Endpoint for receiving webhook events

## Core Concepts

-   **Zap**: An automation workflow consisting of a trigger and one or more actions.
-   **Trigger**: An event that starts a Zap (e.g., a webhook call).
-   **Action**: A task that is executed as part of a Zap.
-   **ZapRun**: A record of an execution of a Zap.
-   **Outbox Pattern**: Used for reliable event processing between services, ensuring messages are eventually delivered even if a service temporarily fails.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License - see the `LICENSE` file for details (if one exists)
