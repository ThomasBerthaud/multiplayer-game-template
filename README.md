# Multiplater game template

Ce projet est un template pour créer un jeu multijoueur en ligne. Il est basé sur [svelteKit](https://kit.svelte.dev/) et [Supabase](https://supabase.io/).

## Installation du projet

installer les dépendances

```bash
npm install
```

lancer en mode developpement

```bash
npm run dev
```

Faire un build du projet en mode production

```
npm run build
```

Ce projet utilise supabase comme solution backend, pour pouvoir acceder à la base de donnée, il faut créer un fichier **.env** et ajouter :

```bash
PUBLIC_SUPABASE_URL="SUPABE_URL"
PUBLIC_SUPABASE_ANON_KEY="ANON_KEY"
```

en remplaçant les valeurs par celles de votre projet supabase.

## Installation de la base de données

### Population de la base de données

executez le script de population de donnée dans le dossier [script](./scripts/) (TODO)

### récupération du typage typescript de la base de données

```bash
npm run db-types
```

## Tests automatisés

Le projet est couvert par des tests unitaires

```bash
npm run test:unit
```

et des tests d'intégration

```bash
npm run test
```

Il est aussi possible d'executer eslint

```bash
npm run lint
```
