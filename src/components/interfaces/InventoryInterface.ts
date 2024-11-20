export interface Inventory {
    weapons: Array<Item>;
    armors: Array<Item>;
    potions: Array<Item>;
    books: Array<Item>;
    scrolls: Array<Item>;
    others: Array<Item>;
}

export interface Item {
    name: string;
    key: string
}