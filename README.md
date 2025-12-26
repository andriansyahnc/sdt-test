# User Wishes Service

A Node.js TypeScript service for managing users and sending personalized wishes. Currently supports happy birthday wishes.

## Installation

```bash
pnpm install
```

## Development

Run in development mode with hot-reload:

```bash
pnpm run dev
```

## Build

Compile TypeScript to JavaScript:

```bash
pnpm run build
```

## Run Production

```bash
pnpm start
```

## Testing

Run all tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm run test:watch
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

## Notable decision.
- no create pending wish done in the creation
- after cronjob, no pending wish creation
- the wish creation should be pick within the missing wish job (separation of concern)
- the retry for the invalid window, will scheduled for next 9 am
- the retry for the not working endpoint, will scheduled for next 1 hours (can be updated based on env)