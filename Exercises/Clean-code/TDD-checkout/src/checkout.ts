
interface ressources {
    name: string,
    prix: number,
    offre: string
}

class Ressources {
    private items: ressources[] = [
        { name: 'Apple', prix: 50, offre: '3 pour 130' },
        { name: 'Carrot', prix: 30, offre: '2 pour 45' },
        { name: 'Egg', prix: 20, offre: 'aucune' },
        { name: 'Yoghurt', prix: 15, offre: 'aucune' }
    ]

    add(valeur: ressources) {
        this.items.push(valeur)

        return true
    }

    search(name: string) {
        for (const elements in this.items) {
            if (this.items[elements]?.name == name) {
                return true
            }
        }
    }
}

const items = new Ressources()

export function addPanier(valeur: ressources) {
    items.add(valeur)
    return true
}

export function getPanier() {
    for (const elements in items) {
        console.log(items)
    }

    return true
}

export function search(name: string) {
    let ok = items.search(name)
    return ok
}

export default { addPanier, getPanier, search }