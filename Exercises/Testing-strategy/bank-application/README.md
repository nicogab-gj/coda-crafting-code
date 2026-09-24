# Application bancaire

Un serveur HTTP minimal en TypeScript, exécuté nativement par Node — pas d'étape de build, pas de
`tsx`, pas de bundler. `node src/start.ts` exécute directement le TypeScript.

## Prérequis

Node 22.18 ou supérieur (support natif de TypeScript). Vérifiez avec `node -v`.

Docker (avec `docker compose`) pour la base de données Postgres.

## Installation

```bash
npm install
```

## Commandes

| Commande             | Ce qu'elle fait                                                                    |
| -------------------- | ---------------------------------------------------------------------------------- |
| `npm run dev`        | Démarre Postgres, migre, charge les données, puis démarre le serveur avec `--watch` |
| `npm start`          | Démarre le serveur une fois                                                        |
| `npm test`           | Exécute la suite de tests une fois                                                 |
| `npm run test:watch` | Relance les tests à chaque sauvegarde — la boucle red/green/refactor               |
| `npm run typecheck`  | Vérifie les types du projet (`tsc --noEmit`)                                       |
| `npm run test:e2e`   | Exécute les tests end-to-end : vrai serveur + base de test                         |
| `npm run test:intg`  | Exécute les tests d'intégration sur la base Postgres                               |
| `npm run db:up`      | Démarre Postgres dans Docker et attend qu'il soit prêt                             |
| `npm run db:down`    | Arrête Postgres (les données sont conservées dans un volume Docker)                |
| `npm run db:reset`   | Supprime le volume de données et repart de zéro                                    |
| `npm run db:psql`    | Ouvre un shell `psql` sur la base de dev                                           |
| `npm run db:migrate` | Applique les migrations en attente sur la base de dev                              |
| `npm run db:seed`    | Charge les données de démo dans la base de dev si elle est vide                    |

Le serveur écoute sur le port 3000 par défaut. Changez-le avec `PORT` :

```bash
PORT=4000 npm run dev
```

**Node retire les types mais ne les vérifie pas**, donc `npm run dev` exécutera sans broncher
du code qui ne passe pas la vérification de types. Lancez `npm run typecheck` (ou gardez-le en mode watch
dans un second terminal) — ce n'est pas optionnel ici.

## Base de données

`docker-compose.yml` lance un unique conteneur Postgres 17, exposé sur le port hôte
**5433** (pour ne pas entrer en conflit avec un autre Postgres sur le 5432). Il contient deux
bases de données :

| Base de données | Utilisée par                     | Chaîne de connexion                             |
| --------------- | -------------------------------- | ----------------------------------------------- |
| `bank`          | `npm run dev` / `npm start`      | `postgres://bank:bank@localhost:5433/bank`      |
| `bank_test`     | `npm run test:intg` / `test:e2e` | `postgres://bank:bank@localhost:5433/bank_test` |

`createPool()` dans `src/db/database.ts` lit `DATABASE_URL`, et se rabat sur la
base de dev par défaut. La config des tests d'intégration la définit sur `bank_test`, donc les tests ne
touchent jamais vos données de dev.

```bash
npm run db:up
npm run test:intg
```

Les tests d'intégration sont nommés `*.intg.test.ts` et sont exclus de `npm test`,
qui reste rapide et ne nécessite pas Docker. Si le conteneur ne tourne pas, la
suite d'intégration s'arrête immédiatement et vous indique de lancer `npm run db:up`.

### Migrations

Le schéma se trouve dans `src/db/migrations/*.sql`, appliqué dans l'ordre des noms de fichiers par
`src/db/migrate.ts`. Chaque fichier s'exécute dans une transaction et est enregistré dans la
table `schema_migrations`, il n'est donc appliqué qu'une seule fois. Pour modifier le schéma, ajoutez
un nouveau fichier numéroté (`002_….sql`) — ne modifiez jamais un fichier déjà appliqué.

- base de dev : lancez `npm run db:migrate`
- base de test : migrée automatiquement au démarrage de `npm run test:intg`

### Schéma

| Table             | Colonnes                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| `users`           | `id`, `firstname`, `lastname`, `birthdate` (date), `country_of_residence` (ex. `FR`)             |
| `account`         | `id`, `user_id` → `users`, `amount` (numeric, 0 par défaut), `currency` (ex. `EUR`)              |
| `account_history` | `id`, `account_id` → `account`, `amount` (numeric), `year` — une ligne par compte et par année   |

