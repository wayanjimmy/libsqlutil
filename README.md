## Namespace

create namespace
```bash
deno run --allow-env --allow-net main.ts namespace --create=db1
```

delete namespace
```bash
deno run --allow-env --allow-net main.ts namespace --delete=db1
```

## Auth
generate keypair
```bash
deno run --allow-env --allow-net main.ts key --generate
```

```
export AUTH_TOKEN=xxx;
```

test client with auth
```bash
deno run --allow-env --allow-net main.ts ping \
    --url=http://db1.127-0-0-1.nip.io:8081 \
    --authToken=$AUTH_TOKEN
```
