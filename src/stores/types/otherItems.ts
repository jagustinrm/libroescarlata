export interface otherItem {
    id: string;
    name: string;
    cost: number;
    color?: string;
    weight: number;
}

export interface otherItemsStore {
    otherItems: otherItem[]
    areOtherItemsLoaded: boolean;
    setotherItems: (otherItem: otherItem[]) => void;
}