### Conventions de schéma

Suivez ces règles lorsque vous écrivez une nouvelle migration :

- **Les noms de tables et de colonnes sont en snake_case** (`country_of_residence`, `user_id`).
  Postgres convertit en minuscules les identifiants non entre guillemets, donc `countryOfResidence`
  deviendrait `countryofresidence` à moins d'être entre guillemets dans chaque requête.
- **Ne nommez jamais une table avec un mot réservé.** `user` est réservé, d'où
  `users`.
- **Les ids sont `bigint GENERATED ALWAYS AS IDENTITY`** : la base de données les
  génère, jamais l'application.
- **L'argent est en `numeric(19, 4)`, jamais en float**, pour que les montants ne soient pas arrondis.
  `pg` renvoie les valeurs `numeric` sous forme de chaînes (`'1000.0000'`) pour conserver cette
  précision : convertissez-les délibérément dans l'application.
- **Les codes suivent les normes ISO et sont imposés par un `CHECK`** : les pays sont en
  ISO 3166-1 alpha-2 (`FR`), les devises en ISO 4217 (`EUR`).
- **Chaque référence est une clé étrangère**, avec un index sur la colonne qui référence.
  Les suppressions ne sont pas en cascade : un utilisateur ou un compte ne peut pas être supprimé tant que des lignes
  pointent encore vers lui.
- **Les règles métier que la base de données peut imposer, elle les impose** (`NOT NULL`,
  `UNIQUE`, `CHECK`) — ex. `account_history` a `UNIQUE (account_id, year)`.
- **Chaque contrainte a son test d'intégration** dans `src/db/migrate.intg.test.ts`.

### Données de démo

