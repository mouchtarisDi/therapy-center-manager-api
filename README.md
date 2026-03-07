# Therapy Center Manager API

A backend API for managing therapy / student centers, built with FastAPI and PostgreSQL.

This project was designed as a real-world style backend system for handling:
- authentication and authorization
- multi-center access
- student profiles
- session scheduling
- payment tracking
- search and filtering

## Features

- JWT authentication
- Role-based access control (OWNER / ADMIN / STAFF)
- Multi-center architecture using memberships
- Student management with extended profile fields
- Session scheduling with overlap/conflict detection
- Therapist availability checks
- Payment tracking
- Search and filtering for students, sessions, and payments
- PostgreSQL with Docker
- Layered backend architecture (routes / deps / services / models)

## Tech Stack

- FastAPI
- Python
- PostgreSQL
- SQLAlchemy
- Pydantic
- Docker
- JWT / Passlib

## Project Structure

```text
app/
  api/
    routes/
    deps.py
    router.py
  core/
    config.py
    jwt.py
    security.py
  db/
    base.py
    models.py
    session.py
  models/
  schemas/
  services/
  main.py
