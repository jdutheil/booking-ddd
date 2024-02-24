## Description

This application helps music bookers to manage their contacts and prospection.

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
