# Backend Development – Self-Learning Handbook

### A simple guide for learning backend development from the start

**Technology:** Node.js, TypeScript, NestJS, Fastify, PostgreSQL, Prisma, Redis, Pino and Jest  
**Learning format:** Self-study + instructor-led sessions + practical assignments  
**Level:** Beginner

---

# Welcome to Backend Development

You do not need to be a professional developer to start this book. You might write code with AI help. You might have just finished school. That is fine. New words are explained in normal language.

An app has two sides.

The screen is what you see: buttons, forms, pages. That side is called the frontend.

The hidden side is the backend. It runs on a server. When you click Login, the screen sends the email and password to the backend. The backend does the real work:

1. It receives the message.
2. It checks that the email and password were actually sent.
3. It looks for that person in the database.
4. It checks the password.
5. If the password is right, it sends back a pass (a token) so the screen can stay logged in.
6. If the password is wrong, it sends back an error.

The backend is not only a machine that returns data. It also keeps the rules, keeps the data safe, and stops people from doing things they are not allowed to do.

This book walks through that work one small step at a time. Run the examples. Change one line. See what breaks.

## How to use this handbook

For every chapter:

1. Read the concepts before attending the corresponding training session.
2. Run the example in the chapter. Change one value and see what happens.
3. Understand the code rather than copying it.
4. Complete the exercise at the end.
5. Write down questions.
6. Discuss difficult concepts with the trainer.
7. Do not move ahead without understanding the fundamentals.

**Important:** You will not understand every chapter the first time. Read it, run the example, then read it again. That is normal.

---

# PART 1 – Understanding Backend Development

## Chapter 1: What is backend development?

A typical application has three major components:

### 1. Frontend

The frontend is what users interact with.

Examples:
- Login screens.
- Dashboards.
- Forms.
- Buttons.
- Navigation.
- Data presentation.

### 2. Backend

The backend handles application operations that should happen on the server.

Examples:
- User registration.
- Authentication.
- Business rules.
- Data processing.
- Database operations.
- Authorization.
- Notifications.
- File management.

### 3. Database

The database stores application information.

Examples:
- Users.
- Products.
- Orders.
- Transactions.
- Reports.
- Settings.

### Understanding the request lifecycle

Consider a user logging in.

```text
User
 |
 v
Frontend Login Form
 |
 v
HTTP Request
 |
 v
Backend Controller
 |
 v
Validation
 |
 v
Authentication Service
 |
 v
Database
 |
 v
Authentication Result
 |
 v
HTTP Response
 |
 v
Frontend
```

The frontend should not directly access the application's private database.

It communicates with the backend, which controls access to application data.

### Important concepts

**Client:** The app that asks for something. The website in the browser is a client.

**Server:** The computer that receives the question and sends an answer.

**API:** The list of questions the server agrees to answer, and the shape of each answer. `POST /auth/login` is one question on the list.

**Database:** The place where data is saved, like a set of tables. Users, orders, and teams live here. The screen never opens the database itself.

**Rules:** The decisions the app makes. "This email is already used, so do not create a second account." The code for those decisions is the service.

### Example

This is one login, written as the messages the browser and the API exchange.

Request:

```http
POST /auth/login HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "a-long-password"
}
```

Response, when the password matches:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "accessToken": "signed-token"
}
```

The frontend sends the email and password. It does not look the user up. The backend checks the password against the database and returns a token, or an error. The database is not part of this message. Only the backend talks to it.

Change the password to the wrong one and the response should be `401`, not `200` with an empty token. A successful status means the operation succeeded.

### Exercise

Imagine a food delivery application.

Identify:
1. What belongs to the frontend?
2. What belongs to the backend?
3. What belongs to the database?

Try to explain what happens when a user places an order.

---

## Chapter 2: Understanding Node.js

JavaScript was originally designed to run in browsers.

Node.js allows JavaScript to execute outside the browser.

This means JavaScript can be used to:
- Build backend applications.
- Access files.
- Communicate with databases through drivers and libraries.
- Create HTTP servers.
- Process background jobs.
- Integrate external services.

### Browser JavaScript vs Node.js

| Browser | Node.js |
|---|---|
| Runs in the browser | Runs outside the browser |
| Has DOM APIs | Does not have browser DOM APIs by default |
| Uses browser APIs | Uses Node.js APIs |
| Frontend applications | Backend applications and tools |

### Important Node.js concepts

**Runtime environment.** Node.js is the program that executes your JavaScript. The browser is a different runtime, with different built-in APIs.

**Modules.** A file can export functions and import them from another file. A backend project is many modules, not one script.

**Packages.** A published library is a package. `package.json` records the ones this project uses. Which tool installs them is a later chapter, immediately before you create the NestJS project.

**Event loop.** Node does one piece of JavaScript at a time. When a database call or a timer is waiting, Node can run other JavaScript, then come back when the result is ready. That loop is why one process can handle many requests. A long calculation that never waits still blocks every other request until it finishes.

**Asynchronous execution.** Work that waits, such as a query or an HTTP call, is started and continued later. Chapter 3 covers how you write that with promises and `async/await`.

**File system.** Node can read and write files on the server. The browser cannot read the server's disk.

**Environment variables.** Configuration such as the database URL and the port lives outside the code, in the process environment. The same code can run locally and in production with different values. Read them from `process.env`. Do not commit the values.

**Process management.** A running Node program is a process. It has an id, a working directory, and a lifetime. When the process exits, the server stops accepting requests. Production uses a process manager, or a container, to restart it.

### Example

Save this as `server.js` and run it with `node server.js`.

```javascript
const http = require("node:http");

const port = Number(process.env.PORT) || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({
    url: req.url,
    cwd: process.cwd(),
    node: process.version,
    pid: process.pid,
    port
  }));
});

server.listen(port, () => {
  console.log(`listening on ${port}, pid ${process.pid}`);
});
```

Open `http://localhost:3000/health`. The JSON is built on the server. There is no HTML file and no browser API here.

`process.env.PORT` reads one variable. Start it again with `PORT=4000 node server.js` and the same file listens on 4000. That is configuration without changing code.

Do not print all of `process.env` from an endpoint. It contains secrets. The exercise can print the names of the variables in your terminal. It should not return them from the server.

### Exercise

Create a basic Node.js file and print:
- Current working directory.
- Node.js version.
- Environment variables.
- Current process ID.

---

## Chapter 3: Asynchronous JavaScript

This is one of the most important topics for backend development.

Backend applications frequently perform operations that take time.

Examples:
- Database queries.
- External API calls.
- File uploads.
- Sending emails.
- Processing payments.

JavaScript uses asynchronous programming to handle these operations without unnecessarily blocking the main execution thread.

### Promise example

```javascript
function getUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: "John"
      });
    }, 1000);
  });
}
```

### async/await

```javascript
async function main() {
  const user = await getUser();

  console.log(user);
}

main();
```

`main` waits for the promise, then prints `{ id: 1, name: "John" }` about a second later. The rest of the file does not block on that second. If `getUser` rejects and you do not use `try/catch`, the rejection becomes an unhandled error and the request fails.

### Error handling

```javascript
async function getUserDetails() {
  try {
    const user = await getUser();

    return user;
  } catch (error) {
    console.error("Unable to fetch user");
    throw error;
  }
}
```

### Promise.all

When independent operations can run simultaneously, Promise.all can be useful.

```javascript
const [users, products] = await Promise.all([
  getUsers(),
  getProducts()
]);
```

### Inside one request

A client calls `GET /api/users/8f2c`. The controller does this:

```typescript
@Get(":id")
async findOne(@Param("id") id: string) {
  const user = await this.users.findOne(id);
  const orders = await this.orders.findByUser(id);
  return { user, orders };
}
```

`await this.users.findOne(id)` pauses this function until PostgreSQL answers. It does not pause the whole process. Another request can run its own JavaScript while this one is waiting. When the row comes back, this function continues on the next line and only then calls `findByUser`. The orders query cannot start earlier, because it is written after the `await`.

If the two reads do not depend on each other, start them together. The handler still waits for both, but the database does the work at the same time:

```typescript
const [user, orders] = await Promise.all([
  this.users.findOne(id),
  this.orders.findByUser(id)
]);
```

If `findOne` rejects, `Promise.all` rejects too. The orders result is discarded, the controller throws, and the client gets an error instead of `{ user, orders }`. `await` is the pause. The lines after it have not run yet.

### Exercise

Create three asynchronous functions:

1. Fetch user information.
2. Fetch user orders.
3. Fetch user notifications.

Execute independent operations concurrently and handle failures appropriately.

---

# PART 2 – TypeScript for Backend Development

## Chapter 4: Why TypeScript?

Your existing frontend work may use JavaScript.

However, the company's NestJS backend applications use TypeScript.

TypeScript is JavaScript with labels on the values. A label says "this must be a number" or "this must be text."

The editor can then warn you before the server even starts.

### JavaScript example

```javascript
function calculateTotal(price, quantity) {
  return price * quantity;
}
```

JavaScript does not explicitly describe the expected types.

### TypeScript example

```typescript
function calculateTotal(
  price: number,
  quantity: number
): number {
  return price * quantity;
}
```

Now the expected input and output types are explicit.

`calculateTotal("10", "2")` is allowed in JavaScript. The `*` operator converts both strings to numbers, so the function returns `20` and never tells you the caller passed the wrong type. TypeScript rejects that call in the editor, before the server starts.

### Exercise

Rewrite one function you have written in JavaScript so the parameters and the return value have types.

Pass a value of the wrong type on purpose and read the error.

## Chapter 5: Types and interfaces

### Primitive types

```typescript
const name: string = "John";
const age: number = 25;
const isActive: boolean = true;
```

### Arrays

```typescript
const users: string[] = [
  "John",
  "David",
  "Alex"
];
```

### Interfaces

Interfaces describe the structure of an object.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}
```

Using the interface:

```typescript
const user: User = {
  id: 1,
  name: "John",
  email: "john@example.com",
  isActive: true
};
```

### Type aliases

```typescript
type UserRole = "ADMIN" | "MANAGER" | "MEMBER";

interface User {
  id: number;
  role: UserRole;
}
```

### Optional properties

```typescript
interface User {
  id: number;
  name: string;
  phone?: string;
}
```

The `?` indicates that the property is optional.

A user object may omit `phone`. It may not omit `name`. TypeScript reports the missing `name` where you create the object, which is earlier than a database error about a null column.

### Exercise

Create interfaces for:
- User.
- Product.
- Order.
- Payment.

Define their properties using appropriate types.

## Chapter 6: Classes, constructors and access modifiers

NestJS uses classes extensively.

```typescript
class UserService {
  private users: string[] = [];

  addUser(name: string): void {
    this.users.push(name);
  }

  getUsers(): string[] {
    return this.users;
  }
}
```

### Access modifiers

| Modifier | Meaning |
|---|---|
| public | Accessible from outside the class |
| private | Accessible only within the class |
| protected | Accessible within the class and subclasses |

### Constructors

A constructor initializes an object.

```typescript
class User {
  constructor(
    public name: string,
    public email: string
  ) {}
}
```

### Inheritance

```typescript
class AdminUser extends User {
  deleteUser(): void {
    console.log("User deleted");
  }
}
```

`private users` means other classes cannot push into that array. They call `addUser`. The constructor shorthand `public name: string` both declares the property and assigns the argument. These two lines are the same shape Nest uses for an injected service: the constructor argument becomes `this.usersService`.

```typescript
const admin = new AdminUser("Ada", "ada@example.com");
admin.deleteUser();
```

`admin` has `name`, `email`, and `deleteUser`, because `AdminUser` extends `User`.

### Exercise

Create a User class and an AdminUser class. Implement properties, constructors and methods.

## Chapter 7: Generics and decorators

### Generics

Generics allow reusable code to work with different types while maintaining type safety.

```typescript
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

const user = getFirst([
  "John",
  "David"
]);
```

`user` is a `string`, because the array you passed was `string[]`. Call `getFirst` with numbers and the result is a `number`. One function, and the type follows the caller. Nest uses the same idea for paginated responses and repository methods that work for more than one model.

### Decorators

Decorators are special declarations that can modify or provide metadata about classes and their members.

NestJS uses decorators extensively.

Examples:

```typescript
@Controller("users")
export class UsersController {}
```

```typescript
@Injectable()
export class UsersService {}
```

```typescript
@Get()
findAll() {}
```

You will encounter decorators throughout NestJS development.

A decorator does not replace the class. `@Controller("users")` attaches metadata: "this class handles `/users`". Nest reads that metadata at startup and registers the routes. `@Injectable()` marks a class as something Nest is allowed to construct and inject. Without it, Nest will not treat the class as a provider.

### Exercise

Read about TypeScript decorators and explain the purpose of the following:

- `@Controller()`
- `@Module()`
- `@Injectable()`
- `@Get()`
- `@Post()`

---

# PART 3 – HTTP, REST APIs AND NESTJS

## Chapter 8: HTTP fundamentals

HTTP is the protocol used for communication between clients and servers.

An HTTP request generally contains:

- Method.
- URL.
- Headers.
- Optional request body.

An HTTP response generally contains:

- Status code.
- Headers.
- Response body.

### HTTP methods

| Method | Purpose |
|---|---|
| GET | Retrieve information |
| POST | Create a resource or trigger an operation |
| PUT | Replace a resource |
| PATCH | Partially update a resource |
| DELETE | Delete a resource |

### HTTP status codes

| Status | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Content |
| 500 | Internal Server Error |

### Headers

Examples:

```http
Content-Type: application/json
Authorization: Bearer <token>
Accept: application/json
```

Headers provide additional information about the request or response.

### Example

A client asks for one user. The request line is the method and the path. The headers describe the message. The body is empty on a GET.

```http
GET /users/123 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer signed-token
```

The user exists:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "123",
  "name": "John"
}
```

