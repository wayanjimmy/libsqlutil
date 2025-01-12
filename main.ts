import { parseArgs } from "@std/cli";

if (import.meta.main) {
  const baseURL = Deno.env.get("DATABASE_URL") as string;

  const command = Deno.args[0];
  switch (command) {
    case "namespace": {
      const flags = parseArgs(Deno.args.slice(1), {
        string: ["create", "delete"],
      });

      if (flags.create) {
        const result = await fetch(
          `${baseURL}/v1/namespaces/${flags.create}/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          },
        );

        console.log({ result });
      }

      if (flags.delete) {
        const result = await fetch(
          `${baseURL}/v1/namespaces/${flags.delete}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          },
        );

        console.log({ result });
      }

      console.log({ flags });
      break;
    }
    default: {
      break;
    }
  }
}
