# :seedling: seed-d1 :seedling:

Workaround for seeding against local Cloudflare D1 database.
This is a development-only library.

## Problem

When you are developing a Cloudflare Worker application, you want to seed your local D1 database. You could write a raw SQL file and execute it with `wrangler d1 execute`, but it's not convenient. You may want to use an ORM library such as [`drizzle-orm`](https://orm.drizzle.team/) or [`prisma`](https://www.prisma.io/) to write your seeding code.

## Installation

```sh
npm install -D seed-d1
```

## Usage

```ts
// examples/honox/dev-utils/seed.ts
import { drizzle } from "drizzle-orm/d1";
import { execSync } from "node:child_process";
import { seeder } from "seed-d1";
import { insertUserSchema, users } from "../app/schema";
import { mockUsers as _mockUsers } from "./mockUsers";

const databaseName = "d1-example";
const sqlDistPath = "./dev-utils/seed.local.sql";

seeder(
  sqlDistPath,
  /**
   * Below is an array of callbacks. Each callback should return `sql` and `params`.
   * `sql` is a string of SQL queries. `params` is an array of parameters for the SQL queries.
   * Example:
   *   sql: `INSERT INTO users (id, name, email) VALUES (?, ?, ?)`
   *   params: ["7bd84655-cc63-4858-bd59-3a2574086914", "Luke Skywalker", "luke@example.com"]
   */
  [
    // Delete all users
    (d1: D1Database) => drizzle(d1).delete(users).toSQL(),
    // Insert mock users
    (d1: D1Database) => {
      const mockUsers = _mockUsers.map((mockUser) =>
        insertUserSchema.parse(mockUser),
      );
      return drizzle(d1).insert(users).values(mockUsers).toSQL();
    },
  ],
  async () => {
    const command = `npx wrangler d1 execute ${databaseName} --file="${sqlDistPath}"`;
    console.log(command);
    execSync(command, {
      encoding: "utf-8",
    });
  },
);
```