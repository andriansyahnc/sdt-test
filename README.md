# User Wishes Service

A Node.js TypeScript service for managing users and sending personalized wishes. Currently supports happy birthday wishes.

## Installation

```bash
npm install
```

or with pnpm:

```bash
pnpm install
```

## Development

Run in development mode with hot-reload:

```bash
npm run dev
```

## Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

## Run Production

```bash
npm start
```

## Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Features

- Create and Delete users
- Send scheduled wishes (supported only birthday wishes)

## Cronjob usecases
- Load 100 pending wish data that less / same with today's time.
- if not exists
    - exit
- if exists
    - loop data
        - if time is not good?
            - schedule retry in the next 9 am user local time
        - else
            - update wish log status to sent
            - sent the message / hit endpoint
            -  if endpoint return error
                - set status as failed
            - else 
                - schedule next wish for next year