No such user:

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "statusCode": 404,
  "message": "User not found"
}
```

The status code is how the client decides what to do. A `200` with `{ "error": true }` forces every caller to invent its own check. Use the status code.

`401` means the caller is not signed in, or the token is missing or expired. `403` means the caller is signed in and is still not allowed to see this user.

### Exercise

Inspect five API requests from a frontend application.

Identify:
- HTTP method.
- URL.
- Headers.
- Request body.
- Response status.
- Response body.

## Chapter 9: REST API design

REST is a simple way to name the addresses in an API. The address is the thing (`/users`). The method is the action (get it, create it, change it, delete it).

A good API uses those names the same way every time.

Example: User management.

```text
GET    /users
GET    /users/123
POST   /users
PATCH  /users/123
DELETE /users/123
```

### Query parameters

```text
GET /users?page=1&limit=10
```

### Filtering

```text
GET /users?status=ACTIVE
```

### Sorting

```text
GET /users?sortBy=createdAt&order=desc
```

### Example

Create a user. The path is the noun `/users`. `POST` is the action. The body is the new user, not a command name.

```http
POST /users HTTP/1.1
Content-Type: application/json

{
  "name": "John",
  "email": "john@example.com"
}
```

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "8f2c",
  "name": "John",
  "email": "john@example.com"
}
```

`201` means a record was created. `200` would mean the request succeeded and nothing new was stored, which is the wrong story here.

A second request with the same email should be `409 Conflict`, not another `201` and not a second row. The path stays `/users`. Do not invent `/createUser` or `/users/create`. The method already says create.

Replace a name with `PATCH /users/8f2c` and a body of `{ "name": "Joan" }`. `PUT` would send the whole user and replace it. `PATCH` sends only the fields that change.

### Exercise

Design REST endpoints for:
- Products.
- Orders.
- Payments.
- Categories.

## Chapter 10: Package managers

Part 1 was the ideas: what a backend is, what Node.js is, and how async code waits. This chapter is the tool you need in the next chapter, when you create a NestJS project.

Node projects pull libraries from a registry and run scripts such as `start:dev` and `test`. npm, pnpm, and yarn are three tools for that job.

They download from the same public registry. The word "npm" is both that registry and one of the tools. pnpm and yarn use the registry too.

`package.json` lists the dependencies and the scripts. A lockfile pins the exact versions that were installed. Commit the lockfile. A repository keeps one lockfile, and you use the tool that wrote it.

Our projects use pnpm. The cards above are the short version. The sections below are the tradeoff in full.

### npm

npm is the client that ships with Node.js.

Pros:
- Nothing extra to install. If Node is installed, npm is already there.
- NestJS docs and most tutorials print npm commands, so you can follow them without translating.
- npm 7 and later has a lockfile and workspaces, so it is a complete tool.

Cons:
- npm hoists dependencies to the top of `node_modules`. A file can import a package the project never declared, because some other dependency installed it. That is a phantom dependency. It works until that other package drops it.
- Each project stores its own copies. Disk use and install time grow when you work in many repositories.
- The hoisted layout hides mistakes until a clean install somewhere else.

### yarn

Yarn is a separate client. Yarn Classic (v1) and Yarn Berry (v2 and later) share a name and behave differently.

Pros:
- A lockfile and an offline cache, so installs can be repeated.
- Workspaces for repositories that contain more than one package.
- Yarn Classic is still what some existing repositories use, and it is fine to keep using it there.

Cons:
- Classic and Berry are not the same tool. Berry defaults to Plug'n'Play, which has no ordinary `node_modules` folder, and some NestJS and Node tools fail on that layout.
- You install and match the Yarn version the repository expects.
- It does not give our projects the strict dependency layout we want, and current NestJS docs rarely use it.

### pnpm

pnpm is the client our repositories use.

Pros:
- Packages are stored once on the machine and linked into each project. A second repository reuses that copy, so installs use less disk and less time.
- The `node_modules` layout is strict. You can import a package only when `package.json` lists it. A phantom dependency fails on your machine.
- `pnpm-lock.yaml` records the tree. Workspaces are built in.

Cons:
- Node does not include pnpm. Install it once, with Corepack or the pnpm installer, and use the version the repository expects.
- An npm tutorial can fail at the import until you add the missing package with `pnpm add`. The failure is the strict layout doing its job.
- A few older tools expect every package at the top of `node_modules`. pnpm does not put them there.

### Why our projects use pnpm

The strict layout is the reason. A backend service should depend on what it declared. pnpm turns an undeclared import into an error while you are writing the code. The shared store is the practical gain when you have more than one repository.

### Commands

| Task | pnpm | npm | yarn |
|---|---|---|---|
| Install from the lockfile | `pnpm install` | `npm install` | `yarn` |
| Add a dependency | `pnpm add package` | `npm install package` | `yarn add package` |
| Add a dev dependency | `pnpm add -D package` | `npm install -D package` | `yarn add -D package` |
| Remove a dependency | `pnpm remove package` | `npm uninstall package` | `yarn remove package` |
| Run a script | `pnpm run start:dev` | `npm run start:dev` | `yarn start:dev` |
| Run a one-off CLI | `pnpm dlx command` | `npx command` | `yarn dlx command` |
| Lockfile to commit | `pnpm-lock.yaml` | `package-lock.json` | `yarn.lock` |

After you clone one of our repositories, run `pnpm install`. Add a library with `pnpm add`. When a tutorial prints `npm install` or `npx`, use `pnpm add` and `pnpm dlx`.

If the folder already contains `package-lock.json` or `yarn.lock`, that project is not a pnpm project. Use the tool that matches the lockfile. Running a second tool writes a second lockfile and a different `node_modules` layout.

### Exercise

1. Open a repository and name its package manager from the lockfile.
2. Translate these into pnpm: `npm install`, `npm install class-validator`, and `npx @nestjs/cli`.
3. Explain one phantom dependency, and why pnpm reports it.

---

## Chapter 11: Introduction to NestJS

NestJS is a framework for building scalable Node.js server-side applications.

It provides a structured architecture based on modules, controllers and providers.

### Why NestJS?

Without a consistent architecture, backend projects can become difficult to maintain.

NestJS encourages:
- Modular architecture.
- Dependency injection.
- Separation of concerns.
- Reusable providers.
- Structured request handling.
- Testability.

### Creating a project

```bash
pnpm dlx @nestjs/cli new backend-training
cd backend-training
pnpm install
pnpm run start:dev
```

These are the pnpm commands for our repositories. The package managers chapter explains how pnpm differs from npm and yarn, and why this is the one we use. If a NestJS page prints `npm` or `npx`, use the pnpm column from that chapter.

The CLI starts you on Express. Our projects do not stay there. The HTTP adapter is Fastify (`@nestjs/platform-fastify`). Do not add `@nestjs/platform-express`. Fastify is the server Nest listens with. Helmet, CORS, cookies, and file uploads are Fastify plugins, registered with `app.register()`, not Express middleware.

`main.ts` stays small. It calls `createApp()` from `src/bootstrap/app-bootstrap.ts` and listens. Tests call `createApp()` too, so the plugins and the validation pipe exist in one place.

### Important generated files

```text
src/
  app.controller.ts
  app.module.ts
  app.service.ts
  main.ts
```

| File | Responsibility |
|---|---|
| main.ts | Application bootstrap |
| app.module.ts | Root module |
| app.controller.ts | HTTP request handling |
| app.service.ts | Application service logic |

### Example

`main.ts` starts the process. It builds the application from the root module and listens on a port.

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```

`app.module.ts` is the root. Nest reads it to find controllers and providers. A feature you forget to import here has no routes, even if the files exist.

```typescript
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

`pnpm run start:dev` runs this bootstrap and restarts when you save a file. Visit `http://localhost:3000` and you should see the generated hello response. That response came from `AppController`, which called `AppService`.

### Exercise

Create a NestJS project and explain what each generated file does. Change the message in `AppService` and refresh the browser.

## Chapter 12: Modules and controllers

### Modules

Modules organize application features.

Example:

```typescript
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

### Controllers

Controllers handle incoming requests and return responses.

```typescript
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() body: { name: string; email: string }) {
    return this.usersService.create(body);
  }
}
```

### Follow `GET /users/8f2c`

The request line is `GET /users/8f2c`. Nest compares it with the methods on `UsersController`.

`@Controller("users")` matches the `/users` part. `@Get()` matches `GET /users` and does not match this request, because this URL has another segment. `@Get(":id")` matches, and the segment `8f2c` is stored under the name `id`. `@Post()` does not match, because the method is GET.

Nest then calls `findOne`. The argument `id` is the string `"8f2c"`, not the number `8`. The method's only job is `return this.usersService.findOne(id)`. Whatever that call returns becomes the response body. The controller does not look in the array, and it does not decide the status code.

`POST /users` with a JSON body takes the other method. `@Body()` is that JSON object, still unchecked. Validation is a later chapter. If `UsersController` is missing from the module's `controllers` array, none of these URLs exist and the client gets `404` before any method runs.

### Important decorators

| Decorator | Purpose |
|---|---|
| `@Controller()` | Defines a controller |
| `@Get()` | Handles GET requests |
| `@Post()` | Handles POST requests |
| `@Patch()` | Handles PATCH requests |
| `@Delete()` | Handles DELETE requests |
| `@Param()` | Reads route parameters |
| `@Query()` | Reads query parameters |
| `@Body()` | Reads request body |

### Exercise

Create a UsersController with endpoints for listing users, retrieving one user and creating a user.

## Chapter 13: Services and dependency injection

A controller should not contain all application business logic.

Services handle business operations.

```typescript
@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: "John" }
  ];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find(
      (user) => user.id === id
    );
  }
}
```

### Dependency injection

Nest can hand a class the helpers it needs. You do not write `new UsersService()` yourself. This is called dependency injection. It only means "Nest builds it and passes it in."

```typescript
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}
}
```

NestJS manages the provider lifecycle and supplies the required dependency.

The module is what makes that possible. Listing `UsersService` in `providers` tells Nest to construct it. Listing `UsersController` in `controllers` tells Nest this class has routes, and that its constructor dependencies should be filled in.

```typescript
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

Forget `providers`, and startup fails with an error that Nest cannot resolve `UsersService`. The controller asked for a dependency the module never registered. The process exits before it listens. No request can arrive.

### The same request, after startup

`GET /users/8f2c` does not construct `UsersService`. That already happened when the application booted:

1. Nest reads `UsersModule`, sees `UsersService` in `providers`, and runs `new UsersService()`. One instance. The array of users lives on that instance.
2. Nest sees that `UsersController`'s constructor asks for `UsersService`, and passes that same instance in. The controller does not call `new`.
3. Later, the request arrives. Nest calls `findOne("8f2c")` on the controller that already exists.
4. `this.usersService.findOne("8f2c")` runs on the instance from step 1. `find` walks the array. The matching object goes back to the controller, and the controller's `return` is the JSON body.

A second `GET /users/8f2c` uses the same service. That is why a user pushed into the array on the first request is still there on the second. In a test, you construct the service yourself and pass a fake. The controller cannot tell the difference, because it never built the service.

### Why Nest builds it for you

- The controller stays a door. The rules stay in the service.
- The same service can be used by more than one controller.
- In a test, you pass a fake service. The controller does not know.
- You change the rule in one place.

### Exercise

Create:
- UsersModule.
- UsersController.
- UsersService.

Make the controller call the service for all business operations.

---

# PART 4 – REAL API DEVELOPMENT

## Chapter 14: Configuration and environment variables

A production API reads its settings from the environment. The database URL on your laptop is not the database URL in production. The code is the same. The values change.

Commit an example file. Do not commit the real values.

```text
DATABASE_URL=postgresql://app:app@localhost:5432/team
JWT_SECRET=replace-with-a-long-random-string
FRONTEND_URL=http://localhost:5173
PORT=3000
```

Name the committed file `.env.example`. The real `.env` stays in `.gitignore`. Anyone who clones the repository copies the example and fills in their own values.

### Example

`@nestjs/config` loads the file and lets you validate it before the app serves traffic. A missing secret should stop the process at startup. It should not fail on the first request that needs it.

