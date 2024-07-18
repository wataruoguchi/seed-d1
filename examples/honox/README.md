# seed-d1 usage example

Demonstrates how to use `seed-d1` with `drizzle-orm`.

## Preparation

```sh
npx wrangler d1 create d1-example # d1-example is the name of your database
# Update your wrangler.toml. Please see wrangler.example.toml
# Update your .env for `drizzle.config.ts`. Please see .env.example
npm run d1:exec -- --local --file="./drizzle/0000_high_doctor_octopus.sql"
npm run dev # You should see "No users found"
npm run seed # This uses `seed-d1`. It generates SQL queries and execute them with wrangler.
# Refresh your browser. You should see users.
```

## Usage

Please see `./dev-utils/seed.ts`.

## Tech Stack

- drizzle-orm
- wrangler
- hono
- honox
- faker
- vite
- typescript
