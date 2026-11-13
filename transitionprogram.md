# Backend Developer Transition Program
## Internal Training, Knowledge Transfer & Standard Operating Procedures

**Program:** Frontend Developer to Backend Developer  
**Audience:** Existing frontend developers interested in backend development  
**Primary Framework:** NestJS  
**Language:** TypeScript  
**Duration:** 30 guided sessions, 1 hour per session  
**Schedule:** Flexible, based on team availability and progress  
**Training Owner:** Backend Team / Assigned Trainer  
**Approval Authority:** Backend Team Lead

---

# PART 1 — PROGRAM OVERVIEW

## 1.1 Objective

The objective of this program is to prepare existing frontend developers to work on backend applications using NestJS.

Participants must develop the knowledge and practical skills required to:

- Understand backend architecture and server-side responsibilities.
- Write maintainable TypeScript code.
- Understand and work with NestJS architecture.
- Design and develop REST APIs.
- Design relational databases and write SQL queries.
- Work with PostgreSQL and Prisma ORM.
- Implement authentication and authorization.
- Write automated tests.
- Debug backend applications.
- Understand security, performance and production considerations.
- Follow company backend development standards.

## 1.2 Expected outcomes

After completing the program, participants should be able to independently:

1. Understand an existing NestJS project.
2. Identify the responsibility of modules, controllers, services and providers.
3. Implement CRUD APIs.
4. Validate incoming requests.
5. Perform database operations using Prisma.
6. Implement basic authentication and authorization.
7. Handle errors appropriately.
8. Write unit and integration tests.
9. Debug application issues.
10. Submit a properly structured backend pull request.

## 1.3 Technology stack

| Technology | Purpose |
|---|---|
| JavaScript | Existing programming foundation |
| TypeScript | Primary backend programming language |
| Node.js | JavaScript runtime |
| NestJS | Backend application framework |
| Fastify | HTTP platform |
| PostgreSQL | Relational database |
| Prisma | Database ORM |
| Jest | Automated testing |
| Swagger | API documentation |
| Docker | Application containerization |
| Git & GitHub | Version control and collaboration |

The training should use versions and configurations compatible with the company's actual backend repositories.

---

# PART 2 — TRAINING STRUCTURE

## 2.1 Program duration

The program consists of 30 guided sessions.

- Each session: 60 minutes.
- Sessions can be conducted according to company availability.
- Five sessions per week is the suggested pace, not a mandatory schedule.
- Participants must complete assignments before moving to dependent topics.
- Additional revision sessions can be scheduled when required.

The program is competency-based rather than calendar-based.

## 2.2 Training methodology

Each session should contain:

| Activity | Duration |
|---|---:|
| Previous session revision | 10 minutes |
| Concept explanation | 20 minutes |
| Live coding / project walkthrough | 15 minutes |
| Hands-on exercise | 10 minutes |
| Assignment and recap | 5 minutes |
| **Total** | **60 minutes** |

## 2.3 Training levels

Participants will be classified according to their initial assessment.

**Level A – Foundation required**

For participants with little or no backend experience. They must complete the full learning path.

**Level B – Intermediate**

For participants who understand basic APIs, HTTP and databases. They may move faster through familiar concepts but must complete practical assessments.

**Level C – Advanced learner**

For participants with previous backend experience. They may demonstrate competency through assessments and spend more time on architecture, security, testing and production practices.

All participants must pass the same final competency requirements.

---

# PART 3 — INITIAL ASSESSMENT

Before starting the training, conduct an initial assessment.

## 3.1 Assessment topics

| Area | Assessment |
|---|---|
| JavaScript | Promises, async/await, error handling |
| TypeScript | Interfaces, types, classes, generics |
| HTTP | Methods, headers, status codes |
| APIs | REST principles and request/response |
| Database | Tables, primary keys, foreign keys, JOIN |
| Git | Branching, commits, pull requests |
| Backend | Previous experience developing APIs |

## 3.2 Initial practical assessment

Ask participants to:

