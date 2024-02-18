# Multiplayer Game Template

This project is a template for creating an online multiplayer game. It is based on [Remix](https://remix.run) and [Supabase](https://supabase.io/).

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

This project uses `Docker` to run a local instance of the database. To start the database, you need to have Docker installed and running.
You also need to have the `supabase` CLI installed.

Then, you can use the following commands:

### Start Docker

```bash
npm run supabase:start
```

### Stop Docker

```bash
npm run supabase:stop
```

### Reset database

```bash
npm run supabase:reset
```