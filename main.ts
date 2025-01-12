import * as jose from "jose";
import { parseArgs } from "@std/cli";
import { createClient } from "@libsql/client";
import type { Config } from "@libsql/client";

if (import.meta.main) {
  const baseURL = Deno.env.get("DATABASE_ADMIN_URL") as string;

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
    case "key": {
      // taken from: https://hubertlin.me/posts/2024/11/self-hosting-turso-libsql/
      const flags = parseArgs(Deno.args.slice(1), {
        boolean: ["generate"],
      });

      if (flags.generate) {
        const access = "rw";
        const keyPair = await crypto.subtle.generateKey(
          { name: "Ed25519", namedCurve: "Ed25519" },
          true,
          ["sign", "verify"],
        );
        const rawPublicKey = await crypto.subtle.exportKey(
          "raw",
          keyPair.publicKey,
        );

        const urlSafeBase64PublicKey = btoa(
          String.fromCharCode(...new Uint8Array(rawPublicKey)),
        )
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        console.log("Public Key\n", urlSafeBase64PublicKey);

        const jwt = await (new jose.SignJWT({ "a": access }))
          .setProtectedHeader({ alg: "EdDSA", "typ": "JWT" })
          .setIssuedAt()
          .sign(keyPair.privateKey);

        console.log("JWT\n", jwt);
      }
      break;
    }
    case "ping": {
      const flags = parseArgs(Deno.args.slice(1), {
        string: ["authToken", "url"],
      });
      const config: Config = {
        url: flags.url || "http://localhost:8081",
      };

      if (flags.authToken) {
        config.authToken = flags.authToken;
      }

      const client = createClient(config);
      const result = await client.execute("select 1");
      console.log({ result });
      break;
    }
    default: {
      break;
    }
  }
}
