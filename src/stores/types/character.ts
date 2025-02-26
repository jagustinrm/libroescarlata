import { Stats } from "./stats";

export interface Character {
    name: string;
    level: number;
    dodge: number;
    c_MaxHealth: number;
    c_LeftHealth: number;
    c_MaxMana: number;
    c_LeftMana: number;
    mdef: number;
    stats: Stats;
    c_Conditions: { name: string; duration: number }[] | [];
}

export interface CharacterStore {
    setc_MaxHealth: (c_MaxHealth: number) => void;
    setc_LeftHealth: (c_LeftHealth: number) => void;
    setc_MaxMana: (c_MaxMana: number) => void;
    setc_LeftMana: (c_LeftMana: number) => void;
    setC_Conditions: (newCondition: { name: string; duration: number }[]) => void;

}