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
- `npm run lint:eslint` – Runs ESLint on the project
- `npm run lint:prettier` – Checks code formatting with Prettier
- `npm run lint:prettier:fix` – Fixes formatting issues using Prettier
- `npm run lint` – Runs both ESLint and Prettier checks
