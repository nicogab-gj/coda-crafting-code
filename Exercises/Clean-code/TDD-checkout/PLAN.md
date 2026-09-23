## Spécifications initiales

Une caisse de supermarché totalise une séquence d'articles scannés.

Les articles sont identifiés par leur nom. Chaque nom a un prix unitaire. Certains articles
comportent en plus une offre multi-achat : achetez `n`, payez `y` pour le lot au lieu de
`n × prix unitaire`.

Liste de prix de référence (données de test uniquement, jamais codées en dur dans les
classes de production) :

| Nom     | Prix unitaire | Offre        |
| ------- | -------------- | ------------ |
| Apple   | 50             | 3 pour 130   |
| Carrot  | 30             | 2 pour 45    |
| Egg     | 20             | aucune       |
| Yoghurt | 15             | aucune       |

Règles du domaine :

- Les articles peuvent être scannés dans n'importe quel ordre. Scanner `Carrot`, `Apple`,
  `Carrot` doit tout de même reconnaître la paire de Carottes et les facturer à 45.
- Les offres s'appliquent de manière gloutonne et répétée. Cinq Pommes sont à deux
  groupes de six. Elles sont donc facturées comme un groupe de trois (130) plus deux
  unités (100), soit un total de 230.
- Les prix sont des entiers exprimés dans la plus petite unité monétaire. **Aucun nombre
  à virgule flottante dans le chemin monétaire.** Si le langage dispose déjà d'un type
  décimal ou monétaire utilisé dans ce dépôt, privilégiez-le.
- Les prix changent fréquemment. Les règles sont fournies à une caisse au démarrage
  d'une transaction ; elles ne sont pas compilées dans celle-ci.

## API publique

Forme cible, adaptée aux idiomes du langage du dépôt (casse de nommage, conventions
d'erreurs, optionnels vs exceptions) :

```
checkout.scan(name)          // enregistre un article scanné
checkout.total() -> integer  // total actuel de tout ce qui a été scanné jusqu'ici
```

`total()` est une requête. L'appeler deux fois de suite doit renvoyer la même valeur et
ne doit rien modifier.

Scanner un nom inconnu est une erreur.

**Contraintes strictes, à vérifier explicitement avant de clôturer ce jalon :**

1. Le type `Checkout` ne contient aucun littéral de nom (`"Apple"`, `"Carrot"`, …) où que
   ce soit.
2. Le type `Checkout` ne contient aucun `if`/`switch` sur le type d'offre, ni aucun test
   de type de style `instanceof`.

## Spécifications partie 1 : Offres de base

1. Concevoir un plan étape par étape pour résoudre cela en TDD
2. L'implémenter étape par étape
3. Réfléchir à la conception lorsque nécessaire.

## Spécifications partie 2 : Offres avancées

1. Ajouter un nouvel article à la liste de prix. Il coûte 10 unités.
2. **Offre croisée entre produits.** Achetez deux Œufs, obtenez 20 % de réduction sur
   tous les Yaourts.
3. **Remise au niveau du panier.** 10 % de réduction sur la commande lorsque le
   sous-total dépasse 5000, appliquée après toutes les remises au niveau des articles.