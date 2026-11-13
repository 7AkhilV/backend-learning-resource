function Figure({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="learn-figure">
      <figcaption>
        <span className="stamp">{kicker}</span>
        <strong>{title}</strong>
      </figcaption>
      {children}
    </figure>
  );
}

function Flow({ steps }: { steps: { name: string; detail: string }[] }) {
  return (
    <ol className="flow">
      {steps.map((step, index) => (
        <li key={step.name}>
          <span className="flow-n">{index + 1}</span>
          <span>
            <strong>{step.name}</strong>
            <small>{step.detail}</small>
          </span>
        </li>
      ))}
    </ol>
  );
}

function RequestMap() {
  return (
    <Figure kicker="Map" title="One login, three stops">
      <Flow
        steps={[
          { name: "Frontend", detail: "The login form collects email and password." },
          { name: "HTTP request", detail: "The browser sends that data to an API URL." },
          { name: "Controller", detail: "NestJS receives the request. It does not hold the business rules." },
          { name: "Validation", detail: "The backend checks the shape of the data before using it." },
          { name: "Service", detail: "The service looks up the user and checks the password hash." },
          { name: "Database", detail: "PostgreSQL stores the user. The frontend never talks to it." },
          { name: "HTTP response", detail: "The API returns a token or an error. The form shows the result." },
        ]}
      />
    </Figure>
  );
}

