export class Checkout {
    item: string = ''
    scan(item: string): void {
        this.item = item
    }
    total(): number {
        if (this.item === 'apple') {
            return 50
        }
        for(let i = 0; i < 2; i++) {
            if (this.item === 'carrot'){
                return i * 30
            }
            else {
                return 0;
            }
        }
    }  
}
