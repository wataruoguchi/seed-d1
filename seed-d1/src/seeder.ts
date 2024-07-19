import { GetQuery, queryGenerator } from "./query-generator.ts";

/**
 *
 * @param sqlDistPath - The path to the generated SQL file.
 * @param getQueries - An array of callbacks. Each callback should return `sql` and `params`.
 * @param callback - A callback function to execute after the SQL queries are executed.
 * @returns
 */
export async function seeder(
  sqlDistPath: string,
  getQueries: GetQuery[],
  callback: () => Promise<void>,
): Promise<void> {
  console.log("🌱 Seeding...");

  const seededMessage = `🌱 Database has been seeded`;
  console.time(seededMessage);
  return queryGenerator(sqlDistPath, getQueries)
    .then(() => callback())
    .then(() => {
      console.timeEnd(seededMessage);
    });
}