function Tradeoffs() {
  const tools = [
    {
      name: "npm",
      ours: false,
      pros: ["Ships with Node", "What most docs print", "Lockfile and workspaces"],
      cons: ["Phantom dependencies from hoisting", "A full copy in every project"],
    },
    {
      name: "yarn",
      ours: false,
      pros: ["Lockfile and offline cache", "Workspaces for multi-package repos"],
      cons: ["Classic and Berry behave differently", "Berry Plug'n'Play breaks some tools"],
    },
    {
      name: "pnpm",
      ours: true,
      pros: ["One copy on disk, linked into each repo", "Only declared packages can be imported"],
      cons: ["Installed separately from Node", "npm tutorials fail until you add the package"],
    },
  ];

  return (
    <Figure kicker="Compare" title="Why the strict one is the one we use">
      <div className="pm-grid">
        {tools.map((tool) => (
          <article key={tool.name} className={tool.ours ? "pm-card ours" : "pm-card"}>
            <p>{tool.ours ? "Our projects" : "Same registry"}</p>
            <h3>{tool.name}</h3>
            <h4>Pros</h4>
            <ul>
              {tool.pros.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h4>Cons</h4>
            <ul>
              {tool.cons.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="figure-note">
        pnpm’s strict <code>node_modules</code> is the reason. An import you did not declare fails here, instead of failing later on another machine.
      </p>
    </Figure>
  );
}

function AsyncMap() {
  return (
    <Figure kicker="Map" title="Wait in order, or run side by side">
      <div className="split">
        <article>
          <h3>One depends on the other</h3>
          <ol className="mini-flow">
            <li>Fetch the user</li>
            <li>Then fetch that user’s orders</li>
          </ol>
          <p>The second call needs the id from the first, so it waits.</p>
        </article>
        <article>
          <h3>Neither needs the other</h3>
          <ol className="mini-flow side">
            <li>Fetch users</li>
            <li>Fetch products</li>
          </ol>
          <p>
            <code>Promise.all</code> starts both, then continues when both have settled.
          </p>
        </article>
      </div>
      <p className="figure-note">
        A database call takes time. The event loop lets Node accept other work during that wait, instead of freezing the process.
      </p>
    </Figure>
  );
}

function RequestPath({ media = false }: { media?: boolean }) {
  const steps = [
    { name: "Browser", detail: "Sends the request. Example: POST /api/users with a name and an email." },
    { name: "Controller", detail: "The door. It receives the request and later sends the status code. It does not decide the rules." },
    { name: "Request DTO", detail: "The form coming in. Only the listed fields get through. Extra fields are thrown away." },
    { name: "Service", detail: "The rules. If that email is already used, it stops here. Nothing is saved." },
    { name: "Repository", detail: "The database worker. It finds, adds, changes, or deletes a row. Prisma is the tool it uses." },
    { name: "Database", detail: "PostgreSQL stores the row. The browser never talks to it." },
  ];

  return (
    <Figure kicker="Map" title={media ? "Who is allowed to talk to whom" : "How one request moves"}>
      <ol className="path">
        {steps.map((step) => (
          <li key={step.name}>
            <strong>{step.name}</strong>
            <span>{step.detail}</span>
          </li>
        ))}
      </ol>
      {media ? (
        <div className="path-side">
          <p>A photo does not go down this line.</p>
          <p>
            The service asks the <strong>media service</strong>. That service saves the file in online storage called R2. The controller does not upload it.
          </p>
        </div>
      ) : null}
      <p className="figure-note">
        The answer walks back up the same line. The response DTO is a second form. It lists only the fields sent back. The stored password is not on that form.
      </p>
    </Figure>
  );
}

function ModuleMap() {
  const pieces = [
    { name: "Controller", detail: "The door. Routes such as GET /users." },
    { name: "DTOs", detail: "The forms. Fields allowed in, and fields sent back." },
    { name: "Service", detail: "The rules. Nest hands this to the controller." },
    { name: "Repository", detail: "Finds, adds, changes, and deletes rows." },
  ];

  return (
    <Figure kicker="Map" title="One feature lives in one module">
      <p className="nest-label">AppModule imports UsersModule</p>
      <div className="nest-box">
        <p className="nest-label">UsersModule</p>
        <div className="nest-row quad">
          {pieces.map((piece) => (
            <article key={piece.name}>
              <h3>{piece.name}</h3>
              <p>{piece.detail}</p>
            </article>
          ))}
        </div>
      </div>
      <p className="figure-note">
        Teams live in TeamsModule. The users code does not open the teams files. If it needs teams, it asks the teams module.
      </p>
    </Figure>
  );
}

function DtoPair() {
  return (
    <Figure kicker="Map" title="Two forms, not one">
      <div className="split">
        <article>
          <p>Coming in</p>
          <h3>CreateUserDto</h3>
          <ul className="fields">
            <li>name</li>
            <li>email</li>
            <li className="dropped">
              <span>role</span> not on this form, so it is dropped
            </li>
          </ul>
        </article>
        <article>
          <p>Going out</p>
          <h3>UserResponseDto</h3>
          <ul className="fields">
            <li>id</li>
            <li>name</li>
            <li>email</li>
            <li className="dropped">
              <span>password</span> never sent back
            </li>
          </ul>
        </article>
      </div>
      <p className="figure-note">
        The check happens before the service runs. A bad email never reaches the rule that saves a user.
      </p>
    </Figure>
  );
}

function PnpmCommands() {
  return (
    <Figure kicker="Commands" title="Create the app with pnpm">
      <table className="cmd">
        <thead>
          <tr>
            <th>Job</th>
            <th>What we run</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Create the app</td>
            <td>
              <code>pnpm dlx @nestjs/cli new backend-training</code>
            </td>
          </tr>
          <tr>
            <td>Install</td>
            <td>
              <code>pnpm install</code>
            </td>
          </tr>
          <tr>
            <td>Start in dev</td>
            <td>
              <code>pnpm run start:dev</code>
            </td>
          </tr>
        </tbody>
      </table>
    </Figure>
  );
}

function InjectionMap() {
  return (
    <Figure kicker="Map" title="Nest hands the service to the controller">
      <ol className="mini-flow">
        <li>You declare UsersService in the module providers.</li>
        <li>Nest creates one instance.</li>
        <li>The controller asks for it in the constructor.</li>
        <li>Nest passes that instance in. The controller does not call <code>new</code>.</li>
      </ol>
    </Figure>
  );
}

function Pipeline() {
  return (
    <Figure kicker="Map" title="Order of a NestJS request">
      <Flow
        steps={[
          { name: "Middleware", detail: "Early request work, such as logging." },
          { name: "Guard", detail: "Decides whether this caller is allowed to continue." },
          { name: "Pipe", detail: "Validates and transforms the incoming values." },
          { name: "Controller", detail: "The route handler. It calls a service." },
          { name: "Interceptor", detail: "Wraps the handler. Useful for timing or shaping the response." },
          { name: "Exception filter", detail: "Turns a thrown error into the HTTP response the client sees." },
        ]}
      />
    </Figure>
  );
}

function Relationships() {
  return (
    <Figure kicker="Map" title="How rows point at each other">
      <div className="rel-grid">
        <article>
          <h3>One to one</h3>
          <p className="pair">
            <span>User</span>
            <span>1 — 1</span>
            <span>Profile</span>
          </p>
          <p>One user has one profile.</p>
        </article>
        <article>
          <h3>One to many</h3>
          <p className="pair">
            <span>User</span>
            <span>1 — *</span>
            <span>Orders</span>
          </p>
          <p>One user has many orders. Each order points back with a foreign key.</p>
        </article>
        <article>
          <h3>Many to many</h3>
          <p className="pair">
            <span>Student</span>
            <span>* — *</span>
            <span>Course</span>
          </p>
          <p>A join table holds each student-course pair.</p>
        </article>
      </div>
    </Figure>
  );
}

function TransactionMap() {
  return (
    <Figure kicker="Map" title="Both steps commit, or neither does">
      <div className="tx">
        <p>Transfer 100 from Account A to Account B</p>
        <ol>
          <li>Deduct 100 from A</li>
          <li>Add 100 to B</li>
        </ol>
        <p>If step 2 fails, the database rolls step 1 back. A is not charged for a transfer that never arrived.</p>
      </div>
    </Figure>
  );
}

function AuthMap() {
  return (
    <Figure kicker="Map" title="Who is this caller?">
      <Flow
        steps={[
          { name: "Credentials", detail: "The client sends email and password." },
          { name: "Lookup", detail: "The service loads the user row." },
          { name: "Hash check", detail: "The stored password is a hash. Plain text is never compared or saved." },
          { name: "Token", detail: "A valid password produces a signed JWT with an expiry." },
          { name: "Later requests", detail: "The client sends the token. The API checks the signature, not the password again." },
        ]}
      />
    </Figure>
  );
}

function AuthzMap() {
  return (
    <Figure kicker="Map" title="A valid login can still be refused">
      <div className="split">
        <article>
          <h3>Authentication</h3>
          <p>The token is valid. The API knows who is calling. A bad or missing token is 401.</p>
        </article>
        <article>
          <h3>Authorization</h3>
          <p>The caller is known, and this role still cannot do this action. That refusal is 403.</p>
        </article>
      </div>
    </Figure>
  );
}

function TestLayers() {
  return (
    <Figure kicker="Map" title="Three distances from the real app">
      <ol className="layers">
        <li>
          <strong>Unit</strong>
          <span>One function. Collaborators are fakes. Fast, and narrow.</span>
        </li>
        <li>
          <strong>Integration</strong>
          <span>A few real parts together, often the service and the database.</span>
        </li>
        <li>
          <strong>End to end</strong>
          <span>HTTP in, HTTP out. Register, log in, then call a protected route.</span>
        </li>
      </ol>
    </Figure>
  );
}

const FIGURES: Record<string, () => React.JSX.Element> = {
  "what-is-backend-development": RequestMap,
  "asynchronous-javascript": AsyncMap,
  "introduction-to-nestjs": () => <RequestPath />,
  "modules-and-controllers": ModuleMap,
  "dtos-and-validation": DtoPair,
  "architecture-and-code-quality": () => <RequestPath media />,
  "services-and-dependency-injection": InjectionMap,
  "middleware-guards-pipes-interceptors-and-filters": Pipeline,
  "database-fundamentals": Relationships,
  "database-transactions-and-performance": TransactionMap,
  authentication: AuthMap,
  authorization: AuthzMap,
  "integration-and-e2e-testing": TestLayers,
};

export function ChapterFigure({ slug }: { number: number; slug: string }) {
  const key = slug.replace(/^\d+-/, "");
  if (key === "package-managers") return <Tradeoffs />;
  const FigureForChapter = FIGURES[key];
  if (!FigureForChapter) return null;
  return (
    <>
      <FigureForChapter />
      {key === "introduction-to-nestjs" ? <PnpmCommands /> : null}
    </>
  );
}
