## Description

This application helps music artist agencies (alias Booker) to manage their contacts and automate prospection.

It is also a try to apply some of the best software engineering concepts, mainly **DDD** (Domain Driven Design) and **Hexagonal Architecture**. As a senior developer, I am still learning on those patterns, feel free to comment and use Issues / Discussions to talk about it.

This repository contains the backend stuff ; frontend repository is there : https://github.com/jddw-dev/booking-front

## Table of contents

1. [Tech stack](#tech-stack)
2. [Context and domain model](#context-and-domain-model)
3. [Architecture](#architecture)
   3.1 [Base folder structure](#base-folders-structure)
   3.2 [configs](#configs)
   3.3 [Infrastructure module](#infrastructure-module)
   3.4 [Libs](#libs)
   3.5 [DDD modules](#ddd-modules)
4. [Layers](#layers)
   4.1 [Application layer](#application-layer)
   4.2 [Domain layer](#domain-layer)
   4.3 [Infrastructure layer](#infrastructure-layer)
   4.4 [Presentation layer](#presentation-layer)
5. [Concepts](#concepts)
6. [Local development](#local-development)
7. [Installation](#installation)
8. [Running the app](#running-the-app)
9. [Tests](#test)
10. [Git](#git)

## Tech stack

- NestJs
- Prisma
- Postgres with Docker
- Oxide.ts
- Passport
- Zod
- Jest
- supertest

## Context and domain model

Work in progress

## Architecture

Work in progress

### Base folders structure

### configs

### Infrastructure module

### Libs

### DDD modules

## Layers

### Application layer

### Domain layer

### Infrastructure layer

### Presentation layer

## Concepts

Work in progress

## Local development

We use Docker containers to manage Postgres instances during development ; one for "live" database, and one for "tests" database.
docker-compose file is located under `docker` folder

## Installation

```bash
$ pnpm install
$ pnpm prisma migrate deploy
```

## Running the app

```bash
# development
$ pnpm start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test:unit:watch

# integration tests
$ pnpm run test:integration:watch

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Git

git-cz is used to format commit messages ; an util script has been added, that add all changed files to git, commit with git-cz and push :

```bash
$ pnpm commit:push
```
