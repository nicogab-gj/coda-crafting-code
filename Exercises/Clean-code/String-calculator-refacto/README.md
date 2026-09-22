# Kata String Calculator

Le String Calculator de Roy Osherove est l'exercice classique pour débuter en
TDD. Les exigences arrivent une par une, chacune assez petite pour être
atteinte avec un seul test, et chacune tord un peu le design que tu as déjà.
L'exercice porte moins sur le découpage de chaînes que sur le rythme : un test,
une raison de changer le code, un refactor, et on recommence.

## Le problème

Écrire une fonction qui prend une chaîne de nombres et renvoie leur somme.

```
add('')        -> 0
add('1')       -> 1
add('1,2')     -> 3
```

Ensuite, traiter les exigences ci-dessous **dans l'ordre**, un test à la fois.
Ne lis pas la suite à l'avance : le but est de rencontrer chaque changement
comme on le rencontre dans le vrai travail, avec l'étape précédente déjà
committée.

| #  | Exigence                                                                   | Exemple                | Résultat |
|----|----------------------------------------------------------------------------|------------------------|----------|
| 1  | Une chaîne vide renvoie 0                                                  | `''`                   | 0        |
| 2  | Un seul nombre renvoie sa valeur                                           | `'1'`                  | 1        |
| 3  | Deux nombres séparés par une virgule sont additionnés                      | `'1,2'`                | 3        |
| 4  | N'importe quel nombre de nombres est autorisé                              | `'1,2,3,4,5'`          | 15       |
| 5  | Les retours à la ligne sont aussi des séparateurs                          | `'1\n2,3'`             | 6        |
| 6  | Un séparateur personnalisé peut être déclaré en première ligne             | `'//;\n1;2'`           | 3        |
| 7  | Les nombres négatifs lèvent une erreur qui liste tous les négatifs trouvés | `'1,-2,-5'`            | erreur   |
| 8  | Les nombres supérieurs à 1000 sont ignorés                                 | `'2,1001'`             | 2        |
| 9  | Les séparateurs peuvent avoir n'importe quelle longueur                    | `'//[***]\n1***2***3'` | 6        |
| 10 | Plusieurs séparateurs peuvent être déclarés                                | `'//[*][%]\n1*2%3'`    | 6        |

Pour l'exigence 7, le message doit nommer les coupables, quelque chose comme
`negatives not allowed: -2, -5`, pour qu'un seul test vérifie à la fois
l'échec et son contenu. Choisis la convention d'erreur (lever une exception, ou
renvoyer un type résultat) une fois pour toutes et garde-la.

## Les règles du jeu

Suivre les trois lois du TDD :

1. N'écrire du code de production que pour faire passer un test qui échoue.
2. N'écrire que la partie de test suffisante pour montrer un échec (une erreur
   de compilation compte comme un échec).
3. N'écrire que le code de production suffisant pour faire passer le test qui
   échoue.

Puis red / green / refactor :

- **Red** — ajouter l'exigence suivante sous forme d'un seul test ; le regarder
  échouer pour la raison attendue.
- **Green** — la chose la plus simple qui passe, même si c'est brutal.
- **Refactor** — nettoyer le code *et* les tests pendant que tout est vert. Ne
  saute pas cette étape ici : les exigences 5, 6 et 9 punissent chacune un
  design que tu n'as pas rangé.

## Là où ça devient intéressant

- **L'exigence 5** est le premier signe que découper sur un seul caractère est
  une impasse. Résiste à l'envie de généraliser avant que l'exigence 6 ne le
  demande vraiment.
- **L'exigence 6** sépare l'entrée en un *en-tête* et un *corps*. Remarque à
  quel point le reste devient plus simple une fois que la lecture du séparateur
  est une fonction à part, séparée de l'addition.
- **L'exigence 7** introduit une seconde responsabilité, la validation, dans
  une fonction qui jusque-là ne faisait que calculer. C'est une couture qui
  mérite un nom.
- **Les exigences 9 et 10** sont faciles si les séparateurs sont déjà une
  liste, et pénibles s'ils sont encore un caractère. Ce que tu as fait à
  l'étape 6 décide de laquelle.

## Cibles de refactoring

- une fonction qui détermine les séparateurs, une qui découpe, une qui
  additionne, chacune nommable en quelques mots ;
- aucune regex qui a besoin d'un commentaire pour être lue (ou : une regex avec
  un nom) ;
- des tests qui se lisent comme le tableau des exigences ci-dessus, pas comme
  sept blocs presque identiques ;
- le 1000 de l'exigence 8 avec un nom, pas laissé en valeur brute.

## Pour démarrer

```bash
npm install
npm test           # single run
npm run test:watch # red/green/refactor loop
npm run typecheck
```

Les tests se trouvent dans `src/`, à côté du code qu'ils testent, dans des
fichiers `*.test.ts`. Renomme le test d'exemple dans
`src/string-calculator.test.ts`, écris la première assertion pour la chaîne
vide, et crée `src/string-calculator.ts` seulement quand un test l'exige.

## Pour aller plus loin

- Chronomètre-toi : la liste complète devrait tenir en 30 minutes une fois le
  kata familier.
- Essaie avec une règle stricte de deux minutes : si un test rouge n'est pas
  vert en deux minutes, annule et fais un pas plus petit.
- Refais-le plus tard uniquement avec des tests basés sur les propriétés
  (l'ordre des nombres ne change jamais la somme, n'importe quel jeu de
  séparateurs donne le même total que la forme avec virgules).