1. Explain what happens when a frontend application makes an API request.
2. Explain GET, POST, PUT, PATCH and DELETE.
3. Write an asynchronous JavaScript function.
4. Explain how they would handle a failed API request.
5. Write a basic SQL SELECT query.
6. Explain the difference between authentication and authorization.

## 3.3 Assessment outcome

Record each participant's strengths and knowledge gaps.

Do not assume that someone who can consume APIs from React understands how APIs are designed and implemented.

---

# PART 4 — TRAINING CURRICULUM

## MODULE 1 — JavaScript for Backend & TypeScript

**Sessions 1–5**

### Session 1: Understanding backend development

Topics:
- What is backend development?
- Frontend vs backend responsibilities.
- Client-server architecture.
- Request and response lifecycle.
- What happens when a user interacts with an application?
- Responsibilities of a backend developer.
- Introduction to Node.js.

Trainer demonstration:
Trace one real application workflow from the frontend request to the database response.

Assignment:
Draw the architecture of a simple application and explain its request lifecycle.

### Session 2: Asynchronous JavaScript

Topics:
- Synchronous vs asynchronous execution.
- Callbacks.
- Promises.
- async/await.
- Event loop.
- Microtasks and macrotasks.
- Promise.all and Promise.allSettled.
- Concurrent operations and error handling.

Assignment:
Implement multiple asynchronous operations and handle their success and failure scenarios.

### Session 3: JavaScript error handling

Topics:
- try/catch/finally.
- Throwing errors.
- Promise rejection.
- Error propagation.
- Custom errors.
- Handling unexpected failures.
- Avoiding swallowed exceptions.

Assignment:
Build an asynchronous service with proper error handling.

### Session 4: TypeScript fundamentals

Topics:
- Why TypeScript?
- Type annotations.
- Type inference.
- Primitive and object types.
- Interfaces.
- Type aliases.
- Union and intersection types.
- Optional properties.
- Enums.
- Type narrowing.

Assignment:
Convert a small JavaScript module into TypeScript.

### Session 5: TypeScript for NestJS

Topics:
- Classes and objects.
- Constructors.
- Access modifiers.
- Static members.
- Inheritance.
- Abstract classes.
- Generics.
- Decorators.
- Metadata.
- Dependency injection concepts.

Assignment:
Create a small TypeScript application using classes, interfaces and dependency injection concepts.

**Module completion criteria:** Participants can understand and write basic TypeScript code and understand asynchronous execution.

---

## MODULE 2 — HTTP, REST APIs & NestJS Architecture

**Sessions 6–10**

### Session 6: HTTP fundamentals

Topics:
- HTTP request and response.
- HTTP methods.
- Status codes.
- Headers.
- Request body.
- Query parameters.
- Path parameters.
- Cookies.
- Content types.
- Stateless communication.

Assignment:
Inspect API requests using browser developer tools or Postman.

### Session 7: REST API design

Topics:
- REST principles.
- Resource-oriented endpoints.
- GET, POST, PUT, PATCH and DELETE.
- Status code selection.
- Pagination.
- Filtering.
- Sorting.
- API response standards.
- API versioning concepts.

Assignment:
Design REST endpoints for a user management application.

### Session 8: Introduction to NestJS

Topics:
- What is NestJS?
- Why NestJS?
- NestJS architecture.
- NestJS CLI.
- Project creation.
- Application bootstrap.
- Project structure.
- Configuration.
- HTTP platform adapters.

Trainer demonstration:
Create a NestJS project and explain the purpose of every important generated file.

### Session 9: Modules and controllers

Topics:
- What is a module?
- What is a controller?
- Routing.
- Route decorators.
- Request parameters.
- Query parameters.
- Request body.
- Module imports and exports.
- Organizing application features.

Assignment:
Create UserModule and ProductModule with basic endpoints.

### Session 10: Providers, services and dependency injection

Topics:
- What is a provider?
- What is a service?
- Dependency injection.
- Constructor injection.
- Injectable decorator.
- Provider registration.
- Module-level providers.
- Dependency relationships.
- Separation of concerns.

