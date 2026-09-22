export function add(nombres: string): number {
  const { partieNombres, delimiteur } = analyser(nombres);
  const { negatifs, somme } = additionner(partieNombres, delimiteur);
  if (negatifs.length > 0) {
    throw new Error('les négatifs ne sont pas autorisés: ' + negatifs.join(', '));
  }
  return somme;
}

function analyser(nombres: string): { partieNombres: string; delimiteur: string } {
  if (!nombres.startsWith('//')) {
    return { partieNombres: nombres.replaceAll('\n', ','), delimiteur: ',' };
  }
  if (nombres.charAt(2) === '[' && nombres.indexOf('][') !== -1) {
    const enTeteDelimiteurs = nombres.substring(2, nombres.indexOf(']\n') + 1);
    let partieNombres = nombres.substring(nombres.indexOf(']\n') + 2);
    const delimiteursDeclares = enTeteDelimiteurs.substring(1, enTeteDelimiteurs.length - 1).split('][');
    for (const delimiteurDeclare of delimiteursDeclares) {
      partieNombres = partieNombres.split(delimiteurDeclare).join(',');
    }
    return { partieNombres, delimiteur: ',' };
  }
  if (nombres.charAt(2) === '[') {
    return {
      delimiteur: nombres.substring(3, nombres.indexOf(']')),
      partieNombres: nombres.substring(nombres.indexOf(']') + 2),
    };
  }
  return { delimiteur: nombres.charAt(2), partieNombres: nombres.substring(4) };
}

function additionner(partieNombres: string, delimiteur: string) {
  const morceaux = partieNombres.split(delimiteur);
  let somme = 0;
  const negatifs = [];
  for (const morceau of morceaux) {
    if (Number(morceau) < 0) {
      negatifs.push(Number(morceau));
    }
    if (Number(morceau) <= 1000) {
      somme += Number(morceau);
    }
  }
  return { negatifs, somme };
}