Checking that a key exists is not enough. Environment values arrive as strings. `PORT=3000` is the string `"3000"` until something converts it. `RATE_LIMIT_ENABLED=false` is the string `"false"`, and a careless check treats any non-empty string as true. An empty `DATABASE_URL=` must fail, not pass as "present".

Our projects put every variable on one class and validate it with the same decorators as a request DTO. One class is the list of settings. A new variable that is not on the class, and not in `.env.example`, is not a setting yet.

```typescript
enum Environment {
  Development = "development",
  Production = "production",
  Test = "test"
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @Min(1)
  PORT: number = 3000;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsOptional()
  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  RATE_LIMIT_ENABLED: boolean = true;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true
  });
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validated;
}
```

```typescript
ConfigModule.forRoot({
  isGlobal: true,
  validate: validateEnv
})
```

`enableImplicitConversion` turns `"3000"` into the number `3000`. The `@Transform` on the boolean exists because the string `"false"` must become `false`, and implicit conversion would not do that reliably. `@IsNotEmpty()` rejects `""`.

`isGlobal` means other modules can inject `ConfigService` without importing `ConfigModule` again.

```typescript
@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}

  databaseUrl() {
    return this.config.getOrThrow<string>("DATABASE_URL");
  }
}
```

`getOrThrow` throws if the value is missing. `get` returns `undefined`, and the failure then happens later, deeper in Prisma, with a worse message.

Delete `DATABASE_URL` from `.env` and start the app. This happens before any request. Nest calls `validateEnv` while it is building the modules. The missing variable throws, the process exits, and it never reaches `listen`. `POST /api/users` cannot be sent, because nothing is listening. Put the variable back and start again. The process listens. Only then does a request reach a controller, and `getOrThrow` reads the value that was already checked.

Do not read `process.env` in random services once `ConfigService` is in place. One reader is easier to test: the test passes a `ConfigService` with the values that case needs.

### Exercise

Add `ConfigModule` to your project. Require `DATABASE_URL` and `JWT_SECRET`. Start the app with one of them removed and confirm it refuses to boot.

## Chapter 15: DTOs and validation

A DTO (Data Transfer Object) describes the shape of data transferred into or out of an application.

Never assume frontend validation is sufficient.

The backend must validate incoming data independently.

### Example

```typescript
import {
  IsEmail,
  IsNotEmpty,
  IsString
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}
```

### ValidationPipe

NestJS provides a ValidationPipe that works with DTO validation metadata.

Example configuration:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true
  })
);
```

Important:
- `whitelist` throws away fields that are not on the form. A person cannot add `role: "ADMIN"` and have it saved.
- `transform` turns text from the request into the type you asked for. The query `page=2` arrives as the text `"2"`. Transform makes it the number `2`.

The controller asks for the class, not a plain object. The pipe builds a `CreateUserDto`, runs the decorators, and calls the method only if they pass.

```typescript
@Post()
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

This body is rejected with `400` before `create` runs:

```json
{
  "name": "",
  "email": "not-an-email",
  "role": "ADMIN"
}
```

Follow that body through `POST /users`:

1. The request reaches the pipe with the JSON still a plain object. `create` has not been called.
2. The pipe builds a `CreateUserDto` and runs the decorators. `name` fails `@IsNotEmpty()`. `email` fails `@IsEmail()`.
3. The pipe throws. `usersService.create` is not on the stack, so no row is written.
4. The client receives `400`. The message names the fields that failed.

Send `{ "name": "Ada", "email": "ada@example.com", "role": "ADMIN" }` instead. Steps 2 and 3 pass. `role` has no decorator, so `whitelist` removes it before `create` is called. The service receives `{ name: "Ada", email: "ada@example.com" }`. Add `forbidNonWhitelisted: true` if `role` should be a `400` instead of being dropped. The client must not be able to set `role` by adding it to the JSON.

### Exercise

Create DTOs for user creation and updating.

Test invalid emails, missing names and unexpected properties.

## Chapter 16: Middleware, guards, pipes, interceptors and filters

These pieces run on the way from the HTTP request to your controller, and on the way back out. The names do not mean much until you watch one request pass through them.

This is the request:

```http
POST /api/users HTTP/1.1
Authorization: Bearer signed-token
Content-Type: application/json

{
  "name": "Ada",
  "email": "ada@example.com"
}
```

This is the method it is trying to reach. Nothing in the list below has called it yet when the request first arrives.

```typescript
@Post()
@UseGuards(AuthGuard)
@UseInterceptors(TimingInterceptor)
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

The order is fixed: middleware, then guard, then pipe, then the interceptor's "before" half, then `create`, then the interceptor's "after" half. The filter runs only if something throws.

### 1. Middleware, before Nest checks anything

Middleware is a function Nest calls first. `create` is not running. The service is not running. The body has not been validated.

```typescript
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: FastifyRequest, _res: FastifyReply, next: () => void) {
    console.log(`${req.method} ${req.url}`);
    next();
  }
}
```

For this request the log line is `POST /api/users`. Then `next()` hands the same request to the guard.

If you delete `next()`, the function returns and Nest does not continue. The client waits until the request times out. `create` is never called. That is the whole job of `next()`: "I am done, let the next piece run."

```typescript
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes("api/users");
  }
}
```

Our projects do not use middleware to write the access log. Pino does that, and the logging chapter shows the line it writes for this same request. Use middleware when you need to do something Pino does not, and you need it to happen before the guard.

### 2. Guard, still before the controller

The guard decides whether this caller may continue. It reads the header. It does not create the user.

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const header = request.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
```

Send the same `POST /api/users` with no `Authorization` header. `canActivate` throws. Nest stops. The validation pipe does not run, so a bad email is not the error you get. `create` does not run. The client receives `401`. The later authentication chapter replaces the header check with a real token check. The position in the request stays the same: before the controller.

With `Authorization: Bearer signed-token`, `canActivate` returns `true`. Only then does Nest move on.

### 3. Pipe, the body becomes a DTO or the request stops

The global `ValidationPipe` runs because the parameter is `CreateUserDto`. It builds that class from the JSON and runs the validators. `create` is still waiting.

Send this instead:

```json
{
  "name": "",
  "email": "not-an-email",
  "role": "ADMIN"
}
```

`name` fails `@IsNotEmpty()`. `email` fails `@IsEmail()`. The pipe throws `BadRequestException`. `usersService.create` is not called, so nothing is written to the database. The response is `400`.

The valid body passes. `role` is not on `CreateUserDto`, so `whitelist` removes it before the method sees the object. `create` is called with `{ name: "Ada", email: "ada@example.com" }`.

### 4. Interceptor, one function with two moments

This is the easy part to misread. `intercept` is entered before `create`. It does not finish before `create`. It starts, calls the controller, and then runs again when the controller has returned.

```typescript
@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const started = Date.now();
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    return next.handle().pipe(
      tap((body) => {
        console.log(`${request.method} ${request.url} ${Date.now() - started}ms`);
        console.log(body);
      })
    );
  }
}
```

Follow the valid `POST /api/users` through these lines:

1. Nest calls `intercept`. `Date.now()` runs. `create` has not run. There is no user yet.
2. `next.handle()` is the call that runs `create`. The pipe has already built the DTO, so `create` receives it and calls `usersService.create`.
3. `create` returns `{ id: "8f2c", name: "Ada", email: "ada@example.com" }`. That object is `body` in the `tap` callback.
4. The `tap` callback runs now, after the return. The log line is the time between step 1 and step 3, and `body` is the object the client is about to receive.
5. Nest sends that same object as `201` with `Content-Type: application/json`.

`tap` does not change `body`. It watches it. The callback runs only when `create` returns normally.

If `usersService.create` throws because the email already exists, step 3 never happens. The `tap` callback does not run. There is no timing line. The throw goes to the filter instead.

`@UseInterceptors(TimingInterceptor)` puts this around one route. `app.useGlobalInterceptors(new TimingInterceptor())` puts it around every route, including this one.

### 5. Filter, only when something throws

The filter does not run for the successful create. It runs for the missing token, the bad email, and the duplicate email. It turns the thrown exception into the JSON the client actually reads.

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500;
    const message = exception instanceof HttpException
      ? exception.message
      : "Internal server error";

    response.status(status).json({ statusCode: status, message });
  }
}
```

The duplicate email throws `ConflictException`. `catch` runs. `status` is `409`. The client receives `{ "statusCode": 409, "message": "Email already exists" }`. A database crash that is not an `HttpException` becomes `500` and `Internal server error`. The Prisma message stays in the log.

`app.useGlobalFilters(new AllExceptionsFilter())` applies this to every route. The controller does not catch the error itself.

### Exercise

Implement:
1. Request logging middleware.
2. An authentication guard.
3. A custom validation pipe or ValidationPipe configuration.
4. A global exception filter.

## Chapter 17: Exception handling

Backend applications must handle failures predictably.

Examples:
- User not found.
- Invalid input.
- Duplicate email.
- Unauthorized request.
- Database failure.

NestJS provides built-in exceptions.

```typescript
throw new NotFoundException(
  "User not found"
);
```

```typescript
throw new ConflictException(
  "Email already exists"
);
```

```typescript
throw new UnauthorizedException(
  "Invalid credentials"
);
```

### Example

Put the decision in the service. The controller stays a pass-through. Nest turns the exception into the status code.

```typescript
findOne(id: string) {
  const user = this.users.find((user) => user.id === id);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  return user;
}
```

`GET /users/missing` then responds:

```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

Follow `GET /users/missing` through that method. The array has no matching id.

1. The controller calls `findOne("missing")` and does not wrap it in `try/catch`.
2. `find` returns `undefined`. The `if` throws `NotFoundException`. The line `return user` does not run.
3. The throw leaves the service and leaves the controller. Nest does not turn a thrown exception into `200`.
4. The exception filter from the previous chapter sets status `404` and writes `{ "statusCode": 404, "message": "User not found" }`.

The method does not return that JSON. It throws, so a caller who forgets to check a return value cannot treat "not found" as a user. `POST /users` with an email that is already stored throws `ConflictException` at the same kind of line, and the status is `409`. A failed database query is not one of these. Let it throw, log it, and respond with `500` and a message that does not include the SQL.

### The error our APIs return

Every failure uses one shape. The frontend branches on `errorCode`, not on the wording of `message`.

```json
{
  "statusCode": 404,
  "message": "User not found",
  "errorCode": "NOT_FOUND",
  "requestId": "req-abc123",
  "timestamp": "2026-06-18T12:00:00.000Z",
  "path": "/api/users/8f2c"
}
```

One global filter builds that object. Services throw. Controllers do not catch the error and invent a second shape. Prisma codes are translated before the client sees them: `P2002` is `409` and `CONFLICT`, `P2025` is `404` and `NOT_FOUND`, `P2003` is `400` and `INVALID_REFERENCE`. Anything else from Prisma is `500`. The response never includes the Prisma message.

`requestId` is the id Fastify already assigned to the request. The same id is on the Pino log line. A user report that includes it is enough to find the log.

### Important rules

- Do not return successful responses for failed operations.
- Do not expose database internals.
- Do not swallow exceptions.
- Use appropriate exception types.
- Log unexpected failures safely.

### Exercise

Implement error handling for a user registration API.

## Chapter 18: Pagination and API documentation

When a database contains thousands of records, returning everything in one request is usually a bad idea.

Pagination limits the number of records returned.

Example:

```text
GET /users?page=1&limit=20
```

A typical response:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

This is an illustrative response format. Follow the actual project's response conventions.

### Example

`page` and `limit` arrive as strings because they are query parameters. A DTO with `@Type(() => Number)` turns them into numbers when `transform` is enabled.

```typescript
import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

export class PageQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
```

Cap `limit`. A client who sends `limit=1000000` will otherwise ask the database for a million rows.

```typescript
@Get()
findAll(@Query() query: PageQueryDto) {
  return this.usersService.findAll(query.page, query.limit);
}
```

```typescript
findAll(page: number, limit: number) {
  const start = (page - 1) * limit;

  return {
    data: this.users.slice(start, start + limit),
    meta: {
      page,
      limit,
      total: this.users.length
    }
  };
}
```

Follow `GET /users?page=2&limit=20`. The query string arrives as the strings `"2"` and `"20"`, not as numbers.

1. Nest calls `findAll` only after the pipe accepts `PageQueryDto`. `@Type(() => Number)` makes `query.page` the number `2` and `query.limit` the number `20`.
2. `findAll(2, 20)` sets `start` to `20`. `slice(20, 40)` is the second page. The first twenty users are not in `data`.
3. `meta.total` is the length of the whole list, not `20`. The client uses `total` to know how many pages exist.
4. The response is `200` and `{ data, meta }`. The controller returned that object. It did not wrap it again.

`GET /users?limit=1000000` fails the `@Max(100)` check in the pipe. `findAll` is not called. `GET /users` with no query uses the defaults `page = 1` and `limit = 20`. Later, Prisma uses the same numbers as `skip` and `take`. `total` comes from a count of the filtered rows, not from the length of the page you just returned.

### Swagger

Swagger/OpenAPI is a description of your API that other people, and tools, can read. NestJS can generate that description from your controllers and DTOs, then serve a page where you can try each endpoint.

