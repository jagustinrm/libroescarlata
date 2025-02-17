export default function gainExp(enemyLevel: number, setPlayerExp: (exp: number) => void, playerExp: number) {
  const newExp = playerExp + enemyLevel * 1000;
  setPlayerExp(newExp);
}
