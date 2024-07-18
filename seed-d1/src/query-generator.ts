import { type D1Database } from "@cloudflare/workers-types";
import { Log, LogLevel, Miniflare } from "miniflare";
import fs from "node:fs";

export type GetQuery = (d1: D1Database) => { sql: string; params: unknown[] };
export async function queryGenerator(
  distPath: string,
  getQueries: GetQuery[],
): Promise<void> {
  const D1DatabaseId =
    "Any id is fine, because we just want the D1 instance for building queries.";
  return getD1(D1DatabaseId, async (d1) => {
    fs.writeFileSync(distPath, "");
    getQueries.forEach((getQuery) => {
      fs.appendFileSync(distPath, `${replacePlaceholders(getQuery(d1))};\n`);
    });
  });
}

async function getD1(
  databaseId: string,
  seeding: (d1: D1Database) => Promise<void>,
): Promise<void> {
  const nullScript =
    "export default {fetch: () => new Response(null, {status:404})};";
  const mf = new Miniflare({
    modules: true,
    script: nullScript,
    d1Databases: { DB: databaseId },
    log: new Log(LogLevel.INFO),
  });
  return mf
    .getD1Database("DB")
    .then(seeding)
    .finally(() => mf.dispose());
}

type BindingValueType = number | string | null | boolean | Date | unknown;
type Props = {
  sql: string;
  params: BindingValueType[];
};
function replacePlaceholders(props: Props): string {
  const { sql, params } = props;
  let index = -1;
  return sql.replace(/\?/g, () => {
    if (index >= params.length) {
      throw new Error(
        `Not enough binding variables provided: ${index}, ${params.length}`,
      );
    }
    index++;
    return escapeValue(params[index]);
  });
}

/**
 * For SQLite
 */
function escapeValue(value: BindingValueType): string {
  if (value === null) {
    return "NULL";
  } else if (typeof value === "number") {
    return value.toString();
  } else if (typeof value === "boolean") {
    return value ? "1" : "0";
  } else if (value instanceof Date) {
    return `'${value.toISOString()}'`;
  } else if (typeof value === "string") {
    return `'${value.replace(/'/g, "''")}'`;
  } else {
    // This is a catch-all for any other type.
    console.warn("Unsupported binding type:", typeof value, value);
    return `'${value}'`;
  }
}