Trainer demonstration:
Implement a controller that calls a service, which uses another provider.

Assignment:
Implement a modular CRUD API using controllers and services.

**Module completion criteria:** Participants understand the NestJS request flow and can create basic modules, controllers and services.

---

## MODULE 3 — API DEVELOPMENT & NESTJS REQUEST LIFECYCLE

**Sessions 11–15**

### Session 11: DTOs and validation

Topics:
- Data Transfer Objects.
- DTO classes.
- class-validator.
- class-transformer.
- ValidationPipe.
- Required and optional fields.
- Nested validation.
- Whitelisting.
- Transforming incoming values.
- Validation error responses.

Assignment:
Create CreateUserDto and UpdateUserDto with appropriate validation.

### Session 12: NestJS request lifecycle

Topics:
- Middleware.
- Guards.
- Pipes.
- Interceptors.
- Exception filters.
- Execution order.
- Appropriate use cases for each.
- Global vs route-level configuration.

Assignment:
Implement a request logging middleware and a simple authorization guard.

### Session 13: Exception handling

Topics:
- Built-in HTTP exceptions.
- BadRequestException.
- NotFoundException.
- UnauthorizedException.
- ForbiddenException.
- ConflictException.
- InternalServerErrorException.
- Custom exceptions.
- Global exception filters.
- Proper error responses.

Assignment:
Implement proper exception handling for a CRUD application.

### Session 14: API standards and documentation

Topics:
- Standard response structures.
- HTTP status codes.
- Pagination.
- Filtering and sorting.
- Swagger/OpenAPI.
- API documentation.
- Query validation.
- API versioning.

Assignment:
Document the CRUD application using Swagger.

### Session 15: File uploads and external integrations

Topics:
- Multipart requests.
- File upload handling.
- File validation.
- File size limits.
- MIME type validation.
- Local storage vs object storage.
- External API integrations.
- Timeouts and failure handling.

Assignment:
Implement a basic file upload endpoint in the training application.

**Module completion criteria:** Participants can build validated, documented APIs with proper request handling and error management.

---

## MODULE 4 — DATABASE & PRISMA

**Sessions 16–20**

### Session 16: Database fundamentals

Topics:
- What is a relational database?
- Database, schema and table.
- Rows and columns.
- Primary keys.
- Foreign keys.
- Unique constraints.
- Relationships.
- One-to-one.
- One-to-many.
- Many-to-many.

Assignment:
Design a basic database for users, teams and tasks.

### Session 17: SQL fundamentals

Topics:
- SELECT.
- INSERT.
- UPDATE.
- DELETE.
- WHERE.
- ORDER BY.
- GROUP BY.
- JOIN.
- Aggregate functions.
- Subqueries.

Assignment:
Write SQL queries for a team management database.

### Session 18: PostgreSQL

Topics:
- PostgreSQL introduction.
- Data types.
- Constraints.
- Relationships.
- Indexes.
- Normalization.
- Transactions.
- Query execution concepts.
- Basic EXPLAIN analysis.

Assignment:
Create tables with appropriate relationships and constraints.

### Session 19: Prisma ORM

Topics:
- What is an ORM?
- Prisma introduction.
- Prisma schema.
- Models.
- Fields and attributes.
- Prisma Client.
- CRUD operations.
- Relations.
- Filtering and sorting.
- Generated client.

Assignment:
Connect the NestJS application to PostgreSQL using Prisma.

### Session 20: Advanced Prisma and database operations

Topics:
- Prisma migrations.
- Schema changes.
- Transactions.
- Nested writes.
- Interactive transactions.
- Pagination.
- Query optimization.
- Avoiding unnecessary queries.
- Connection pooling.
- Safe database changes.

Assignment:
Implement a transactional operation involving multiple related records.

**Module completion criteria:** Participants can design relational tables and perform database operations through Prisma.

---

## MODULE 5 — AUTHENTICATION, SECURITY & TESTING