A useful description answers five questions for every route:

| What to document | Why it matters |
|---|---|
| API description | What this group of endpoints is for |
| Request DTO | Which fields are required, and what shape they have |
| Response | What a success looks like, and which status codes you return |
| Authentication | Which routes need a token, and where to send it |
| Endpoint grouping | Users, teams, and auth stay in separate sections instead of one long list |

Decorators such as `@ApiTags()`, `@ApiOperation()`, and `@ApiProperty()` are how Nest attaches that information. The generated page is a convenience. The running API is still the source of truth, so keep the decorators next to the code they describe.

```typescript
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const config = new DocumentBuilder()
  .setTitle("Team API")
  .setDescription("Team management")
  .addBearerAuth()
  .build();

SwaggerModule.setup("docs", app, SwaggerModule.createDocument(app, config));
```

```typescript
@ApiTags("users")
@Controller("users")
export class UsersController {
  @Get()
  @ApiOperation({ summary: "List users" })
  findAll(@Query() query: PageQueryDto) {
    return this.usersService.findAll(query.page, query.limit);
  }
}
```

Run the app and open `http://localhost:3000/api/docs`. You should see the users group, the query parameters, and a place to paste a bearer token. If a field is missing, add `@ApiProperty()` on the DTO property. The page reads the decorators. It does not guess.

Our projects mount Swagger only when `NODE_ENV` is `development`. `setupSwagger` returns immediately otherwise. The page describes every route and accepts a token. That is useful on your laptop and a map of the API for anyone who can open production. Production does not serve `/api/docs`.

### Exercise

Implement pagination and document your endpoints using Swagger.

## Chapter 19: File uploads and external APIs

Backend applications frequently need to process files.

Examples:
- Profile pictures.
- Documents.
- Reports.
- Product images.

The browser sends a file as `multipart/form-data`, not as JSON. The field name in the form and the name in `FileInterceptor` must match.

### Example

```typescript
@Post("avatar")
@UseInterceptors(FileInterceptor("file", { limits: { fileSize: 2_000_000 } }))
upload(@UploadedFile() file: Express.Multer.File) {
  if (!file) {
    throw new BadRequestException("File is required");
  }

  const allowed = ["image/png", "image/jpeg"];

  if (!allowed.includes(file.mimetype)) {
    throw new BadRequestException("Only PNG and JPEG are allowed");
  }

  return {
    filename: file.originalname,
    size: file.size
  };
}
```

Follow a real upload. The browser sends `POST /users/8f2c/avatar` with `Content-Type: multipart/form-data` and a part named `file`. This is not a JSON body. `@Body()` would not see the bytes.

1. The auth guard runs first. No token means `401`, and `upload` is not called.
2. `FileInterceptor("file")` reads the part named `file`. The name must match the form field. A part named `avatar` leaves `file` undefined, and the method throws `400` with "File is required".
3. A 3 MB file never reaches the `if`. The interceptor rejects it because `limits.fileSize` is 2 MB.
4. A PDF that is small enough reaches the method. `mimetype` is `application/pdf`, it is not in `allowed`, and the method throws `400`. Nothing is stored.
5. A small PNG passes both checks. The method returns `{ filename, size }`. That object is the `200` body. The file itself is not the response.

`file.mimetype` comes from the client. Treat it as a hint, then check the bytes or let the storage service reject unexpected types. Do not use the original filename as the path on disk. A name like `../../.env` is a path, not a label. Generate a new name, store the file outside the source tree, and save that name on the user row.

This example keeps the file in memory so you can see the checks. Our projects do not store the bytes in PostgreSQL, and they do not write them onto the container disk. The file goes to Cloudflare R2, which speaks the S3 API, through one media service. The database stores the object key. A controller never calls R2 itself. The upload limit is set on the Fastify multipart plugin (`@fastify/multipart`), currently 10 MB. The route sits behind the auth guard. An anonymous upload is a public disk.

### External API example

Calling another service is the same shape as a database call: it can be slow, and it can fail. Set a timeout so one stuck provider does not hold the request open.

```typescript
async sendWelcome(email: string) {
  const response = await fetch("https://mail.example.com/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ to: email }),
    signal: AbortSignal.timeout(3_000)
  });

  if (!response.ok) {
    throw new BadGatewayException("Email provider failed");
  }
}
```

A timeout or a `502` from the provider should not leave the user half-created if the email was required for the operation to count as done. If the email is optional, create the user, then send, and record the failure for a retry. Do not retry forever. A provider that returns `429` is asking you to slow down.

The same timeout and status check apply to payments, maps, storage, and login providers. The URL changes. The failure handling does not.

### Exercise

Implement a basic image upload endpoint and understand how a backend service communicates with an external API.

---

# PART 5 – DATABASE AND PRISMA

## Chapter 20: Database fundamentals

A relational database stores information in tables.

Example: Users.

| id | name | email |
|---|---|---|
| 1 | John | john@example.com |
| 2 | David | david@example.com |

### Primary key

Uniquely identifies a record.

### Foreign key

Connects records between tables.

### Relationships

**One-to-one:** One user has one profile.

**One-to-many:** One user has many orders.

**Many-to-many:** Many students can join many courses. The link is its own table, with one foreign key to students and one to courses.

### Example

Two tables. `orders.user_id` is a foreign key, so an order cannot point at a user who does not exist.

```sql
CREATE TABLE users (
  id    uuid PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name  text NOT NULL
);

CREATE TABLE orders (
  id      uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users (id),
  total   integer NOT NULL CHECK (total >= 0)
);
```

Insert a user, then an order that uses that user's id. Insert an order with a random `user_id` and PostgreSQL rejects it. That rejection is the foreign key doing its job. The application should turn it into a `400` or a `404`, not a stack trace.

`UNIQUE` on `email` is what makes a duplicate registration a database error instead of two rows. `CHECK (total >= 0)` refuses a negative total even if the service forgets to check.

### Exercise

Design database tables for:
- Users.
- Teams.
- Projects.
- Tasks.

Define their relationships.

## Chapter 21: SQL fundamentals

SQL is the language used to interact with relational databases.

### SELECT

```sql
SELECT * FROM users;
```

### WHERE

```sql
SELECT * FROM users
WHERE id = 1;
```

### INSERT

```sql
INSERT INTO users (name, email)
VALUES ('John', 'john@example.com');
```

### UPDATE

```sql
UPDATE users
SET name = 'David'
WHERE id = 1;
```

### DELETE

```sql
DELETE FROM users
WHERE id = 1;
```

### JOIN

```sql
SELECT users.name, orders.id
FROM users
JOIN orders
ON users.id = orders.user_id;
```

### ORDER BY

`ORDER BY` sorts the rows you selected. `ASC` is ascending, `DESC` is descending.

```sql
SELECT * FROM users
ORDER BY name ASC;
```

### Aggregates

`COUNT` and `SUM` collapse many rows into one number. `GROUP BY` says which column that number belongs to.

```sql
SELECT user_id, COUNT(*) AS order_count
FROM orders
GROUP BY user_id;
```

`COUNT(*)` counts rows. `SUM(total)` adds a numeric column. Without `GROUP BY`, the aggregate covers the whole result.

### INNER JOIN and LEFT JOIN

The `JOIN` above is an inner join. It returns only users who have at least one order.

A left join keeps every row from the left table. Users with no orders still appear, and the order columns are empty.

```sql
SELECT users.name, orders.id
FROM users
LEFT JOIN orders
ON users.id = orders.user_id;
```

That is how you find users with no orders: keep every user, then keep the rows where `orders.id` is null.

### Indexes and transactions

An index helps PostgreSQL find matching rows without reading the whole table. A transaction groups several statements so they succeed or fail together. Both are covered in the next chapters, after the queries themselves are clear.

### Exercise

Write SQL queries to retrieve users and their orders, count orders per user and find users with no orders.

## Chapter 22: PostgreSQL

PostgreSQL is the relational database used in the training stack. SQL from the previous chapter runs here. This chapter is about how PostgreSQL stores and protects that data.

### Database creation

A PostgreSQL server can hold many databases. Each application gets its own, so the team app does not share tables with something else.

```sql
CREATE DATABASE team;
```

You then connect to `team` before creating tables. In development, Docker or a local install provides the server. The application never creates its database on every request.

### Tables and data types

A table is a named set of columns. Each column has a type, and every row must fit those types.

| Type | Use it for |
|---|---|
| `text` | Names, emails, descriptions |
| `integer` | Whole numbers, such as a quantity |
| `boolean` | Yes or no flags |
| `uuid` | Identifiers that are hard to guess |
| `timestamptz` | A moment in time, stored with a time zone |

`text` does not mean "any value is fine." An email is still text, but a constraint or the application should decide what counts as an email.

### Constraints

A constraint is a rule PostgreSQL refuses to break, even if the application has a bug.

| Constraint | Meaning |
|---|---|
| `PRIMARY KEY` | This column uniquely identifies the row |
| `UNIQUE` | No two rows may share this value |
| `NOT NULL` | The column must have a value |
| `REFERENCES` | The value must exist in another table |
| `CHECK` | The value must pass a condition, such as `price >= 0` |

If an insert violates a constraint, PostgreSQL rejects that statement. The API should turn that failure into a clear error, not a stack trace.

### Foreign keys

A foreign key is a column that points at a primary key in another table.

```sql
CREATE TABLE orders (
  id      uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id)
);
```

You cannot insert an order for a user who does not exist. You also cannot delete that user while orders still point at them, unless you define what should happen to those orders.

### Transactions

A transaction wraps several statements. PostgreSQL applies all of them, or none of them. The transactions chapter covers why that matters for operations like creating a team and its first member together.

### Normalization

Normalization means each fact is stored once.

If every order row also copies the customer's name and email, a name change has to be updated in many rows. One of them will be missed. Store the customer once in `users`, and let `orders` keep only `user_id`.

Do not split tables so far that every screen needs five joins to show a name. Normalize until a fact has one home, then stop.

### Query execution

PostgreSQL does not run a query by reading your SQL from top to bottom as a script. It builds a plan: which index to use, whether to scan a table, how to join. `EXPLAIN ANALYZE` prints that plan and how long each step took. When a query is slow, read the plan before adding random indexes.

### Why indexes?

Indexes can improve data retrieval performance, but they also add storage and write overhead.

Do not add indexes without understanding the query patterns and trade-offs.

### Exercise

Create a PostgreSQL database for the Team Management System.

## Chapter 23: Prisma ORM

Prisma is an ORM that provides a type-safe way to interact with supported databases.

Instead of writing SQL for every database operation, developers can use Prisma Client.

### Example Prisma model

```prisma
model User {
  id        String   @id @db.Uuid
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

There is no `@default(uuid())`. That default is UUID v4, which is random. Random ids scatter new rows across a PostgreSQL index, and you cannot tell which row is newer from the id.

Our projects use UUID v7. A v7 id starts with the time it was created, so new rows land together in the index and ids sort by time. The schema does not generate it. The repository does, through one function:

```typescript
import { uuidv7 } from "uuidv7";

export function generateId(): string {
  return uuidv7();
}
```

```typescript
await this.prisma.user.create({
  data: {
    id: generateId(),
    email
  }
});
```

Use `generateId()` for primary keys only. A session token or an OAuth state value should stay random. Every model also has `createdAt` and `updatedAt`.

### Prisma Client

```typescript
const users = await prisma.user.findMany();
```

### Create

```typescript
const user = await prisma.user.create({
  data: {
    name: "John",
    email: "john@example.com"
  }
});
```

### Update

```typescript
await prisma.user.update({
  where: {
    id: userId
  },
  data: {
    name: "David"
  }
});
```

### Delete

```typescript
await prisma.user.delete({
  where: {
    id: userId
  }
});
```

### Relations

A relation is the Prisma version of a foreign key. The schema names both sides, and the client can load them together.

```prisma
model User {
  id     String  @id @db.Uuid
  email  String  @unique
  orders Order[]
}

