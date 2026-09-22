## Bien démarrer

```bash
npm install

npm test             # exécution unique

npm run test:watch   # boucle red/green/refactor

npm run typecheck
```

Les tests se trouvent dans `src/`, à côté du code qu'ils testent, dans des fichiers `*.test.ts`.

Renomme le fichier temporaire `src/manhattan-distance.test.ts`, écris la première assertion pour deux points identiques, puis crée `src/manhattan-distance.ts` uniquement lorsqu'un test l'exige.

# Kata de la distance de Manhattan

La distance de Manhattan (ou distance « taxicab ») entre deux points correspond à la distance que l'on parcourrait sur une grille de rues : on ne peut pas couper à travers les pâtés de maisons, il faut donc additionner les déplacements horizontaux et verticaux.

```ts
distance((0, 0), (3, 4)) === 7      // et non 5 — ce serait la distance euclidienne
```

C'est un problème très simple, et c'est précisément ce qui en fait un bon kata : le calcul tient sur une seule ligne, donc tout l'intérêt se trouve dans le *design* — où placer le comportement, comment représenter un point et jusqu'où pousser l'abstraction.

## Le problème

Étant donnés deux points sur une grille d'entiers, retourner la somme des différences absolues entre leurs coordonnées.

| Départ     | Arrivée    | Distance |
| ---------- | ---------- | -------- |
| `(0, 0)`   | `(0, 0)`   | 0        |
| `(0, 0)`   | `(1, 0)`   | 1        |
| `(0, 0)`   | `(0, 1)`   | 1        |
| `(0, 0)`   | `(3, 4)`   | 7        |

| `(3, 4)`   | `(0, 0)`   | 7        |


| `(-1, -1)` | `(1, 1)`   | 4        |
| `(2, -5)`  | `(-3, 5)`  | 15       |

## Les règles du jeu

Respecte les trois lois du TDD :

1. N'écris aucun code de production sauf pour faire passer un test en échec.
2. N'écris que le minimum nécessaire dans un test pour démontrer un échec (une erreur de compilation compte comme un échec).
3. N'écris que le minimum de code de production nécessaire pour faire passer le test en échec.

Puis applique le cycle red / green / refactor :

- **Red** — ajoute le prochain test et vérifie qu'il échoue pour la raison attendue.
- **Green** — écris la solution la plus simple qui permet de faire passer le test.
- **Refactor** — nettoie et améliore le code *et* les tests tout en conservant tous les tests au vert.

## Comment pratiquer

1. Commence par écrire les différentes étapes de tes cas de test.  
   Quels sont les cas les plus simples auxquels tu peux penser ?  
   Comment vas-tu introduire progressivement de la complexité ?

2. Commence par implémenter le cas de test le plus simple et fais-le passer.

3. Introduis progressivement des cas de test plus complexes en suivant la stratégie définie à l'étape 1.

4. N'oublie pas de refactoriser lorsque tous les tests passent.

5. Supposons maintenant que nous devions travailler en 3D : construis un parcours TDD pour cette nouvelle version.

6. Implémente-le.
