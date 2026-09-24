# Lint & Format

Your team just inherited `order-service`. Every pull request turns into a debate about quotes, semicolons and indentation, and one test file has been silently skipping tests for weeks. Your mission: build the tooling that ends the debates and enforces the team's conventions automatically.

You will set up **Prettier** (formatting), **ESLint** (linting), and make them cooperate.

## Getting started

Requires Node ≥ 22.13.

```bash
npm install
npm test           # single run
npm run test:watch
npm run typecheck
```

Each step below has a **goal**, some **instructions**, and a **check** you can run to know you are done. Hints are folded; open them only when stuck.

> **Fell behind?** Every step has a checkpoint in `solution/step-N/` containing only the files changed at that step, so checkpoints are **cumulative**: apply every step from 1 to N, in order. For example, to reach the end of step 3:
>
> ```bash
> for s in 1 2 3; do cp -R solution/step-$s/. .; done && npm install
> ```
>
> The expected outputs quoted in the hints assume the solution's `.prettierrc` (no semicolons, single quotes, `printWidth: 100`, trailing commas); with other choices, line numbers and counts will differ.

---

## Step 0 — Explore the mess (10')

Read `src/domain/order.ts`, `src/app/order-service.ts` and their tests. List every inconsistency you can find: quotes, semicolons, indentation, line length… and anything that looks like a bug waiting to happen.

Run `npm test`. Look closely at the summary.

**Check:** tests pass. How many are skipped, and why?

<details><summary>Hint</summary>

`Tests 6 passed | 1 skipped (7)`. Look for `.only` in the test files. Which tool could stop this from ever being committed? (Look up `@vitest/eslint-plugin` and its `no-focused-tests` rule.)

</details>

---

## Step 1 — Prettier alone (15')

**Goal:** formatting is no longer a matter of opinion.

1. `npm install -D prettier`
2. Create `.prettierrc`. Discuss each option with your neighbour before picking a value: `semi`, `singleQuote`, `printWidth`, `trailingComma`.
3. Create `.prettierignore` with `solution/`, `package-lock.json` and `README.md`.
4. Add two scripts to `package.json`: `format` (`prettier --write .`) and `format:check` (`prettier --check .`).
5. Run `npm run format:check`, then `npm run format`, then look at `git diff`.

**Check:**

```bash
npm run format:check   # All matched files use Prettier code style!
npm test               # still green: the diff is style only
```

<details><summary>Hint: expected first format:check output</summary>

```text
Checking formatting...
[warn] src/app/order-service.ts
[warn] src/domain/order.test.ts
[warn] src/domain/order.ts
[warn] vitest.config.ts
[warn] Code style issues found in 4 files. Run Prettier with --write to fix.
```

</details>

<details><summary>Discussion</summary>

- Why is `format:check` (and not `format`) the one you would run in CI?
- Prettier has very few options on purpose. Why is that a feature?

</details>

---

## Step 2 — Format on save (10')

**Goal:** nobody ever runs `npm run format` by hand again.

1. Create `.vscode/settings.json` enabling `editor.formatOnSave` with Prettier (`esbenp.prettier-vscode`) as `editor.defaultFormatter`.
2. Create `.vscode/extensions.json` recommending that extension.

**Check:** break the indentation of any line in `order.ts`, save → it is restored.

<details><summary>Discussion</summary>

- Why commit `.vscode/` to the repo instead of relying on each developer's user settings?
- Format on save and `format:check` in CI: why do you want both?

</details>

<details><summary>Other editors</summary>

- WebStorm: Settings → Languages & Frameworks → JavaScript → Prettier → "Automatic Prettier configuration" + "Run on save".
- Neovim: `conform.nvim` with the `prettier` formatter and `format_on_save`.

</details>

---

## Step 3 — ESLint basics (20')

**Goal:** catch bugs, not style.