model Order {
  id     String @id @db.Uuid
  user   User   @relation(fields: [userId], references: [id])
  userId String
}
```

`include` fetches the related rows in the same query you already needed:

```typescript
const users = await prisma.user.findMany({
  include: { orders: true }
});
```

### Filtering, sorting, and pagination

`where` filters, `orderBy` sorts, and `skip` with `take` pages. These map to the SQL you already wrote.

```typescript
const users = await prisma.user.findMany({
  where: { email: { contains: "@example.com" } },
  orderBy: { createdAt: "desc" },
  skip: 0,
  take: 20
});
```

Ask for `take` on list endpoints. An unbounded `findMany()` returns the whole table.

### Migrations

`schema.prisma` is a drawing of the tables. Saving that file does not change the real database. The tables on your laptop, in QA, and in production stay exactly as they were.

A migration is a saved list of database steps, written as SQL. One file might say "create the users table". The next might say "add a phone column". Those files live in the project, next to the code, and you commit them.

You need them because every database must change in the same way, in the same order. If each person edits the database by hand, one machine has the phone column and another does not. The app then works in one place and breaks in another.

### `pnpm prisma generate` and `pnpm prisma migrate deploy`

These two commands do different jobs. They are not two ways to do the same thing.

| Command | What it changes | What it leaves alone |
|---|---|---|
| `pnpm prisma generate` | Writes the TypeScript helper (Prisma Client) so your code can call `prisma.user.findMany()` | The database. No table is created. No row is changed. |
| `pnpm prisma migrate deploy` | The real database. It runs the migration files this database has not run yet | Your TypeScript. It does not write new code, and it does not invent a migration from an edit you forgot to save |

`pnpm install` already runs `prisma generate`. That is why a fresh clone can type-check before a database exists. Generate only reads the drawing.

`migrate deploy` only runs files that are already in the project. If you added `phone` to `schema.prisma` but never made a migration file, deploy does not add that column. Use deploy when you update QA or production. Run it once, then start the app. Do not let every copy of the app run it at the same time.

On your laptop, when you change the drawing, create the file first:

```bash
pnpm prisma migrate dev --name add-users
```

That writes the SQL file, runs it on your local database, and generates the client. Commit the new file. QA and production do not use `migrate dev`. They use `migrate deploy`, which only applies files that already exist.

Do not edit a migration file after a shared database has already run it. Add a new migration instead.

### Transactions

When several writes must succeed or fail together, use `prisma.$transaction`. The transactions chapter shows why, and how.

### Exercise

Connect your NestJS project to PostgreSQL and implement user CRUD operations through Prisma.

## Chapter 24: Prisma in a NestJS application

Prisma Client can run from a script. Inside Nest it should be a provider, created once and injected where queries happen. Calling `new PrismaClient()` in a service opens a new pool every time that class is constructed.

### Example

```typescript
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

```typescript
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
```

Export it. A module that does not export `PrismaService` cannot inject it, even if it imports `PrismaModule`.

```typescript
@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
```

```typescript
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  create(data: { name: string; email: string }) {
    return this.prisma.user.create({ data });
  }
}
```

Follow `GET /api/users` after the app has booted. `onModuleInit` already called `$connect`. This request does not open a new database connection.

1. The controller method runs and calls `this.usersService.findAll()`. It does not mention Prisma.
2. `findAll` calls `this.prisma.user.findMany(...)` on the one `PrismaService` Nest injected at startup.
3. Prisma sends the SQL and waits. The rows come back as objects.
4. `findAll` returns that array. The controller returns it. The response body is the array, with `200`.

`POST /api/users` with a valid DTO takes `create` instead. `prisma.user.create` inserts one row and returns it. The controller's return value is that row. Restart the process and `GET /api/users` still returns the row, because it was written to PostgreSQL, not to an array on the service.

The controller does not import Prisma. When you write a unit test, you pass a fake in place of `PrismaService`. The same `findAll` runs, and the fake decides what `findMany` returns.

In `main.ts`, enable shutdown hooks so `onModuleDestroy` runs when the process receives a stop signal. Without that, a deploy can kill the process and leave database connections open until the database times them out.

```typescript
const app = await NestFactory.create(AppModule);
app.enableShutdownHooks();
await app.listen(process.env.PORT ?? 3000);
```

`pnpm prisma generate` rebuilds the TypeScript helper after you change the drawing. It does not change the database. On your laptop, `pnpm prisma migrate dev --name add-users` creates the migration file and applies it. QA and production use `pnpm prisma migrate deploy`, which only runs files that are already saved. If `DATABASE_URL` is missing, fix the configuration chapter's check before debugging Prisma.

### A seed for local data

A seed is a script that inserts the rows you need to click around the API. It is not a migration. Migrations change the shape. Seeds fill a development database.

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin"
    }
  });
}

main()
  .finally(() => prisma.$disconnect());
```

Run it with `pnpm exec prisma db seed` after you point `package.json` at the script. `upsert` means running the seed twice does not create two admins.

### Exercise

Add `PrismaModule`, inject it into `UsersService`, and implement list and create against PostgreSQL. Restart the app and confirm the rows are still there.

## Chapter 25: Database transactions and performance

Consider a bank transfer.

1. Deduct money from Account A.
2. Add money to Account B.

Both operations must succeed together.

If one operation fails, the transaction should be rolled back.

This is why database transactions are important.

### Atomicity, consistency, isolation, durability

These four properties are what people mean by ACID. They are the promise a transaction makes.

| Property | Meaning for the transfer |
|---|---|
| Atomicity | Both updates commit, or neither does. There is no "money left the first account and never arrived." |
| Consistency | The database rules still hold afterward. Balances stay non-negative if that is a constraint. |
| Isolation | Another request does not see the half-finished transfer. |
| Durability | After a commit, the result survives a crash. It is not only in memory. |

### Transaction boundaries

The boundary is where you decide "these statements are one unit." Keep it short. Open the transaction, do the writes that must agree, then commit.

In Prisma:

```typescript
await prisma.$transaction(async (tx) => {
  await tx.account.update({
    where: { id: fromId },
    data: { balance: { decrement: amount } }
  });

  await tx.account.update({
    where: { id: toId },
    data: { balance: { increment: amount } }
  });
});
```

Use `tx` for every query inside the callback. A call on `prisma` instead of `tx` runs outside the transaction and will not roll back with the rest.

If either update throws, Prisma rolls the transaction back.

The same shape is the request `POST /api/teams` with `{ "name": "Platform" }`, when creating a team must also create the caller's membership. Both writes use `tx`. If the membership insert throws, the team row is not left behind, and the client receives the error from the filter. A write that uses `this.prisma` instead of `tx` inside that callback is a separate operation. It stays in the database even when the callback throws, which is the bug the transaction was meant to prevent.

### Concurrent updates

Two requests can read the same balance, both decide there is enough money, and both deduct it. Each transaction was internally correct. Together they overdraw the account.

Isolation and a conditional update prevent that. Deduct only if the current balance is still high enough, and treat "zero rows updated" as a failed transfer. Do not read the balance in application code and then write a new total you computed earlier.

### Indexes and query optimization

An index speeds up the lookups and joins you actually run. It slows writes, because PostgreSQL must update the index too. Add an index for a column you filter or join on constantly, such as `orders.user_id`. Do not index every column.

When a list endpoint is slow, look at the query before looking at NestJS. `EXPLAIN ANALYZE` shows whether PostgreSQL scanned the whole table. Fix the query or add the missing index. Caching a slow query hides the problem and adds a second place for stale data.

### Connection pooling

Opening a database connection is expensive. A pool keeps a small set of open connections and lends them to requests.

Prisma does this for you. The pool has a limit. If every request holds a connection while it calls a slow external API, the pool runs out and new requests wait. Finish the database work, release the connection, then do the slow work.

### Exercise

Implement a transaction that creates a team and its initial membership records. Verify that failures do not leave partially created data.

---

# PART 6 – AUTHENTICATION, SECURITY AND TESTING

## Chapter 26: Authentication

Authentication answers:

**Who are you?**

A common authentication flow:

```text
User submits credentials
        |
        v
Backend receives request
        |
        v
Validate credentials
        |
        v
Verify password hash
        |
        v
Generate access token
        |
        v
Return authentication result
```

### Password hashing and salt

Passwords must never be stored as plain text. Store a hash. A hash is a one-way function: the same password always produces the same hash, and you cannot turn the hash back into the password.

When a user logs in, hash the password they just typed and compare it to the stored hash.

A salt is random data mixed into the password before hashing. Two users who pick `password123` then get different hashes, so a stolen table of hashes cannot be matched against one precomputed list.

Use a password hashing library built for this, such as bcrypt or argon2. A fast general-purpose hash is the wrong tool. Password hashes are deliberately slow so guessing millions of passwords is expensive.

### JWT, access tokens, and refresh tokens

A JWT (JSON Web Token) is a signed string the server can check without storing the session in a database.

```text
header.payload.signature
```

The payload carries claims such as the user id and an expiry. The signature proves the server created the token. Anyone who has the token can read the payload. Do not put passwords or secrets in it.

An access token is short-lived. The client sends it on each API request, usually as `Authorization: Bearer <token>`. If it leaks, it is only useful until it expires.

A refresh token is longer-lived and is used only to get a new access token. Keep it somewhere harder to steal than a normal API call. If a refresh token is stolen, the attacker can keep minting access tokens, so store it carefully and make it revocable.

### Token expiration

Every token needs an expiry. A token that works forever is a password you cannot rotate. Access tokens often last minutes. Refresh tokens last days, and the server can reject one earlier if the user logs out or the token is reported stolen.

Check expiry on every request. A token with a valid signature and a past expiry is still invalid.

### Secure cookies

A cookie with `HttpOnly` cannot be read by frontend JavaScript, so a script injected into the page cannot copy it. `Secure` sends it only over HTTPS. `SameSite` limits when the browser attaches it to a request.

`localStorage` is readable by any script on the page. That is a poor place for a refresh token. If the frontend must hold an access token in memory, keep the lifetime short.

### Authentication strategies

A strategy is one way to prove identity. Email and password is one. A JWT bearer token on later requests is another. NestJS, through Passport, models each of these as a strategy: one validates credentials at login, another validates the token on protected routes.

The controller should not contain the comparison or the token check. The strategy does. The controller only receives "this is the user" or a rejection.

### Example

Hash a password, then check a guess against the hash. The hash is what you store.

```typescript
import bcrypt from "bcrypt";

const passwordHash = await bcrypt.hash("a-long-password", 12);
const matches = await bcrypt.compare("a-long-password", passwordHash);
const rejected = await bcrypt.compare("wrong", passwordHash);
```

`matches` is `true`. `rejected` is `false`. Run it twice and the hashes differ, because of the salt, and both still compare as `true` for the same password. The next chapter puts this check behind `POST /auth/login` and returns a signed token.

### Exercise

Explain where an access token, a refresh token, and the password hash each live. Say which of them the browser should be unable to read.

## Chapter 27: Login with JWT

The authentication chapter is the idea. This chapter is the NestJS version you can run: register, check the password, sign a token, and reject requests that do not have one.

Install the pieces our projects use:

```bash
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
pnpm add -D @types/passport-jwt @types/bcrypt
```

The user row stores `passwordHash`, never the password. `bcrypt.hash` produces the hash. `bcrypt.compare` checks a login against it.

### Example: register and login

```typescript
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  async register(input: { name: string; email: string; password: string }) {
    const passwordHash = await bcrypt.hash(input.password, 12);

    try {
      const user = await this.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash
        }
      });

      return { id: user.id, email: user.email };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("Email already exists");
      }

      throw error;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const matches = await bcrypt.compare(password, user.passwordHash);

    if (!matches) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const accessToken = await this.jwt.signAsync(
      { sub: user.id, role: user.role },
      { expiresIn: "15m" }
    );

    return { accessToken };
  }
}
```

An unknown email and a wrong password both throw `UnauthorizedException` with the same message. The response does not say which one failed, and it never includes `passwordHash`.

```typescript
@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post("login")
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }
}
```

`POST` defaults to `201`. Login does not create a row, so set `200` yourself. `RegisterDto` and `LoginDto` use the same validators as the DTO chapter: email format, and a password with a minimum length.

Register `JwtModule` with the secret from `ConfigService`. A secret written in the module is a secret in git.

```typescript
JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.getOrThrow<string>("JWT_SECRET")
  })
})
```

### Example: protecting a route

Passport's JWT strategy reads the bearer token, checks the signature and the expiry, and returns the object Nest stores on the request.

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>("JWT_SECRET")
    });
  }

  validate(payload: { sub: string; role: string }) {
    return { userId: payload.sub, role: payload.role };
  }
}
```

```typescript
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user;
  }
);
```

```typescript
@UseGuards(AuthGuard("jwt"))
@Get("me")
me(@CurrentUser() user: { userId: string; role: string }) {
  return user;
}
```

### Two requests

First request:

```http
POST /auth/login
Content-Type: application/json

{ "email": "ada@example.com", "password": "a-long-password" }
```

1. `AuthController.login` runs. There is no guard on this route. The DTO has already checked that `email` looks like an email.
2. `AuthService.login` loads the user by email. No row means `UnauthorizedException` immediately. `bcrypt.compare` does not run, and no token is signed.
3. The row exists. `bcrypt.compare` checks the password against `passwordHash`. A mismatch throws the same `UnauthorizedException`. The client cannot tell which of the two steps failed.
4. The password matches. `signAsync` builds the token from `{ sub: user.id, role: user.role }` and the secret from `ConfigService`. The method returns `{ accessToken }`. The response is `200`. `passwordHash` is not in it.

Second request, using that token:

```http
GET /auth/me
Authorization: Bearer eyJhbGciOi...
```

1. `AuthGuard("jwt")` runs before `me`. Passport takes the bearer string and checks the signature against `JWT_SECRET`. A missing header, a changed character, or an expired token stops here. `me` is not called. The status is `401`.
2. The signature matches and the token is not expired. Nest calls `validate` with the payload `{ sub, role }`.
3. `validate` returns `{ userId, role }`. That object is stored on the request. It is not a database read.
4. `me` runs. `@CurrentUser()` reads `request.user`, which is the object from step 3. The return value is the `200` body: `{ "userId": "...", "role": "MEMBER" }`.

