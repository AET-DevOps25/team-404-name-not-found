# React Client for the What's in my Fridge project

## Libraries

- Typescript
- React for building component-based SPAs
- [Shadcn](https://ui.shadcn.com/) as component library
    - Available components: https://ui.shadcn.com/docs/components
    - Creates components via CLI: `npx shadcn@latest add <name>`
    - Components are statically saved to `src/components/ui`
- Tailwind for styling
- Vite: fast build tool and development server with hot reloading
- NGINX for serving the client. The built client only consists of static files.

## Available NPM Scripts

- `npm run dev` – Starts the Vite development server, listening on port 8080
- `npm run build` – Compiles TypeScript and builds the project with Vite
- `npm run preview` – Serves the built project for local preview
- `npm run lint` – Runs ESLint + Prettier on the project
- `npm run lint:fix` – Fixes formatting issues using Prettier

## Available Scripts

- `./scripts/generate-openapi-typescript.sh` – Generates TypeScript types from the OpenAPI specification of the server
  services

## Setting the Base URL of the Server

The client needs to know the base URL of the server to make API requests.  
This is configured with the environment variable `VITE_API_BASE_URL`.
The default value is `/api`, which uses the current host/port and appends `/api` (e.g. when running on
`https://fridge.student.k8s.aet.tum.de`, the client will use `https://fridge.student.k8s.aet.tum.de/api` as the base
URL).

To redirect this to something else:

- For the development server, create a `.env` file in the root of the client directory and set `VITE_API_BASE_URL` to the desired URL. (See `.env.template`)
- For running with docker, run the image with the environment variable set:
    ```bash
    docker run -e VITE_API_BASE_URL=https://fridge.example/api image-name
    ```
    When serving a static build like this, you cannot simply change the environment variable in the `.env` file, as it is
    only read at build time.  
     However, we don't want to rebuild the image every time we change the server URL, so we use a little workaround:  
     We use the vite plugin `vite-plugin-runtime-env` for the production build, which creates placeholders for all used
    envvars beginning with `VITE_` in the built
    `index.html`  
     For example:
    ```html
    <script type="application/javascript">
        window.env = JSON.parse('{"VITE_API_BASE_URL":"${VITE_API_BASE_URL}"}');
    </script>
    ```
    The `entrypoint.sh` script is executed when the container starts and replaces the placeholders with the environment
    variables value using `envsubst`. The plugin also replaces uses of env variables in the TypeScript code, to switch
    from normal env usage to `window.env`:
    ```typescript
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    ```
    is replaced with:
    ```typescript
    const apiBaseUrl = window.env.VITE_API_BASE_URL;
    ```

## Dev Mode with mocked login

You can run the client in development mode by setting the environment variable `VITE_MODE` to `dev`.  
This will enable the mocked login flow, which allows you to test the client without actually logging in.
This is especially useful when running the client with the vite development server on `localhost:8080`
and the rest of the application (server etc.) with docker compose, as we can't use OAuth login flow there. We can't use
the OAuth login flow because the callback URL that the
server uses, will be on the HOST (e.g. `fridge.localhost`) of the docker compose and not localhost. Keep in mind that
the server services must be run with `MODE=dev` for this to work.

## Local Development with dev server for client and backend services from docker compose

- Create a `.env` file in the root of the client directory and set the environment variables as needed.  
  See `.env.template` for an example.
- Install & Start dev server for the client:
    ```bash
    npm run install
    npm run dev
    ```
- Start the backend services with docker compose (see `docs/local-development.md` for more information):
    ```bash
    # From root of the project
    BRANCH=<branchname> MODE=dev docker compose -f compose.yml up
    ```
    Note: `MODE=dev` is needed to enable the mocked login flow in the backend services, so that the client can use the `dev-user`.
- This will also start a client container but we just ignore it and access the server via the Vite dev server on `localhost:8080`.
- You have to open the browser with the URL `https://fridge.localhost` and accept the self-signed certificate, otherwise the calls to the backend services from the dev server may fail due to certificate errors.
- Now you can develop the client with hot reloading on `localhost:8080` and the backend services running in docker compose.

## FAQ

- Why is entrypoint.sh needed?
    - The client is a static build, so it cannot read environment variables at runtime. The entrypoint script replaces
      the placeholders in the `index.html` file with the actual environment variable values.
    - See: "Setting the Base URL of the Server" for more information.
