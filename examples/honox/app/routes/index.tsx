import { drizzle } from "drizzle-orm/d1";
import { css } from "hono/css";
import { createRoute } from "honox/factory";
import { users } from "../schema";

const className = css`
  font-family: sans-serif;
`;

export default createRoute(async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(users).all();
  return c.render(
    <div class={className}>
      <h1>Users</h1>
      {result.length > 0 ? (
        <ul>
          {result.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </div>,
    {
      title: "Honox x Drizzle ORM",
    },
  );
});