`src/db/seed.sql` remplit chaque table avec des données de démo (5 utilisateurs, 7 comptes en GBP, EUR
et USD, quelques années d'historique). `npm run dev` les charge automatiquement, mais
**uniquement dans une base vide** : les données que vous ajoutez pendant le développement survivent à un
redémarrage. Pour revenir aux données de démo, lancez `npm run db:reset` puis
`npm run dev`.

Les ids sont fixes (le compte `1` est le compte GBP d'Ada), vous pouvez donc vous appuyer dessus pour
tester à la main. La base de test n'est jamais pré-remplie : chaque test insère les données
dont il a besoin.

Les fichiers SQL de `src/db/init/` s'exécutent **une seule fois**, à la création du volume de données
(c'est là que `bank_test` est créée). Après les avoir modifiés, lancez
`npm run db:reset`.

## Endpoints

| Méthode | Chemin                  | Réponse                                                                                                                                         |
| ------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`   | `/health`               | `200` `{"status":"ok","uptimeInSeconds":12}`                                                                                                    |
| `GET`   | `/accounts/:id/balance` | `200` `{"balance":1000}`, `404` `{"error":"Account not found"}`, `400` `{"error":"Invalid account id"}` quand l'id a 10 chiffres ou plus        |
| _toute_ | _n'importe quoi_        | `404` `{"error":"Not found"}`                                                                                                                   |

Une erreur inattendue (ex. la base de données est indisponible) est journalisée et renvoie
`500` `{"error":"Internal server error"}`.

Essayez-les avec le serveur lancé :

```bash
curl localhost:3000/health
curl localhost:3000/accounts/1/balance
curl -i localhost:3000/accounts/999/balance
curl -i localhost:3000/does-not-exist
```

## Arborescence

```
src/
├── app.ts                  createApp(accountController) — routage et 500, renvoie un serveur qui n'écoute pas encore
├── http.ts                 type HttpResponse et respondWithJson()
├── controllers/
│   ├── account-controller.ts           AccountController — GET /accounts/:id/balance, renvoie { statusCode, body }
│   ├── account-controller.test.ts      tests unitaires — validation de l'id, repository stubbé
│   └── account-controller.e2e.test.ts  tests e2e — 200 et 404, vrai serveur + base de test
├── start.ts                point d'entrée — câble repository → service → controller, lit PORT et écoute
├── app.test.ts             tests HTTP pour /health, les routes inconnues et les 500 — liaison au port 0, repository stubbé
├── services/
│   ├── account-service.ts       AccountService — getBalance(accountId), lève AccountNotFoundError
│   └── account-service.test.ts  tests unitaires du service, repository stubbé
├── interfaces/
│   └── account-repository.ts    AccountRepository — classe abstraite, ce dont l'app a besoin du stockage des comptes
├── infrastructure/
│   ├── postgres-account-repository.ts            PostgresAccountRepository — AccountRepository adossé à Postgres
│   └── postgres-account-repository.intg.test.ts  tests d'intégration du repository Postgres
├── db/                     tout ce qui concerne la base de données
│   ├── database.ts             createPool() — pool de connexions Postgres
│   ├── database.intg.test.ts   test d'intégration sur le Postgres dockerisé
│   ├── migrate.ts              migrate() — applique les fichiers migrations/*.sql en attente
│   ├── migrate.intg.test.ts    vérifie le schéma et ses contraintes
│   ├── run-migrations.ts       point d'entrée de `npm run db:migrate`
│   ├── migrations/             le schéma, un fichier SQL numéroté par modification
│   ├── seed.ts                 seed() — charge seed.sql dans une base vide
│   ├── seed.intg.test.ts       vérifie que le seed ne remplit qu'une base vide
│   ├── run-seed.ts             point d'entrée de `npm run db:seed`
│   ├── seed.sql                données de démo pour le développement local
│   └── init/                   SQL exécuté une fois à la création du volume Postgres
└── test/
    ├── database-fixtures.ts  helpers de test — insertUser(), insertAccount(), truncateAllTables()
    ├── stub-account-repository.ts  AccountRepository en mémoire pour les tests unitaires
    └── wait-for-database.ts  global setup des tests d'intégration — échoue vite si la base est indisponible

docker-compose.yml          le conteneur Postgres
```

`createApp()` renvoie un serveur qui n'a pas été lié à un port, donc les tests
démarrent le leur sur un port éphémère (`server.listen(0)`) et relisent le vrai port
via `server.address()`. Rien n'entre en collision avec un serveur de dev resté lancé dans
un autre terminal, et pas besoin de `supertest` — un simple `fetch` sur une vraie
socket.

Les tests unitaires ne touchent jamais la base de données : ils donnent à `AccountService` un
`StubAccountRepository`, un `AccountRepository` en mémoire rempli avec les
montants dont chaque test a besoin :

```ts
const accountService = new AccountService(new StubAccountRepository({ 1: 1000 }));
```

Le vrai `PostgresAccountRepository` est couvert par ses propres tests d'intégration.

Chaque controller a deux fichiers de test à côté de lui. Les tests unitaires `*.test.ts` l'appellent
directement avec un repository stubbé (ex. validation de l'id) et s'exécutent avec
`npm test`. Les tests `*.e2e.test.ts` (`npm run test:e2e`) démarrent le vrai processus
serveur (`node src/start.ts`) sur `bank_test`, insèrent les données dont chaque test a
besoin et appellent la route avec `fetch`. Seul ce qu'une vraie base de données ne peut pas facilement
produire, comme un repository en échec pour le 500, reste dans `app.test.ts` avec un
stub.

## Et ensuite

1. Enrichir l'`AccountService` avec des fonctionnalités supplémentaires, comme le prénom et le nom du titulaire du compte.

- Commencez par le service et écrivez des tests qui ont besoin de récupérer des informations sur le titulaire du compte, comme le prénom et le nom.
- créez une classe abstraite pour le repository des titulaires de compte.
- utilisez une doublure de test pour le repository des titulaires de compte dans les tests unitaires.
- implémentez le vrai repository des titulaires de compte à travers des tests d'intégration.

2. Passons à un autre cas d'usage : le virement d'argent entre comptes.
   Nous aurons besoin d'un nouveau service pour gérer les virements entre comptes.
   Utilisez la même stratégie de test que précédemment : tests unitaires avec un repository stub et tests d'intégration avec la vraie base de données.
   Ensuite, implémentez un controller et utilisez un test e2e pour le scénario nominal (happy path).

- Implémentez les règles suivantes pour les virements :
  - Le compte source doit avoir un solde suffisant.
  - Le montant du virement doit être positif.
  - Les comptes source et destination doivent tous deux exister.
  - Les comptes source et destination doivent être dans la même devise.
  - Le montant du virement doit être inférieur à 1000 unités pour un virement dans le même pays et inférieur à 500 unités pour un virement entre pays différents.
