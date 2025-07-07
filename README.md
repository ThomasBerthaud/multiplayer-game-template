# Multiplayer Game Template

This template provides a solid foundation for quickly developing an online multiplayer game. It includes all essential features for a modern multiplayer game: matchmaking system, lobby, real-time chat, notifications, and player rankings. Built with [Remix](https://remix.run) and [Supabase](https://supabase.io/), it offers a robust and extensible architecture, allowing developers to focus on their game logic rather than technical infrastructure.

## Features

### Room Ownership Management

The system automatically handles room ownership transfer when players leave:

- **Owner Leaves**: When the current room owner leaves the lobby, ownership is automatically transferred to the oldest remaining member (determined by their `inserted_at` timestamp)
- **Empty Room**: If no players remain in the room, the room is automatically deleted
- **Seamless Transfer**: The ownership transfer happens transparently without requiring any UI interaction

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

You also need to provide a hash salt email domain and default password for anonymous login :

```dotenv
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
