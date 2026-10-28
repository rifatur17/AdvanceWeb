# Local review report

Verified on 28 October 2026 (Asia/Dhaka). All work remains local. No files have been staged, committed, pushed, or published.

## Implementation and reference

Project location: `C:\Test\AdvanceWeb\Mid\Lab task 1\product-management`.

The remote repository was empty when cloned; the local branch is `main` with no commits. The ZIP was extracted outside the repository under `C:\Test\tmp\advanceweb-reference-20261028`. The original ZIP and PDF are unchanged.

PostgreSQL and TypeORM were chosen from `Sec B/user-management/src/config/database.config.ts`, its PostgreSQL provider, injected repository services, and UUID entity definitions. Feature modules, controllers, services, DTOs, entities, and explicit migrations follow that reference. No in-memory record store is used.

All ten required endpoints are implemented: POST and GET on `/products` and `/employees`, and GET, PATCH and DELETE on `/products/:id` and `/employees/:id`. See README.md for request bodies, status codes, validation rules, and the directory-name discrepancy.

## Executed checks

- Dependency installation completed; package-lock.json records exact resolved versions. `npm ls --depth=0` passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run migration:run`: passed against the application PostgreSQL database.
- `npm test`: **21 passed, 0 failed** (one parent test and 20 subtests).
- Tests create at least two records per resource, list and retrieve records, update and confirm changes, delete and confirm absence, and exercise malformed UUIDs, missing records, unknown fields, empty PATCH, nulls, invalid emails, negative values, fractional integers, oversized integers, and client-supplied IDs.
- Persistence verified through real PostgreSQL queries after closing/reopening the application and database connections; no mocks are used. This check reconnects to the running PostgreSQL server; it does not restart the database server.
- A database check constraint was tested directly. A temporary trigger in the isolated test database verified a safe HTTP database-error response without exposing SQL details. Test-created rows and trigger/function were removed.
- All **15 requests** represented in the Postman collection were also executed successfully through Node fetch against the running production build on port 3000. This verifies the HTTP sequence; it is not a Postman execution or screenshot capture.
- This follow-up reran the checks: typecheck, production build, all 21 automated tests, and migrations passed again. A new set of 15 actual HTTP calls covered both CRUD sequences and update/delete confirmation.
- Postman capture then created Notebook and Pencil records, retrieved and updated Notebook, confirmed the update, deleted Notebook, and retrieved all remaining products. Existing records were preserved. The sample employees used by the separate HTTP verification sequence were deleted.
- All seven required Postman PNGs are now present. Every saved image was opened individually and visually inspected for the correct method, complete URL, response status and response body. POST and PATCH show the JSON request body. PNG decoding and file-integrity checks also passed for all seven.
- A final direct PostgreSQL SELECT matched the live GET /products response exactly: three remaining products, including Pencil. The captured Notebook UUID was absent, and GET by that deleted UUID returned 404.
- Final credential-exclusion scan passed across all 42 proposed submission files. The real database password is absent, the private .env is ignored, and the staging area is empty.
- `npm audit --omit=dev --audit-level=high`: **0 vulnerabilities**. A same-major `multer` override selects a patched transitive version while retaining the reference's NestJS 11 major version. Development dependency audit was not included in this result.
- Git ignore checks passed for `.env`, `node_modules`, and `dist`; `.env.example` is included. `git diff --check` passed for tracked changes; all assignment files are currently untracked because this is an empty repository.

The first test run caught empty PATCH bodies reaching TypeORM because DTO class fields existed with undefined values. The pipe now checks whether any defined field exists, and the complete suite passed after the fix.

## Local runtime

The API is running at `http://127.0.0.1:3000` for review. PostgreSQL is a private local instance listening only on `127.0.0.1:55432`. Its binaries and data are outside the repository at `C:\Test\runtimes\advanceweb-postgres`. The ignored `.env` already has matching local settings. No Windows service was installed.

After a machine restart, start this instance with PowerShell if needed:

```powershell
Start-Process -FilePath 'C:\Test\runtimes\advanceweb-postgres\pgsql\bin\postgres.exe' -ArgumentList '-D', 'C:\Test\runtimes\advanceweb-postgres\data' -WindowStyle Hidden -RedirectStandardOutput 'C:\Test\runtimes\advanceweb-postgres\server-out.log' -RedirectStandardError 'C:\Test\runtimes\advanceweb-postgres\server-err.log'
cd 'C:\Test\AdvanceWeb\Mid\Lab task 1\product-management'
npm.cmd run start:prod
```

Do not start a second copy while the API or database is already running. To inspect the running API:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/products
Invoke-RestMethod http://127.0.0.1:3000/employees
npm.cmd test
git -C C:\Test\AdvanceWeb status --short --branch
```

Normal setup and installation commands for another machine are in README.md.

## Remaining details and procedure limitation

1. Student SL, full name, ID and section remain explicit README placeholders because they have not been verified.
2. The existing `product-management` directory is unchanged. The PDF's explicit folder order says `product-management`; its table and submission URL say `product-management-api`. No duplicate project or archive was created.
3. All seven genuine Postman screenshots are complete. Postman 12.34.2 was installed from its official download; its executable had a valid Postman, Inc. signature. The unsigned-in Lightweight API Client blocks collection-file imports. Individual requests were entered locally instead (first request through cURL import, the rest through the editor). Full collection import was not performed; no account was created and no authentication was automated. The supplied collection remains intact for review/import.
4. Commit, push, instructor-access verification and submission remain pending the user's review and exact approval: **OK, commit and push**. Nothing is staged.

## Follow-up changed files

The API source, package files, configuration, migrations, tests and collection were preserved without changes. This follow-up added the seven `screenshots/*.png` files and `REVIEW-FILES.md`, and updated `README.md`, `VERIFICATION.md` and `screenshots/README.md`. There were no deletions or renamed files.

## Git review

All changed files are new and confined to this project directory. Nothing is staged. There is no HEAD or tracked-file diff in the empty repository; `git diff --stat` therefore has no entries. The complete final tree, exact absolute source paths and proposed-file inventory are in REVIEW-FILES.md, excluding ignored build outputs, installed dependencies and the private environment file. The empty repository still has no HEAD; all assignment files remain untracked and there is no staged or tracked-file diff. Git ignore and secret-exclusion checks were rerun. `git diff --check` passed; this standard command does not inspect untracked files.
