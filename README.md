# Introduction

`dake` aims to provide a reliable scripting system. It's designed as an alternative to untyped scripts that can be difficult to reuse and maintain over time.

- Written and runs with TypeScript
  - Type-safe: The compiler checks your code before it runs, and your IDE can provide helpful suggestions as you write.
  - Expressive: The syntax is more readable and maintainable compared to bash scripts or Makefiles.

- Built on top of Deno
  - Portable: Runs on many platforms with built-in security features enabled by default.
  - Deployable: Can be distributed as a single binary or compiled into a self-contained executable. Dependencies are cached and bundled automatically.
  - Reusable: You can import third-party libraries directly without additional configuration. Integrate with existing tools like git naturally.

## Why `dake`?

The name `dake` is inspired by [`make`](https://en.wikipedia.org/wiki/Make_(software)), the legendary build tool that has helped developers for decades. It takes the good parts from this Unix legacy and enhances them with modern improvements.

Pronounce it like "make", but with Deno's "d".

## Examples

Common tasks developers automate with shell scripts:

### Database backup with timestamp
```bash
#!/bin/bash
DATE=$(date +%F_%H-%M-%S)
mysqldump -u root -pveryscret_password myapp_db > "/backups/db_${DATE}.sql"
find /backups -name "*.sql" -mtime +7 -delete
```

While this bash script works, it has several issues:
- Date format syntax (`+%F_%H-%M-%S`) is hard to remember and varies between systems
- Database credentials are exposed in the script, creating security risks
- No error handling - you won't know if backups fail until it's too late
- Hardcoded paths and retention policies scattered throughout the script
- Duplicated values that are easy to miss when updating

Here's how `dake` makes this better:

```typescript
#!/usr/bin/env -S deno run
// /opt/tools/backup.ts
import { dake, backup, mysqldump, z } from "jsr:@coint/dake@1.0.0";

// Configuration from backup.yaml, backup.json, or environment variables
const config = await dake.tryParseConfig(
  import.meta,
  z.object({
    userName: z.string(),
    password: z.string(),
    database: z.string(),
    directory: z.string()
  })
);

// Generates consistent timestamp: '/backups/myapp_db-2021.10.19-23.11.01.sql'
const backupFile = dake.pathJoin(
  config.directory,
  backup.makeFileName({name: config.database, extension: 'sql'})
);

await mysqldump.dump({
  userName: config.userName,
  password: config.password,
  database: config.database,
  file: backupFile
});

// Smart cleanup: keeps 2 recent backups AND anything newer than 7 days
// Moves to .trash first for safety, permanently deletes on next run
await backup.rotateDeleteOld({
  directory: config.directory,
  keepLast: 2,
  life: Duration(weeks: 1)
});
```

With `dake`:
- Configuration is separated from code - credentials stay in config files or environment variables
- Consistent, readable date formatting handled by the framework
- Type-safe configuration with validation
- Built-in error handling and logging
- Two-stage deletion prevents accidental data loss

Simple version (not recommended for production):

```typescript
#!/usr/bin/env -S deno run
import { backup, mysqldump } from "jsr:@coint/dake@1.0.0";

const file = `/backups/${backup.makeFileName({name: "myapp_db", extension: 'sql'})}`;
await mysqldump.dump({ userName: "root", password: "veryscret_password", database: "myapp_db", file });
await backup.rotateDeleteOld({ directory: "/backups", life: Duration(weeks: 1) });
```

Even the simple version is as concise as the bash script, but with better readability and maintainability. You get proper error handling, type checking, and IDE support without any extra complexity.


## Why Another Scripting Tool?

TODO :: explain kindly
