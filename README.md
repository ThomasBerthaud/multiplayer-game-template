# Multiplayer Game Template

This project is a template for creating an online multiplayer game. It is based on [SvelteKit](https://kit.svelte.dev/) and [Supabase](https://supabase.io/).

## Project Installation

To install the dependencies:

```bash
npm install
```

To start in development mode:

```bash
npm run dev
```

To build an optimized version of the project for production:

```
npm run build
```

This project uses Supabase as the backend solution. To access the database, you need to create a **.env** file and add the following lines, replacing the values with those of your Supabase project:

```dotenv
PUBLIC_SUPABASE_URL="SUPABE_URL"
PUBLIC_SUPABASE_ANON_KEY="ANON_KEY"
```

You also need to provide a hash salt and default password for anonymous login :

```dotenv
DEFAULT_USER_PASSWORD="default_password"
HASH_SALT="hash_salt"
```

see .env.example for a list of all the environment variables.

## Database Installation

### Populating the Database

Execute the data population script located in the [scripts](./scripts/) folder (TODO).

### Obtaining TypeScript Typing for the Database

```bash
npm run db-types
```

## Automated Testing

The project is covered by unit tests:

```bash
npm run test:unit
```

as well as integration tests:

```bash
npm run test
```

It's also possible to run svelte-check to check for type errors:

```bash
npm run check
```
