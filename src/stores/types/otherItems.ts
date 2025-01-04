export interface otherItem {
    id: string;
    name: string;
    cost: number;
}

export interface otherItemsStore {
    otherItems: otherItem[]
    areOtherItemsLoaded: boolean;
    setotherItems: (otherItem: otherItem[]) => void;
}