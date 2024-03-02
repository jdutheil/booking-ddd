## Description

This application helps music artist agencies (alias Booker) to manage their contacts and automate prospection.

It is also a try to apply some of the best software engineering concepts, mainly **DDD** (Domain Driven Design) and **Hexagonal Architecture**. As a senior developer, I am still learning on those patterns, feel free to comment and use Issues / Discussions to talk about it.

This repository contains the backend stuff ; frontend repository is there : https://github.com/jdutheil/booking-front

## Table of contents

- [Description](#description)
- [Table of contents](#table-of-contents)
- [Tech stack](#tech-stack)
- [Context and domain model](#context-and-domain-model)
- [Architecture](#architecture)
  - [Base folders structure](#base-folders-structure)
  - [Configs](#configs)
  - [Infrastructure module](#infrastructure-module)
  - [Libs](#libs)
  - [DDD modules](#ddd-modules)
- [Layers](#layers)
  - [Application layer](#application-layer)
  - [Domain layer](#domain-layer)
  - [Infrastructure layer](#infrastructure-layer)
  - [Presentation layer](#presentation-layer)
- [Concepts](#concepts)
- [Local development](#local-development)
- [Installation](#installation)
- [Running the app](#running-the-app)
- [Tests](#tests)
- [Git](#git)

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

## Links

This repository arised thanks to the wonderful work of other people, mainly :

- Khalil Stemmler, all his articles are gold mine ; I took a lot of inspiration with its project "ddd-forum", here is the link to the repository : https://github.com/stemmlerjs/ddd-forum
- Sairyss and his big implementation of DDD Hexagonal Architecture in NestJs : https://github.com/Sairyss/domain-driven-hexagon

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
