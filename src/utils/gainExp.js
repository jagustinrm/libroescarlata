export default function gainExp (enemyLevel, setPlayerExp, playerExp) {
        const newExp = playerExp + enemyLevel * 1000
        setPlayerExp(newExp);
}