# React Client for the What's in my Fridge project

## Libraries

- Typescript
- React for building component-based SPAs
- [Shadcn](https://ui.shadcn.com/) as component library
    - Available components: https://ui.shadcn.com/docs/components
    - Creates components via CLI: `npx shadcn@latest add <name>`
    - Components are statically saved to `src/components/ui`
- Tailwind for styling
- Vite: fast build tool and development server
- NGINX for serving the client. The built client only consists of static files.

## Available NPM Scripts

- `npm run dev` – Starts the Vite development server
- `npm run build` – Compiles TypeScript and builds the project with Vite
- `npm run preview` – Serves the built project for local preview
- `npm run lint` – Runs ESLint + Prettier on the project
- `npm run lint:fix` – Fixes formatting issues using Prettier

## Setting the Base URL of the Server
The client needs to know the base URL of the server to make API requests.  
This is configured with the environment variable `VITE_API_BASE_URL`.
The default value is `/api`, which uses the current host and port.

To redirect this to something else:
- For the development server, create a `.env` file in the root of the client directory and set `VITE_API_BASE_URL` to the desired URL. (See `.env.template`)
- For running with docker, run the image with the environment variable set:
  ```bash
  docker run -e VITE_API_BASE_URL=https://fridge.example/api image-name
  ```
  When serving a static build like this, you cannot simply change the environment variable in the `.env` file, as it is only read at build time.  
  However, we dont want to rebuild the image every time we change the server URL, so we use a little workaround:  
  We use the vite plugin `vite-plugin-env-compatible`, which creates placeholders for all used envvars in the built `index.html`   
  For example:
  ```html
  <script type="application/javascript">window.env=JSON.parse('{"VITE_API_BASE_URL":"${VITE_API_BASE_URL}"}');</script>
  ```
  The `entrypoint.sh` script is executed when the container starts and replaces the placeholders with the environment variables value using `envsubst`.

## FAQ
- Why is entrypoint.sh needed?
  - The client is a static build, so it cannot read environment variables at runtime. The entrypoint script replaces the placeholders in the `index.html` file with the actual environment variable values.
  - See: "Setting the Base URL of the Server" for more information.
