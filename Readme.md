# Zapier-like Automation Platform

This project is a Zapier-like automation platform built with Node.js, Express, TypeScript, and PostgreSQL. It follows a microservice architecture to handle different aspects of the automation workflow.

## Architecture

The project consists of four main services:

1.  **Primary Backend** - Main API service for user-facing interactions
2.  **Hooks** - Service for receiving webhook events from external services
3.  **Processor** - Service for processing events from hooks and sending them to the worker
4.  **Worker** - Service that executes the actual automation tasks
5.  **Frontend** - Next.js web application for the user interface


## Data Flow

1.  External services send events to the **Hooks** service.
2.  **Hooks** service stores the events in the database.
3.  **Processor** polls the database for new events and sends them to Kafka.
4.  **Worker** consumes messages from Kafka and executes the corresponding actions.

## Technologies

-   **Frontend**: Next.js, React, TailwindCSS
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
    docker run -d -p 9092:9092 --name kafka apache/kafka:latest

    # create topic in kafka
    docker exec -it <kafka-container-id> /bin/bash

    ./kafka-topics.sh --create --topic <your-topic-name> --bootstrap-server localhost:9092
    
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



## 🔑 Key Features

-  User authentication and management  
-  Custom workflow creation with trigger and action selection  
-  Integration with various external services  
-  Real-time workflow execution  
-  Webhook support for triggering workflows  
-  Transaction support for reliable processing  

---

## API Documentation

### User Endpoints

- `POST /api/v1/user/signup` – Register a new user  
- `POST /api/v1/user/signin` – Login a user  
- `GET /api/v1/user/user` – Get current user information (authenticated)  

### Zap Endpoints

- `POST /api/v1/zap` – Create a new automation  
- `GET /api/v1/zap` – List user automations  
- `GET /api/v1/zap/:id` – Get automation details  

### Webhook Endpoints

- `POST /hooks/catch/:hookId/:zapId` – Endpoint for receiving webhook events  

---

## Core Concepts

- **Zap**: An automation workflow consisting of a trigger and one or more actions  
- **Trigger**: An event that starts a Zap (e.g., a webhook call)  
- **Action**: A task that is executed as part of a Zap  
- **ZapRun**: A record of an execution of a Zap  
- **Outbox Pattern**: Used for reliable event processing between services  



## Happy Automating!