**Sessions 21–25**

### Session 21: Authentication fundamentals

Topics:
- Authentication vs authorization.
- Password hashing.
- JWT.
- Access tokens.
- Refresh tokens.
- Cookie-based authentication.
- Token expiration.
- Secure password storage.

Assignment:
Implement a basic registration and login flow.

### Session 22: Authorization

Topics:
- Guards.
- Roles.
- Permissions.
- Role-based access control.
- Resource ownership.
- Route protection.
- Authorization checks in business logic.

Assignment:
Implement Admin, Manager and Member roles.

### Session 23: Backend security

Topics:
- OWASP Top 10 overview.
- SQL injection.
- Broken access control.
- Sensitive data exposure.
- CORS.
- Rate limiting.
- Input validation.
- Secrets management.
- Password security.
- Secure error handling.

Assignment:
Review a deliberately insecure API and identify vulnerabilities.

### Session 24: Unit testing

Topics:
- Why testing matters.
- Jest fundamentals.
- Test suites.
- Test cases.
- Assertions.
- Unit testing services.
- Mocking dependencies.
- Testing exception scenarios.
- Test coverage.

Assignment:
Write unit tests for a service with success and failure scenarios.

### Session 25: Integration and E2E testing

Topics:
- Unit vs integration vs E2E testing.
- NestJS testing utilities.
- HTTP endpoint testing.
- Database test environments.
- Test fixtures.
- Test isolation.
- Cleanup.
- CI testing concepts.

Assignment:
Write E2E tests for registration, login and protected endpoints.

**Module completion criteria:** Participants can implement basic authentication and authorization, understand common security risks and write automated tests.

---

## MODULE 6 — ARCHITECTURE, PRODUCTION & PROJECT KT

**Sessions 26–30**

### Session 26: Backend architecture and code quality

Topics:
- Separation of concerns.
- SOLID principles.
- Single responsibility principle.
- Modular architecture.
- Service responsibilities.
- Reusable providers.
- Avoiding tightly coupled modules.
- Naming conventions.
- File organization.
- Maintainability.

Assignment:
Refactor a poorly structured NestJS module.

### Session 27: Logging, debugging and performance

Topics:
- Application logging.
- Structured logs.
- Log levels.
- Debugging NestJS applications.
- Request tracing concepts.
- Performance bottlenecks.
- Slow database queries.
- N+1 query problems.
- Memory and CPU considerations.
- Error investigation.

Assignment:
Investigate and fix a deliberately introduced API performance or logic issue.

### Session 28: Docker and deployment

Topics:
- Docker fundamentals.
- Dockerfile.
- Docker Compose.
- Environment variables.
- Configuration management.
- Application startup.
- Database connectivity.
- Build process.
- CI/CD overview.
- QA vs production environments.
- Rollback concepts.

Assignment:
Run the training application using Docker and document its setup process.

### Session 29: Existing project knowledge transfer

Topics:
- Existing project architecture.
- Module structure.
- Database schema.
- Authentication implementation.
- Common business workflows.
- External integrations.
- Background jobs.
- Caching.
- Logging.
- Deployment architecture.
- Monitoring.
- Existing coding conventions.

Trainer demonstration:
Walk through one real feature from its API endpoint to the database and back to the frontend.

Assignment:
Explain an existing backend feature, including its request flow, business logic and database interactions.

### Session 30: Final practical assessment

Participants must independently implement an assigned backend feature.

Requirements:
- Create or modify a NestJS module.
- Implement controllers and services.
- Define and validate DTOs.
- Perform Prisma operations.
- Handle exceptions.
- Implement appropriate authorization.
- Write unit tests.
- Write relevant E2E tests.
- Document the API.
- Submit a pull request.

**Module completion criteria:** Participants demonstrate that they can work on a real backend feature with appropriate supervision.

---

# PART 5 — TRAINING PROJECT

## 5.1 Project: Team Management System

A dedicated training repository should be created for this program.