`validate` runs only after the token is valid. Put the database lookup there if you need a user who might have been deleted while the token was still unexpired. Returning the payload is enough when the token is short-lived and the next chapter's role guard only needs the role.

### Exercise

Implement register, login, and `GET /auth/me`. Confirm a wrong password and a missing token both fail, and that the user JSON never contains the password hash.

## Chapter 28: Authorization

Authorization answers:

**What are you allowed to do?**

Example:

| Role | Permissions |
|---|---|
| Admin | Manage users and teams |
| Manager | Manage assigned projects |
| Member | Access assigned tasks |

### Authentication vs authorization

A user may be successfully authenticated but still not have permission to access a particular resource.

Backend authorization must be enforced on the server.

### Example

Authentication has already produced `request.user`. This guard reads the roles allowed on the handler and compares them to that user. `@Roles("ADMIN")` is metadata. It does nothing until a guard reads it.

```typescript
export const Roles = (...roles: string[]) => SetMetadata("roles", roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>("roles", [
      context.getHandler(),
      context.getClass()
    ]);

    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const role = request.user?.role;

    if (!role || !roles.includes(role)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
```

```typescript
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("ADMIN")
@Delete(":id")
remove(@Param("id") id: string) {
  return this.usersService.remove(id);
}
```

Follow `DELETE /api/users/8f2c` with a real token for a user whose role is `MEMBER`.

1. `AuthGuard("jwt")` runs first, because it is listed first in `@UseGuards`. No token, or a bad token, throws here. The status is `401`. `RolesGuard` does not run. `remove` does not run.
2. The token is valid. The strategy has set `request.user` to `{ userId, role: "MEMBER" }`.
3. `RolesGuard` reads `@Roles("ADMIN")` off this method. The list is `["ADMIN"]`. `request.user.role` is `"MEMBER"`, which is not in the list, so the guard throws `ForbiddenException`.
4. `remove` is not called. The user row is still there. The response is `403`.

Send the same request with an `ADMIN` token. Step 3 returns `true`. Only then does `remove("8f2c")` run.

A role is not ownership. An admin of team A must not delete a project in team B because both users have the role `ADMIN`. After the role check, the service loads the record and checks that this user is allowed to touch this id. That check is inside `remove`, so it only runs when both guards have returned true.

### Exercise

Implement role-based access control with three roles: Admin, Manager and Member.

## Chapter 29: Backend security

Security is not an optional feature.

### Broken access control

The most common API failure is a check that exists in the UI and not on the server. Hiding the Delete button does not stop someone from sending `DELETE /teams/123`.

Check, on every request, that this user may perform this action on this record. An admin role is not enough if the team belongs to another company. Load the record, confirm ownership or membership, then act.

### Injection

Injection happens when user input is treated as code. The classic case is building SQL by gluing strings together:

```text
"SELECT * FROM users WHERE email = '" + email + "'"
```

A crafted email can change the query. Parameterized queries keep the value separate from the statement. Prisma does this for you. The risk returns if you drop into raw SQL and concatenate input. Pass values as parameters.

### Cross-site scripting

Cross-site scripting (XSS) runs an attacker's script in a user's browser. It is usually a frontend bug: rendering user text as HTML. The backend still has a part. Store text as text. Do not build HTML from user input and return it as a page. Do not reflect the request body back in an error page without escaping.

### Cross-origin resource sharing

Browsers block a page on `https://app.example` from reading a response from `https://api.example` unless the API allows that origin. That rule is CORS.

CORS is not authentication. A server, or a tool that is not a browser, ignores it. Allow the origins of your real frontends. Do not treat `Access-Control-Allow-Origin: *` plus credentials as a configuration to copy from a tutorial.

### Rate limiting

Rate limiting caps how often a client can call an endpoint. Login, registration, and password reset need it. Without a cap, an attacker can try passwords, or create thousands of accounts, as fast as the network allows.

Return `429` when the limit is hit. Apply a stricter limit to authentication than to ordinary reads.

### Password security

Hash passwords with a slow password hash, as the authentication chapter describes. Do not log the password, do not return the hash in the user API, and do not send the password back "so the user can confirm it."

### Secrets management

Database URLs, JWT secrets, and third-party keys are secrets. They belong in environment variables or a secret store, not in source code and not in the image you build.

A secret committed once is still in git history after you delete the line. Rotate it.

### Input validation

Validate type, length, and format on the server with DTOs. Frontend checks are for the user's convenience. They are not a security boundary, because anyone can send a request that skipped your form.

### Sensitive data exposure

Responses, logs, and error messages should not contain password hashes, tokens, or full connection strings. Return the fields the client needs. Log identifiers, not credentials.

### Secure error handling

Tell the client what they can act on: "Invalid email or password", "Team not found". Write the unexpected detail to the log.

The same message for a bad password and an unknown email avoids telling an attacker which emails are registered. A database error message returned as JSON tells them your table names.

### Example

Put the HTTP hardening in `main.ts`, once, so a new controller cannot forget it.

```typescript
await app.register(helmet);
await app.register(cors, {
  origin: config.getOrThrow<string>("FRONTEND_URL").split(","),
  credentials: true
});

app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true
}));
```

`helmet` and `cors` here are the Fastify plugins `@fastify/helmet` and `@fastify/cors`. `app.use(helmet())` is the Express version. Our server is Fastify, so that call is the wrong package. The origin list is `FRONTEND_URL` from the environment, a comma-separated list, not a string written in the file.

Helmet sets headers that tell the browser not to sniff content types. CORS allows the origins in that list. A request from a different browser origin is refused by the browser. A script that is not a browser ignores CORS, so this is not a login check.

Rate limiting is a global guard backed by Redis, not a counter in the Node process. A limit stored in memory resets when the process restarts and is not shared when two copies of the API are running. Redis is the shared counter. Login uses a stricter profile than a normal read. `GET /health` uses a loose one, because a load balancer calls it constantly. A route with no limit will eventually accept a guessed password.

The origin and the JWT secret belong in configuration, not in this file. The configuration chapter refuses to boot when they are missing.

### Important rule

Never trust incoming frontend data.

Every request must be treated as potentially invalid or malicious.

### Exercise

Review an API and identify security weaknesses.

## Chapter 30: Unit testing with Jest

Testing helps ensure that code behaves as expected.

A unit test verifies a small unit of functionality.

Example:

```typescript
describe("Calculator", () => {
  it("should add two numbers", () => {
    expect(2 + 3).toBe(5);
  });
});
```

In backend projects, unit tests commonly cover service logic. The repository and Redis are replaced so the test checks only the decision the service makes.

Tests live in `test/unit/`, mirroring `src/`. A service at `src/users/users.service.ts` is tested by `test/unit/users/users.service.spec.ts`. Do not put `*.spec.ts` next to the source. End-to-end tests live in `test/e2e/` and boot the app with mocked Prisma and Redis. Helpers used only by tests stay in `test/helpers/`. They are not imported by `src/`.

### The pieces of a Jest test

`describe` groups related tests. `it` (also written `test`) is one case. `expect` is the assertion: what you believe the result should be.

The service decides. The test supplies a fake database so the decision is the only thing under test.

```typescript
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(input: { name: string; email: string }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email }
    });

    if (existing) {
      throw new ConflictException("Email already exists");
    }

    return this.prisma.user.create({ data: input });
  }
}
```

```typescript
it("rejects a duplicate email", async () => {
  const prisma = {
    user: {
      findUnique: jest.fn().mockResolvedValue({ id: "1" }),
      create: jest.fn()
    }
  };
  const service = new UsersService(prisma as unknown as PrismaService);

  await expect(
    service.create({ name: "Ann", email: "ann@example.com" })
  ).rejects.toThrow("Email already exists");

  expect(prisma.user.create).not.toHaveBeenCalled();
});
```

`findUnique` resolves to a row, so the service takes the duplicate branch. `create` must not be called. If the assertion only checked the thrown error, a bug that both throws and inserts would still pass. Check the effect you care about.

Run it with `pnpm test`. Jest prints the test name and `pass` or the difference it found.

`beforeEach` runs before every `it` in that group. Use it to build a fresh service so one test cannot leak state into the next. `afterEach` is the matching cleanup, when a test opened something that must be closed.

### Mocks and spies

A mock replaces a collaborator. A unit test of `UsersService` should not open PostgreSQL. Pass a fake Prisma client that returns the row, or the error, this case needs.

A spy wraps a real function and records how it was called. Use a spy when you need to know that `mail.send` was called with the new user's email. Use a mock when the real function must not run.

### Test coverage

Coverage reports which lines ran during the tests. It does not report which behaviors are correct. A test with no assertion can "cover" a line and still prove nothing. Cover the branches that matter: success, not found, duplicate, and invalid input. Do not chase 100% by testing getters.

### Exercise

Write unit tests for a UsersService.

Test:
- Successful user retrieval.
- User not found.
- Duplicate email.
- Invalid input.

## Chapter 31: Integration and E2E testing

**Unit testing:** Tests an individual unit, usually a service, with its neighbors replaced by mocks.

**Integration testing:** Tests real collaborators together. A typical case is a service and a test database. The SQL, the constraints, and the transaction run for real. External systems such as email stay fake, or you will test someone else's outage.

**E2E testing:** Tests a complete application flow through HTTP, the same way a client would. The test does not call the service directly. It sends requests.

NestJS E2E tests boot the application and use a library such as Supertest to call it:

```typescript
const response = await request(app.getHttpServer())
  .post("/auth/login")
  .send({ email, password })
  .expect(200);
```

Use a database that is not production, and reset its data between tests. An E2E test that depends on whatever was left in the database will pass on one machine and fail on another.

Example:

```text
POST /auth/register
        |
        v
POST /auth/login
        |
        v
GET /users/me
        |
        v
Verify response
```

### Exercise

Write E2E tests for registration, login and protected API endpoints.

---

# PART 7 – PRODUCTION AND ENGINEERING PRACTICES

## Chapter 32: Architecture and code quality

Good backend code is easy to read next month. If one function does five jobs, a small change can break all five.

Split the work. Each piece does one job.

| Piece | What it does, in plain words |
|---|---|
| Controller | The door. It receives the web request and sends the answer back, including the status code (`200`, `404`, and so on). It does not decide the rules. It does not talk to the database. |
| DTO | A form. One form lists the fields a person is allowed to send in. Another form lists the fields the server will send back. A field that is not on the form does not get through. |
| Service | The rules. Example: "this email is already used, so stop." It also decides when two database saves must both succeed, or both be cancelled. |
| Repository | The database worker for one feature. It finds rows, adds a row, changes a row, and deletes a row. It uses Prisma to do that work. It does not decide who is allowed to do the action. |
| Media service | Saves uploaded files, such as photos, in online storage called R2. The controller does not upload the file itself. It asks this service to do it. |

The request moves in one direction only:

```text
Controller  →  Service  →  Repository  →  Database
```

The controller asks the service. The service asks the repository. The repository uses Prisma to read or write the database. The answer comes back the same way.

The controller does not skip ahead and talk to the database. The repository does not decide "is this person allowed?" That decision belongs to the service.

The form for data coming in and the form for data going out are two different lists. If you send back the raw database row, you can accidentally send the stored password. Send only the fields on the outgoing form.

Normal pages use addresses that start with `/api`. Admin pages use `/admin`. A list of many items is sent as `{ data, meta }`. `data` is the items. `meta` is the page number and the total.

If the controller also checks the email, saves the row, and calls a payment company, one change can break all three jobs. Split them.

### One job per file

`UsersService` changes when the user rules change. `MailService` changes when sending email changes. If one file does both, every email change is also a user change, and it is easy to break the wrong thing.

People call this set of habits SOLID. You do not need to memorize the names. You need the habit:

| Habit | In this app |
|---|---|
| One job | One service does one kind of work |
| Add, don't rewrite | A new way to take payment is a new file, not a rewrite of the order service |
| A stand-in must fit | A fake mail sender used in a test must accept the same call as the real one |
| Ask only for what you need | A check that only needs the user id should not require the whole user record |
| Ask for help, don't build it inside | The service receives the mail sender. It does not write `new Stripe()` in the middle of a method |

### Modular architecture

A module is one feature in a folder: users, teams, or login. Inside it you keep that feature's controller, service, forms (DTOs), and database worker.

Another feature can use a piece only if this module hands it out. If users needs to send email, it asks the mail module. It does not open the mail module's files and call them directly.

### Dependency injection

The module declares `UsersService`. Nest creates one and passes it into `UsersController`. The controller does not call `new UsersService()`.

That is what makes the service replaceable in a test. You used this in the services chapter. Architecture is mostly refusing to reach around it later.

### Reusable services

If three controllers hash a password, the hashing belongs in one service. The next security fix then happens once. Copying the same ten lines means one copy will be missed.

Share a service when the rule is the same. Do not share it when the names match and the rules do not.

