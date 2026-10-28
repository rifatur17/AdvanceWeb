# Genuine Postman screenshots

All seven required PNGs were captured directly from the official Postman 12.34.2 Windows desktop app on 28 October 2026 (Asia/Dhaka). They are unedited window captures of actual requests against `http://127.0.0.1:3000`, backed by the existing PostgreSQL database on port 55432. Each file was decoded as PNG and opened individually to inspect readability and required evidence. No database credentials appear in the images.

The window-capture tool returned JPEG-encoded data. The captured pixels were exported to true PNG files (1280 by 752) without cropping, overlays, or changes to interface or response content.

| File | Verified evidence |
| --- | --- |
| [01-create.png](01-create.png) | POST /products, JSON request body and 201 Created response with generated UUID |
| [02-get-all.png](02-get-all.png) | GET /products, 200 OK, at least two complete saved product objects visible |
| [03-get-by-id.png](03-get-by-id.png) | GET using the actual generated Notebook UUID, 200 OK, complete entity |
| [04-update.png](04-update.png) | PATCH using the same UUID, JSON body, 200 OK, price 135.75 and quantity 12 |
| [05-confirm-update.png](05-confirm-update.png) | Separate GET confirms the updated values, 200 OK |
| [06-delete.png](06-delete.png) | DELETE using the same UUID, 200 OK and success message |
| [07-confirm-delete.png](07-confirm-delete.png) | GET all, 200 OK, the complete remaining list excludes the deleted UUID |

Every image shows the HTTP method, full resolved request URL, status and response body. POST and PATCH also show their JSON request bodies. The list response pane was enlarged, and the final capture uses Postman's normal zoom-out command so the complete remaining list fits.

Captured product UUID: `6b5c1e06-213d-447a-88a8-c2e68b2de479` (Notebook, now deleted). A second product was created successfully in Postman: `93f7d9ea-6828-418c-893a-a7be7b0ce01f` (Pencil, price 10, quantity 30), which remains saved. Existing Pen records were preserved.

The Lightweight API Client requires an account for collection-file imports. The initial create request was imported as cURL, and the subsequent requests were populated in Postman's editor using the collection's endpoints and update values. No account was created, no sign-in was automated, and no data was uploaded to a Postman workspace. This is the sole deviation from the requested collection-import procedure; all seven actual Postman screenshots are complete. The collection file is unchanged and ready for normal import when signed in.

To reproduce the sequence, start the existing API and PostgreSQL instance using the project README. In a signed-in Postman workspace, import `../postman/Lab-Task-1.postman_collection.json`, then execute the Products folder in order (including second-product setup). In the local Lightweight API Client, enter equivalent requests individually. Capture new PNGs only after actual successful responses. The original example second product is Pen; the screenshot session used Pencil so it could be distinguished from existing Pen records.