1. `npm install -D eslint @eslint/js typescript-eslint`
2. Create `eslint.config.js` (flat config) with `{ ignores: ['solution/**'] }`, `js.configs.recommended` and `tseslint.configs.recommended`, wrapped in `defineConfig` from `eslint/config`.
3. Add a `lint` script: `eslint .` in the package.json
4. Run `npm run lint` and read each message.
5. Using the ESlint doc: https://eslint.org/docs/latest/rules/
   Add a config block with team rules: `eqeqeq` as `error`, `no-console` as `warn`. Run again.
6. Fix everything. The `console.info` audit line is legitimate: keep it with a disable comment that explains **why**.

**Check:**

```bash
npm run lint   # no output, exit code 0
npm test
```

<details><summary>Hint: expected output with recommended rules only</summary>

```text
src/app/order-service.ts
   7:8   error  'OrderLine' is defined but never used     @typescript-eslint/no-unused-vars
  19:25  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

src/domain/order.ts
  22:9  error  'currency' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 3 problems (3 errors, 0 warnings)
```

</details>

<details><summary>Hint: expected output after adding team rules</summary>

```text
src/app/order-service.ts
   7:8   error    'OrderLine' is defined but never used     @typescript-eslint/no-unused-vars
  19:25  error    Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  29:5   warning  Unexpected console statement              no-console
  31:5   warning  Unexpected console statement              no-console

src/domain/order.ts
  22:9   error  'currency' is assigned a value but never used  @typescript-eslint/no-unused-vars
  27:26  error  Expected '===' and instead saw '=='            eqeqeq

✖ 6 problems (4 errors, 2 warnings)
```

`OrderLine` is imported but unused because `add` takes `line: any` instead: fixing the `any` fixes both.

</details>

<details><summary>Hint: disable comment syntax</summary>

```ts
// eslint-disable-next-line no-console -- audit trail required by finance
```

</details>

<details><summary>Discussion</summary>

- `off` / `warn` / `error`: warnings do not fail `npm run lint`. When would you add `--max-warnings 0`?
- Why is a disable comment without a reason a smell?
- `tsconfig.json` has `noUnusedLocals: false` on purpose. Compiler or linter: who should own this check?

</details>

---

## Step 4 — The conflict (15')

**Goal:** understand why linters and formatters fight, and stop the fight.

1. `npm install -D @stylistic/eslint-plugin` and add a block enabling `@stylistic/quotes` with the quote style **opposite** to your `.prettierrc` (e.g. `'@stylistic/quotes': ['error', 'double']` if you chose `singleQuote: true`).
2. Run `npm run lint -- --fix`, then `npm run format:check`. Then `npm run format`, then `npm run lint`. What happens?
3. `npm install -D eslint-config-prettier`: https://www.npmjs.com/package/eslint-config-prettier and add `eslintConfigPrettier` (from `eslint-config-prettier/flat`) as the **last** entry of your config.
4. Extend `.vscode/settings.json` with `"editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" }`, and recommend `dbaeumer.vscode-eslint` in `extensions.json`.

**Check:** both sequences are stable.

```bash
npm run format && npm run lint
npm run lint -- --fix && npm run format:check
```

<details><summary>Hint: what the fight looks like</summary>

```text
✖ 54 problems (54 errors, 0 warnings)
  54 errors and 0 warnings potentially fixable with the `--fix` option.
```

`lint --fix` rewrites every string to double quotes, then `format` puts them back to single quotes, then `lint` complains again. Forever.

</details>

<details><summary>Hint: order matters</summary>

Flat config entries apply top to bottom; a later entry overrides an earlier one. If `eslintConfigPrettier` is not last, the rules it turns off can be turned back on by the entries after it. Try moving it above the `@stylistic` block:

```text
✖ 55 problems (55 errors, 0 warnings)
  55 errors and 0 warnings potentially fixable with the `--fix` option.
```

</details>

<details><summary>Discussion</summary>

The rule of thumb: **the formatter owns style, the linter owns correctness.** Can you think of a rule that sits on the boundary?

</details>