### Do not add extra layers too early

A repository is worth having when the database work is more than one line, or when a test needs to replace it. An extra interface that only calls Prisma once, and has no second version, is just another file to open.

Add that extra file when you really have two ways to do the job, or when a test must swap the database out. Until then, keep the database calls in the repository you already have, and do not wrap them again.

### Naming conventions

A name should say what the code does, in words a new person can read.

| Prefer | Avoid |
|---|---|
| `createTeam` | `handleData` |
| `UsersService` | `UserHelper`, `UserManager`, `UserUtils` |
| `findByEmail` | `get` |
| `TeamMembership` | `Data`, `Info`, `Obj` |

Files follow Nest suffixes: `users.controller.ts`, `users.service.ts`, `create-user.dto.ts`.

### Code reviews

A review checks whether the change is safe to merge.

Look for rules sitting in the controller, missing checks on incoming data, passwords written into logs, a database call inside a loop, tests that only try the success case, and names that hide what a function does.

### Example

Poor approach:

A controller handles validation, business logic, database operations and external API calls.

Better approach:

- The controller receives the request and sends the answer.
- The DTO checks the incoming fields.
- The service applies the rules.
- The repository does the database work: find, save, update, delete.
- A separate service talks to other companies, such as email.

The poor version, which is a pattern you will see in a first draft:

```typescript
@Post()
async create(@Body() body: { name: string; email: string }) {
  if (!body.email.includes("@")) {
    throw new BadRequestException("Invalid email");
  }

  const created = await this.prisma.user.create({ data: body });
  await fetch("https://mail.example.com/send", {
    method: "POST",
    body: JSON.stringify({ to: body.email })
  });
  return created;
}
```

The controller validates, writes to the database, and calls another company. A unit test has to boot HTTP. Split it: a DTO checks the email, `UsersService.create` applies the rule, and a repository writes the row. The controller becomes:

```typescript
@Post()
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

Follow `POST /api/users` with `{ "name": "Ada", "email": "ada@example.com" }` through the split version.

1. The validation pipe builds `CreateUserDto`. The controller method has not run.
2. `create` on the controller runs and returns `this.usersService.create(dto)`. It does not touch Prisma and it does not call the mail provider.
3. `UsersService.create` applies the rule, then calls the repository. The repository runs `prisma.user.create` and returns the row.
4. The service returns that row to the controller. The controller's return value is the `201` body.

In the poor version, steps 2 and 3 are the same function, so a unit test of the email rule has to boot HTTP and open a database. In the split version, the test calls `UsersService.create` and the repository is a fake. The request the client sends is the same either way.

The repository does not know whether the caller is an admin. Files in a feature are `users.controller.ts`, `users.service.ts`, `users.repository.ts`, and `create-user.dto.ts`. Tests for them live under `test/unit/`, not beside the source.

### Exercise

Refactor a large controller into a properly structured NestJS module.

## Chapter 33: Logging, debugging and performance

Backend developers must know how to investigate failures.

When something breaks for a real user, you cannot open their browser. You read the diary the server kept. That diary is the log. Our projects write it with Pino.

### Why Pino

Other ways of writing logs do not fit this app.

| Way | Why we skip it |
|---|---|
| `console.log` | It prints a sentence. You cannot search "all errors for this user" without reading every line. |
| Morgan | A logger made for Express. Our server is Fastify, so Morgan does not connect, and it still prints sentences. |
| Fastify's own logger | A second diary in a different shape. We turn it off (`logger: false`) so only Pino writes. |
| Nest's built-in logger | Fine in a tutorial. It is not the record our servers store. We replace it with Pino so startup messages use the same diary. |

Pino writes one JSON object per line. In production that line goes to stdout, and the platform that runs the container stores it. A search for one user or one status code is a field match.

```json
{"level":50,"time":1718700000000,"msg":"Failed to create team","teamId":"8f2c","userId":"14","requestId":"req-abc"}
```

`nestjs-pino` also logs the request itself: method, url, status code, and how long it took. You do not write that interceptor. A request you forgot to time is still in the log.

Development is the exception. JSON is hard to read while you are coding, so `NODE_ENV=development` sends the same log through `pino-pretty`, one line, colored. Production does not. Pretty printing is slower, and the collector wants the JSON. Tests set the level to `silent`, or Jest's output is buried under a request log per test.

`/health` is ignored. A load balancer calls it every few seconds. Those lines would be most of the file, and they are not a user action.

```typescript
LoggerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const nodeEnv = config.get<string>("NODE_ENV") ?? "development";
    const pretty = nodeEnv !== "production" && nodeEnv !== "test";

    return {
      pinoHttp: {
        level: nodeEnv === "test" ? "silent" : "info",
        transport: pretty
          ? { target: "pino-pretty", options: { singleLine: true } }
          : undefined,
        autoLogging: {
          ignore: (req: { url?: string }) => req.url === "/health"
        }
      }
    };
  }
})
```

In application code, inject `Logger` from `nestjs-pino`. Do not call `console.log`.

```typescript
this.logger.warn({ requestId, path, statusCode });
this.logger.error({ err: exception, requestId, path });
```

The key `err` is special. Pino serializes the stack from that property. `this.logger.error("failed", exception)` or a string you built yourself drops the stack into a shape the collector cannot expand. A 5xx is `error`, because someone may need to act. A 4xx is `warn`. A validation failure is not an outage, and if it is logged as `error` the real outages disappear.

Do not log passwords, tokens, or request bodies that contain them. The automatic request log is the access log. Your own log is the business event, with the ids you will search by.

### This request, in the log

`POST /api/users` from the interceptor chapter, after it succeeds, produces an access line without you writing one. In development, `pino-pretty` prints it on one line. The same event in production is this JSON:

```json
{
  "level": 30,
  "req": { "method": "POST", "url": "/api/users" },
  "res": { "statusCode": 201 },
  "responseTime": 12,
  "msg": "request completed"
}
```

`level` 30 is `info`. `responseTime` is the milliseconds between arrival and the response, which is the same moment the timing interceptor's `tap` runs. You did not call `logger.log` for this line. `nestjs-pino` wrote it because the request finished.

`GET /health` does not produce that line. `autoLogging.ignore` returns true for that URL, so the probe stays out of the file.

If the email is already taken, the service throws, the filter responds `409`, and the access line has `statusCode: 409`. That is still `info`. The filter also calls `this.logger.warn({ statusCode: 409, requestId, path })`, which is a second line, a warning, with the fields you will search. The password from the body is on neither line. A `500` from a database crash is the line that uses `err`, so the stack is attached to that object and not sent to the client.

### Log levels

| Level | Use it for |
|---|---|
| error | A 5xx, or a failure someone may need to act on |
| warn | A 4xx, or a retry the request survived |
| info | A normal business event, such as "user registered", and the automatic request line |
| silent | Tests. The logger is off |

If every line is `error`, nothing stands out. If every line is `debug`, production logs become noise. Our default level is `info`.

### Error investigation

Start from the symptom and walk backward.

```text
User report or alert
        |
        v
Which endpoint, and which status code?
        |
        v
Find the log line for that request
        |
        v
Read the exception and the input that caused it
        |
        v
Reproduce it locally with the same input
        |
        v
Fix the cause, not only the message
```

A 500 with no log is a bug in error handling. A 400 is usually bad input. A 401 is authentication. A timeout is often a downstream call or a slow query.

### Debugging

A debugger pauses the process on a line so you can inspect variables. Run Nest with the Node inspector and set a breakpoint in the service.

Logging shows what already happened. A breakpoint shows what is happening now, on your machine. Use a breakpoint when you need a value you did not think to log.

### Request tracing

One click becomes several log lines: the automatic access line, then whatever the service logs. Fastify assigns `request.id`. Pino puts it on the access line, and the error filter copies it into the JSON body as `requestId`.

Pass that id into `this.logger` when you log from a service. When a user reports a failure, the id in the response is the search key. You do not generate a second id in middleware.

### API response time

Measure from when the request arrives to when the response is sent. An interceptor is a natural place to record it.

One slow request is an anecdote. The useful numbers are the typical time and the slow tail. An endpoint that is usually 40 ms and sometimes 4 seconds has a different problem than one that is always 800 ms.

### Database query performance

Most slow NestJS endpoints are waiting on PostgreSQL. Look at the query before rewriting the controller.

`EXPLAIN ANALYZE` shows how PostgreSQL ran the query and how long each step took. A sequential scan of a large table, on a filter you run for every request, is a candidate for an index.

### N+1 queries

This is the usual shape:

```typescript
const teams = await prisma.team.findMany();

for (const team of teams) {
  team.members = await prisma.teamMember.findMany({
    where: { teamId: team.id }
  });
}
```

One query loads 50 teams. Then 50 more queries load their members. That is 51 round trips, and it gets worse as the list grows.

Load the relation once:

```typescript
const teams = await prisma.team.findMany({
  include: { members: true }
});
```

### Memory and CPU

| Symptom | Often means |
|---|---|
| Memory climbs and never drops | A cache with no limit, or loading an entire table into an array |
| CPU stays high | A tight loop, or synchronous work blocking the event loop |
| Both look fine, and responses are slow | The process is waiting on the database or the network |

Node.js runs your JavaScript on one thread. A long synchronous loop blocks every other request on that process. A database call does not block that thread while it waits, which is why a slow query shows up as latency rather than as high CPU.

### Exercise

Investigate an API that is returning slow responses and identify the bottleneck.

## Chapter 34: Health checks

A process can be running and still be unable to serve users. The database connection can be down. A load balancer cannot know that from a TCP port alone.

`GET /health` answers a narrower question: is this process accepting requests? It is public. It returns no user data. A load balancer calls it every few seconds.

### Example

```typescript
@Controller()
export class HealthController {
  @Get("health")
  getHealth(): { status: string; timestamp: string } {
    return {
      status: "ok",
      timestamp: new Date().toISOString()
    };
  }
}
```

The response is `{ "status": "ok", "timestamp": "..." }` and the status is `200`. It does not query PostgreSQL. A database round trip on every probe would add load, and it would mix two questions: "is the process up" and "is the database up". This route is the first question. Pino is told to ignore `/health`, or those probes become most of the log file.

Do not put the JWT guard on this route. The balancer has no user token. Do not run a report here.

### Exercise

Add `GET /health`. Call it and confirm the JSON shape. Confirm those calls do not appear in the Pino access log.

## Chapter 35: Continuous integration

Continuous integration runs the checks on every pull request, on a clean machine. A test that passes only on your laptop is not a check.

The workflow file lives at `.github/workflows/ci.yml`. It runs on a pull request and on pushes to `main`, `qa`, and `prod`. A red job means the branch is not ready. A push to `qa` or `prod` is what deploys, and only after this job is green. `main` runs CI and does not deploy.

### Example

```yaml
name: CI

on:
  push:
    branches: [main, prod, qa]
  pull_request:

jobs:
  quality:
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: postgresql://postgres:postgres@localhost:5432/app
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm build
      - run: pnpm test
      - run: pnpm test:e2e
```

`--frozen-lockfile` fails if `package.json` and `pnpm-lock.yaml` disagree. That is what you want in CI.

The job does not start PostgreSQL. Unit tests mock the repository. End-to-end tests boot the real Fastify app and replace `PrismaService` and Redis with fakes, so the suite does not depend on a database that might be slow or empty in a different way tomorrow. `DATABASE_URL` is still set. Env validation and `prisma generate` read the string. They do not open a connection during this job.

`pnpm lint` is part of the gate. A type error such as an unhandled promise fails the branch even when the tests pass. ESLint uses the type-checked rules: no `any`, and no floating promise. Prettier is the formatter, and the lint rule enforces it.

Never point this job at the production database. A green CI run is what a deploy to `qa` or `prod` is allowed to follow.

### Exercise

Add the workflow. Open a pull request that breaks a unit test and confirm the check fails. Fix the test and confirm it passes.

## Chapter 36: Docker and deployment

Docker packages an application and its runtime so QA and production start from the same thing you built.

"It works on my machine" usually means your machine has a Node version, a database, and environment variables the server does not. An image carries the application and the runtime. The machine only has to run containers.

### Images and containers

An **image** is a read-only snapshot: the system libraries you need, the Node version, your built app, and the command that starts it.

A **container** is a running instance of an image. You can start three containers from one image. Removing a container does not remove the image.

```text
Dockerfile
    |
    v
Image, built once
    |
    +--> Container on your laptop
    +--> Container in QA
    +--> Container in production
```

### Dockerfile

A Dockerfile is the recipe for the image. For NestJS the steps are: install dependencies from the lockfile, generate the Prisma client, compile TypeScript, and start Node on the compiled output.

```dockerfile
FROM node:22-alpine
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm exec prisma generate && pnpm run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

Copy the lockfile and install before copying the rest of the source. Docker can then reuse the install layer when only application code changes.

`EXPOSE` documents the port. It does not publish it. Publishing happens when you run the container.

```bash
docker build -t team-api .
docker run --env-file .env -p 3000:3000 team-api
```

