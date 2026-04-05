# Task Management System

A full-stack Task Management System built with separate frontend and backend applications.

## Project Structure

```bash
task-management-system/
│── backend/         # API server
│── frontend-web/    # Frontend application
```

---

## Tech Stack

### Frontend

* Next.js / React
* TypeScript
* Zustand (state management)

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* MySQL

---

# Setup Guide

## 1. Clone Repository

```bash
git clone https://github.com/Nazim231/task-management-system.git
cd task-management-system
```

---

# Backend Setup

## Navigate to backend

```bash
cd backend
```

## Install dependencies

```bash
npm install
```

## Environment Variables

Create `.env` file inside `backend/` with same keys present in `backend/.env.example` file and pass the required values
```env
PORT=8000
DATABASE_URL="mysql://username:password@localhost:3306/task_management"
DATABASE_USER="username"
DATABASE_PASSWORD="password"
DATABASE_NAME="task_management"
DATABASE_HOST="localhost"
DATABASE_PORT=3306
```

## Run Prisma Migration

```bash
npx prisma migrate dev --schema src/prisma/schema.prisma --config src/prisma.config.ts
```

## Generate Prisma Client

```bash
npx prisma generate --config src/prisma.config.ts
```

## Start Backend

```bash
npm run dev
```

Backend will run on:

```bash
http://localhost:5000
```

---

# Frontend Setup

## Navigate to frontend

```bash
cd frontend-web
```

## Install dependencies

```bash
npm install
```

## Environment Variables

Create `.env` in `frontend-web/` with same keys present in `frontend-web/.env.example`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Start Frontend

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:3000
```

---

# Database Setup

Make sure MySQL is running locally.

Create database:

```sql
CREATE DATABASE task_management;
```

---

# Available Scripts

## Backend

```bash
npm run dev
npm run build
npm run start
```

## Frontend

```bash
npm run dev
npm run build
npm run start
```

---

# Features

* User Authentication
* Task Creation
* Task Update
* Task Delete
* Search Tasks
* Filter Tasks
* Persistent Auth State

---

# Development Notes

If backend port changes, update frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:YOUR_BACKEND_PORT
```

---

# Author

Nazim Saifi