The project will progressively introduce real-world backend development concepts.

### Features

1. User registration and login.
2. User profile management.
3. Team creation.
4. Team membership management.
5. Role and permission management.
6. Project creation.
7. Task creation and assignment.
8. Task status management.
9. Pagination, filtering and sorting.
10. File uploads.
11. Notifications.
12. Automated tests.

### Suggested architecture

- NestJS application.
- TypeScript.
- Fastify adapter.
- PostgreSQL.
- Prisma.
- JWT authentication.
- Jest.
- Swagger.
- Docker.

### Development progression

| Stage | Features |
|---|---|
| Foundation | Project setup, modules, controllers, services |
| API development | CRUD, validation, exception handling |
| Database | PostgreSQL, Prisma, relationships |
| Security | Authentication and authorization |
| Testing | Unit, integration and E2E |
| Production | Docker, logging and deployment |

Participants should build the same project throughout the program instead of completing disconnected examples.

---

# PART 6 — BACKEND DEVELOPMENT SOP

## 6.1 Purpose

This SOP establishes the minimum standards and procedures for anyone contributing to company backend repositories.

It applies to:
- New backend developers.
- Frontend developers transitioning to backend.
- Junior backend developers.
- Developers contributing to existing NestJS projects.

## 6.2 General principles

Every backend developer must:

1. Understand existing project architecture before making changes.
2. Follow existing project conventions.
3. Write readable and maintainable code.
4. Keep business logic separate from HTTP handling.
5. Validate incoming data.
6. Handle errors explicitly.
7. Protect sensitive information.
8. Consider database consistency.
9. Write appropriate automated tests.
10. Understand the impact of changes before submitting a PR.

## 6.3 Language and coding standards

- TypeScript must be used for new backend code.
- Avoid using `any` unless there is a justified reason.
- Prefer explicit types for function parameters and return values where useful.
- Use interfaces and type aliases appropriately.
- Follow existing naming conventions.
- Avoid unnecessary code duplication.
- Keep functions focused on a single responsibility.
- Avoid excessively large classes and files.
- Use ESLint and Prettier configurations defined by the project.
- Do not disable linting rules just to make code pass.

## 6.4 NestJS architecture standards

### Modules

- Organize code around application features.
- Each feature should have a clearly defined module.
- Avoid putting unrelated functionality into a single module.
- Import and export providers intentionally.
- Avoid circular dependencies.

### Controllers

- Controllers are responsible for handling incoming HTTP requests.
- Keep controllers thin.
- Do not implement complex business logic in controllers.
- Delegate business operations to services.
- Validate and document request inputs.

### Services

- Business logic should generally reside in services.
- Services should have clearly defined responsibilities.
- Avoid unnecessary dependencies.
- Use dependency injection instead of manually constructing dependencies.
- Do not mix unrelated business operations into one service.

### DTOs

- Use DTO classes for request validation.
- Validate all externally supplied inputs.
- Use separate DTOs for create and update operations where appropriate.
- Do not rely only on frontend validation.

### Providers and integrations

- Keep external integrations behind dedicated providers or service abstractions.
- Handle external API failures and timeouts.
- Do not hardcode credentials or endpoints that should be configuration-driven.

## 6.5 API development standards

- Follow REST conventions.
- Use appropriate HTTP methods.
- Use appropriate HTTP status codes.
- Validate path parameters, query parameters and request bodies.
- Implement pagination for potentially large collections.
- Support filtering and sorting where appropriate.
- Document endpoints through Swagger where the project requires it.
- Maintain backward compatibility when modifying existing APIs.
- Never expose internal stack traces to clients.

## 6.6 Database standards

- Understand the existing schema before modifying it.
- Use Prisma consistently in projects that use Prisma.
- Follow existing ID-generation conventions.
- Define proper relationships and constraints.
- Add indexes based on query patterns.
- Use transactions when multiple operations must succeed or fail together.
- Avoid unnecessary database queries.
- Avoid loading large datasets into application memory.
- Review migrations before applying them.
- Never manually modify shared or production databases without authorization.
- Consider rollback and data compatibility before schema changes.