`-p 3000:3000` maps port 3000 on your machine to port 3000 inside the container.

Add a `.dockerignore` so `node_modules`, `.env`, and `.git` are not copied into the image. The image should install its own dependencies. It should not contain your secrets.

The tag `node:22-alpine` is the Node version. Pick the version the project uses, and do not let it float to "whatever latest is today."

### Docker Compose

The API also needs PostgreSQL. Compose starts both and puts them on one network.

```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: team
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  pgdata:
```

`depends_on` waits until the database container has started. It does not wait until PostgreSQL accepts connections. The API should retry its first connection, or the first boot can fail because the database was not ready yet.

Local development uses a different file, `docker-compose.async-dev.yml`. It starts PostgreSQL and Redis and does not start the API. You run the API with `pnpm start:dev` on the host. Production and QA each have their own compose file, their own env file, and their own ports. Redis in those files is optional: a profile named `local-redis` when Redis runs in that compose file, and omitted when Redis is shared infrastructure. Inside a compose network the host is the service name, `redis` or `db`, not `localhost`.

### Environment variables

Configuration that changes between machines stays out of the image: the database URL, the JWT secret, the port, third-party keys.

The same image runs in QA and production. Only the environment changes.

```text
DATABASE_URL=postgresql://app:app@db:5432/team
```

Inside Compose, the database hostname is the service name `db`, not `localhost`. Inside the API container, `localhost` is the API container itself.

Do not put secrets in the Dockerfile with `ENV JWT_SECRET=...`. That value is stored in the image, and anyone who can pull the image can read it.

### Networking

Containers on the same Compose network reach each other by service name. Your laptop reaches a container only through a published port.

| From | To | Address |
|---|---|---|
| Your browser | API container | `localhost:3000` |
| API container | Database container | `db:5432` |
| A process inside the API container | itself | `localhost` |

### Volumes

A container's filesystem disappears when the container is removed. PostgreSQL would lose every row.

A volume is storage that outlives the container. `pgdata` above keeps the database files across restarts. Uploaded files that are not in object storage need the same treatment.

Application code does not belong in a volume in production. The image already contains the code you built.

### Application startup

The process in `CMD` is the container. When that process exits, the container exits.

In production that process is the compiled app, `node dist/main.js`. It is not `pnpm run start:dev`. Dev mode watches files and recompiles. That is not what you shipped.

Before the new version serves traffic, run `pnpm prisma migrate deploy` once. That command applies the saved migration files to the database. `pnpm prisma generate` already ran when the image was built. Generate only wrote the TypeScript helper. It did not change any table. If several copies of the API start at once and each runs the same migration, they can conflict. One migration, then start the containers.

### CI/CD

CI (continuous integration) runs on every pull request: install, lint, test, and build. A change that does not build does not merge.

CD (continuous delivery) takes a commit that passed CI and ships the image that was built.

```text
Pull request
    |
    v
CI: install, test, build the image
    |
    v
Image stored in a registry
    |
    v
Deploy that image to QA
    |
    v
Promote the same image to production
```

Build the image once. Do not rebuild from source on the production machine. QA and production then run the bytes you tested.

### QA and production

| | QA | Production |
|---|---|---|
| Purpose | Try the change before users see it | Serve real users |
| Data | A copy, or fake data | Real user data |
| Secrets | QA keys | Production keys |
| Image | The candidate build | The same image, after QA accepts it |

QA is where a broken migration should show up. Production is the wrong place to discover it.

### Deployment and rollback

A deployment starts the new image, applies the migration you planned, and sends traffic to the new containers. Keep the previous image. A rollback starts that image again.

Rollback is straightforward when the migration only adds something the old code can ignore, such as a nullable column or a new table. It is painful when the migration deletes a column the previous version still reads. Prefer migrations the previous version can still run against, so a rollback does not need a second database change in a hurry.

After a deploy, check that the process is up, a known endpoint returns the expected status, error logs are not climbing, and a representative query is still fast. If those fail, roll back, then investigate.

### Exercise

Run the training application using Docker and document the setup process.

---

## Chapter 37: How our projects are built

The earlier chapters teach the ideas. This chapter is the short list of choices our projects actually use. The long version is `docs/BACKEND_ENGINEERING_PLAYBOOK.md` in the project. If a tutorial says something else, follow this chapter.

### The tools

| Job | What we use | In plain words |
|---|---|---|
| The server | NestJS on Fastify | NestJS organizes the code. Fastify is the program that receives web requests. We do not add Express. |
| Installing libraries | pnpm only | One install tool, one lockfile (`pnpm-lock.yaml`). Do not run `npm` or `yarn` in these projects. |
| Saving data | PostgreSQL and Prisma | PostgreSQL is the database. Prisma is the tool the repository uses to read and write it. Table changes go in migration files. Do not push schema changes by hand on a shared database. |
| Ids | `generateId()` | New rows get an id from our function, not from `@default(uuid())`. Our ids sort by time. The built-in default does not. |
| Shared memory | Redis | A counter that every copy of the app can see. We use it to limit how often someone can call login. |
| Logs | Pino | A diary of what the server did. Easy to read on your laptop. Structured records in production. Quiet during tests. |
| API page | Swagger at `/api/docs` | A page that lists the routes so you can try them. It is on only while you are developing. |
| Files | Cloudflare R2 | Photos and documents go here, not into the database. The database stores the file name only. |
| Settings | One checked list of environment variables | If `DATABASE_URL` is missing, the app stops at startup. It does not wait for the first request to crash. |
| Tests | Jest | Small tests live in `test/unit`. Full request tests live in `test/e2e`. Those full tests use fakes for the database and Redis. |
| Style checks | ESLint and Prettier | The project fails if the code uses `any`, or if an `async` call is forgotten. |

`pnpm install` runs `prisma generate`. You do not generate the client by hand after a clone. Generate writes the TypeScript helper. It does not change tables. Updating a shared database is `pnpm prisma migrate deploy`.

### The shape of a feature

```text
Controller  →  Service  →  Repository  →  Prisma
                  ↓
            Media service  →  R2
```

The controller receives the request and sends the answer. The service applies the rules. The repository does the database work: find, save, update, and delete. Shared pieces (settings, logs, errors, Redis, Prisma, ids) live in `src/common`, `src/config`, and `src/logging`. The users feature does not open the teams database code. It calls the teams service.

Normal addresses start with `/api`. Admin addresses start with `/admin`. Do not send the raw database row back. Send the outgoing form. A list looks like `{ data, meta }`.

Every error uses the same shape: `statusCode`, `message`, `errorCode`, `requestId`, `timestamp`, and `path`. The screen looks at `errorCode`, not at the sentence, because the sentence can change.

### What you do not add

- Express, or `@nestjs/platform-express`.
- Morgan, or `console.log` for request logs.
- Swagger in production.
- A secret in source or in the image.
- A file column in PostgreSQL.
- A spec file inside `src/`.
- A second way to build an error JSON in a controller.

`main.ts` only starts the process. `createApp()` in `src/bootstrap/app-bootstrap.ts` registers the Fastify plugins, the validation pipe, Pino, and shutdown hooks. Tests call that same function.

### Exercise

Open the boilerplate repository. For one feature module, name the controller, the service, and the repository, and point to the line that calls `generateId()`. Then find where Swagger is refused outside development, and where `/health` is left out of the Pino access log.

---

## Chapter 38: Shipping checklist

You can let real people use an API when every line below is true. Each line is a chapter you already ran.

| Check | What "done" looks like |
|---|---|
| Settings | The app stops at startup if the database address or the login secret is missing |
| Database | Table changes are saved in migration files and applied the same way everywhere |
| Incoming data | Bad or extra fields are rejected before your function runs |
| Login | Passwords are stored scrambled. Login returns a pass that expires. `GET /me` refuses a caller with no pass |
| Permission | A delete checks the person's role and checks that this row is one they are allowed to touch |
| Errors | Every error has the same fields, including a code and a request id. The database's own error text stays in the log |
| Basic protection | Security headers, a list of allowed websites, and a limit on how often login can be tried |
| Logs | Pino. Easy to read on your laptop, records in production, quiet in tests. No passwords |
| Health | `GET /health` answers `{ status, timestamp }` and those calls are not written in the log |
| Tests | One test for the service rule. One test that sends a real HTTP login |
| Checks on every change | A pull request must pass style, build, and tests before it can merge |
| Release | The same built app is tried in QA, then used in production. The previous build can be started again |

A new route is not finished just because it returns data on your laptop. Walk this table for that route before other people can call it.

### Exercise

Take the Team Management System and mark each row pass or fail. Fix the first failing row before adding another feature.

# PART 8 – FINAL PRACTICAL PROJECT

## Team Management System

Throughout the training, build a Team Management System.

### Required modules

1. Authentication.
2. Users.
3. Teams.
4. Team members.
5. Roles and permissions.
6. Projects.
7. Tasks.
8. File uploads.
9. Notifications.

### Expected technical implementation

- NestJS modules.
- Controllers.
- Services.
- DTOs.
- Validation.
- PostgreSQL.
- Prisma.
- Authentication.
- Authorization.
- Error handling.
- Unit tests.
- E2E tests.
- Swagger documentation.
- Configuration from the environment.
- Health check.
- Docker setup.
- A CI workflow that runs the tests.

### Final submission

Each participant must submit:

1. Working source code.
2. Database schema.
3. API documentation.
4. Automated tests.
5. README with setup instructions.
6. Pull request.
7. Explanation of implementation.

---

# PART 9 – SELF-ASSESSMENT

Use these questions to evaluate your understanding.

## Backend fundamentals

- What is the difference between frontend and backend?
- What happens when a frontend sends an API request?
- What is Node.js?
- What is the event loop?
- Why is asynchronous programming important?

## TypeScript

- What is the difference between JavaScript and TypeScript?
- What is an interface?
- What is a type alias?
- What are access modifiers?
- What are decorators?
- What are generics?

## NestJS

- What is a module?
- What is a controller?
- What is a service?
- What is dependency injection?
- What is a DTO?
- What is the difference between middleware and guards?
- What is the purpose of an interceptor?
- What is an exception filter?

## APIs

- What is REST?
- What is the difference between PUT and PATCH?
- What is the difference between 401 and 403?
- What are query parameters?
- Why do we need pagination?
- Why do we validate data on the backend?

## Databases

- What is a primary key?
- What is a foreign key?
- What is a JOIN?
- What is an index?
- What is a transaction?
- What is an ORM?
- What is Prisma?
- What is a migration, and why do we save it instead of editing the database by hand?
- What is the difference between `pnpm prisma generate` and `pnpm prisma migrate deploy`?
- Where should `DATABASE_URL` live, and what should happen if it is missing at startup?
- Why does the Nest app inject one `PrismaClient` instead of constructing a new one in each service?

## Security

- What is authentication?
- What is authorization?
- What is JWT?
- Why should passwords be hashed?
- What is SQL injection?
- Why should backend APIs not trust frontend validation?

## Testing and production

- What is unit testing?
- What is integration testing?
- What is E2E testing?
- What is Docker?
- What is structured logging?
- How would you investigate a slow API?
- What should `GET /health` return when the database is down?
- Why does CI mock Prisma and Redis instead of pointing at production?

---

# PART 10 – LEARNING RESOURCES

Use official documentation as the primary learning reference.

| Subject | Resource |
|---|---|
| Node.js | https://nodejs.org/en/learn |
| TypeScript | https://www.typescriptlang.org/docs/ |
| NestJS | https://docs.nestjs.com/ |
| NestJS video guides | https://www.youtube.com/playlist?list=PLnsTzQ998QGQRY_8SaeMyd3_RuLyegJyx |
| HTTP | https://developer.mozilla.org/en-US/docs/Web/HTTP |
| PostgreSQL | https://www.postgresql.org/docs/ |
| SQL | https://www.postgresql.org/docs/current/tutorial.html |
| Prisma | https://www.prisma.io/docs |
| Jest | https://jestjs.io/docs/getting-started |
| Fastify | https://fastify.dev/docs/latest/ |
| Docker | https://docs.docker.com/get-started/ |

## Recommended learning approach

Do not try to learn every topic at once.

Follow this sequence:

1. Understand the concept.
2. Read the documentation.
3. Run a small example.
4. Modify the example.
5. Break the example intentionally.
6. Debug the issue.
7. Explain what you learned.

Use AI tools as learning assistants, not as replacements for understanding.

Whenever AI generates code:
- Understand every important line.
- Verify the official API and documentation.
- Check error handling.
- Check security.
- Write or run tests.
- Be prepared to explain the implementation.

---

# Final message to learners

Becoming a backend developer is not simply learning a new framework.

You are learning a different set of engineering responsibilities.

As a frontend developer, you focus heavily on user experience and application interaction.

As a backend developer, you must additionally think about data consistency, security, reliability, concurrency, performance and maintainability.

Take time to understand the fundamentals. Do not rush through the chapters.

Your goal is not to become someone who can generate an API quickly. Your goal is to become someone who understands how the API works, why it works that way and how to maintain it safely.

**Understand first. Implement second. Optimize when necessary.**