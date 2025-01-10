export interface bodyParts {
    cabeza: Armor| null,
    cara: Armor| null,
    hombros: Armor| null,
    pecho: Armor| null,
    manos: Armor| null,
    espalda: Armor| null,
    cintura: Armor| null,
    piernas: Armor| null,
    pies: Armor| null,
    manoDerecha: Weapon| null,
    manoIzquierda: Weapon | null,
}

export interface Position {
    x: number;
    y: number;
  }

export interface FloatingMessageProps {
    message: string;
    onComplete: () => void;
    position?: Position; 
    textColor?: string; 
  }