## 6.7 Authentication and authorization standards

- Authentication and authorization must be treated separately.
- Protect all endpoints that require access control.
- Never rely on frontend restrictions as backend authorization.
- Verify resource ownership where required.
- Do not expose passwords, tokens or secrets.
- Store passwords using secure password-hashing algorithms.
- Keep token verification and authorization logic consistent.
- Follow the existing project authentication architecture.

## 6.8 Error handling and logging

- Handle expected failures using appropriate exceptions.
- Avoid empty catch blocks.
- Do not silently ignore failed database operations.
- Use meaningful error messages.
- Log sufficient information for debugging.
- Never log passwords, access tokens or sensitive personal data.
- Use appropriate log levels.
- Avoid unnecessary console statements in production code.

## 6.9 Testing standards

New backend features must have appropriate tests.

Minimum expectations:
- Unit tests for important business logic.
- Tests for validation and error scenarios.
- Integration or E2E tests for critical API workflows.
- Regression tests for bug fixes where appropriate.

All relevant automated tests must pass before merging.

## 6.10 Git and pull request standards

- Work on assigned feature or bug-fix branches.
- Do not directly commit to protected branches.
- Use meaningful commit messages.
- Keep PRs focused.
- Explain the problem and solution.
- Mention relevant API or database changes.
- Include testing details.
- Address reviewer feedback.
- Do not merge your own backend PR without the required approval.

## 6.11 Deployment standards

- Validate changes in the designated development or QA environment.
- Never deploy directly to production without authorization.
- Follow the existing CI/CD workflow.
- Verify environment configuration.
- Review database migration impact.
- Monitor relevant logs after deployment.
- Understand the rollback procedure.
- Never use production credentials in local development.

---

# PART 7 — RESTRICTIONS FOR TRAINEES

Until formal approval, trainees must not independently:

1. Modify production databases.
2. Execute production database migrations.
3. Deploy backend changes to production.
4. Modify authentication or authorization architecture.
5. Change critical business logic.
6. Modify shared infrastructure configuration.
7. Change CI/CD pipelines.
8. Delete or modify existing data.
9. Introduce new production dependencies without review.
10. Merge backend PRs without an approved reviewer.

Trainees must use designated development environments and approved test data.

These restrictions can be relaxed only through explicit authorization.

---

# PART 8 — ASSESSMENT & EVALUATION

## 8.1 Weekly assessment

| Assessment | Frequency |
|---|---|
| Conceptual questions | After each module |
| Practical assignments | Throughout training |
| Code review | Every practical assignment |
| Knowledge explanation | Weekly |
| Final practical examination | End of program |

## 8.2 Final evaluation

| Category | Weight |
|---|---:|
| Backend fundamentals | 10% |
| TypeScript | 10% |
| NestJS architecture | 20% |
| API development | 15% |
| Database and Prisma | 15% |
| Authentication and security | 10% |
| Testing and debugging | 10% |
| Code quality and explanation | 10% |
| **Total** | **100%** |

Suggested passing score: 75%.

A passing score alone is insufficient if a participant demonstrates a critical security, authorization or database safety failure.

## 8.3 Practical evaluation

The participant must:

- Understand the assigned requirement.
- Design an appropriate API.
- Implement the feature.
- Design or modify database models when necessary.
- Validate inputs.
- Handle errors.
- Apply appropriate security checks.
- Write tests.
- Explain the implementation.
- Respond to code review feedback.

---

# PART 9 — BACKEND ACCESS APPROVAL

## 9.1 Developer progression

### Level 0 — Observer

- Can read the backend codebase.
- Can attend project KT.
- Can understand the architecture.
- Cannot submit changes to shared backend projects.

### Level 1 — Trainee

- Can work on the training repository.
- Can implement isolated modules.
- Can submit supervised PRs.
- Cannot independently modify production code.

### Level 2 — Supervised backend contributor

