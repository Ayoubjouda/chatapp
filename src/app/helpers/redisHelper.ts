const upstashRedisRestUrl = process.env.REDIS_URL;
const authToken = process.env.REDIS_KEY;
type Command = "zrange" | "sismember" | "smembers" | "get";

export async function fetchRedis(command: Command, ...args: (string | number)[]) {
  const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join("/")}`;
  const Response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });
  if (!Response.ok) throw new Error(`Error executing redis command:${Response.statusText}`);

  const data = await Response.json();
  return data.result;
}