- Can handle assigned low-risk backend tasks.
- Can submit PRs to actual project repositories.
- Requires mandatory backend review.
- Can test changes in QA.
- Cannot deploy independently.

### Level 3 — Approved backend contributor

- Can own assigned backend features.
- Can implement database changes with review.
- Can debug and maintain backend modules.
- Can participate in production support under normal company authorization policies.

Progression is based on demonstrated competency, not attendance or time spent in the program.

## 9.2 Final approval checklist

- [ ] Completed mandatory training modules.
- [ ] Passed TypeScript assessment.
- [ ] Understands NestJS architecture.
- [ ] Can independently build CRUD APIs.
- [ ] Understands PostgreSQL relationships.
- [ ] Can perform Prisma operations.
- [ ] Understands authentication and authorization.
- [ ] Can write automated tests.
- [ ] Understands error handling and logging.
- [ ] Can debug an API issue.
- [ ] Completed the final practical project.
- [ ] Submitted an approved backend PR.
- [ ] Received backend reviewer approval.

---

# PART 10 — KNOWLEDGE TRANSFER CHECKLIST

Before assigning someone to an actual project, the assigned backend developer or mentor must cover:

### Project overview
- [ ] Project purpose and business requirements.
- [ ] Application architecture.
- [ ] Module structure.
- [ ] Coding conventions.
- [ ] Environment setup.

### Database
- [ ] Database structure.
- [ ] Important models and relationships.
- [ ] Prisma schema.
- [ ] Migrations.
- [ ] Important queries and transactions.

### API development
- [ ] API conventions.
- [ ] Request/response formats.
- [ ] Validation.
- [ ] Exception handling.
- [ ] Authentication and authorization.

### Infrastructure
- [ ] Environment variables.
- [ ] Docker setup.
- [ ] Local development.
- [ ] QA deployment workflow.
- [ ] CI/CD.
- [ ] Logging and monitoring.

### Business logic
- [ ] Important application workflows.
- [ ] External integrations.
- [ ] Background jobs.
- [ ] Scheduled tasks.
- [ ] Caching.
- [ ] Known limitations and technical debt.

The KT should be specific to the project they will work on. Completing generic NestJS training does not replace project-specific knowledge transfer.

---

# PART 11 — TRAINER RESPONSIBILITIES

The assigned trainer is responsible for:

1. Preparing each session.
2. Explaining concepts using practical examples.
3. Demonstrating concepts in NestJS.
4. Reviewing assignments.
5. Identifying knowledge gaps.
6. Providing additional guidance when needed.
7. Tracking individual progress.
8. Conducting assessments.
9. Providing feedback.
10. Recommending readiness for backend contribution.

The trainer should not mark a module complete solely because the session was conducted.

## 11.1 Training records

Maintain the following information for every participant:

| Field | Description |
|---|---|
| Participant | Developer name |
| Current level | Foundation / Intermediate / Advanced |
| Session completed | Session number |
| Assignment status | Pending / Submitted / Approved |
| Assessment score | Score obtained |
| Knowledge gaps | Areas requiring revision |
| Mentor feedback | Reviewer comments |
| Approval status | Not approved / Supervised / Approved |

---

# PART 12 — PROGRAM SUCCESS CRITERIA

The program is considered successful when:

- Participants understand backend engineering fundamentals.
- Participants can write TypeScript confidently.
- Participants understand NestJS architecture.
- Participants can build and test APIs.
- Participants understand database design and Prisma.
- Participants follow security and coding standards.
- Participants can understand an existing backend project.
- Participants can independently complete an assigned low-risk backend feature under the appropriate review process.

**Final principle:**

Backend development is not just about creating API endpoints. It involves data integrity, security, business logic, scalability, reliability and maintainability.

The goal of this program is to build developers who understand these responsibilities and can contribute safely to the company's backend systems.

---

**Document ownership:** Backend Engineering Team  
**Review frequency:** Every six months or whenever major engineering standards change  
**Approval:** Backend Team Lead