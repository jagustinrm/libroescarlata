export default function checkQuests(quests) {
    const completedQuests = JSON.parse(localStorage.getItem('completedQuests') || '[]');
    const deletedEnemies = JSON.parse(localStorage.getItem('deletedEnemies') || '[]');

    const isQuestCompleted = (quest) => {
        const alreadyCompleted = completedQuests.some(completed => completed.name === quest.name && completed.completed);
        if (alreadyCompleted) return true;

        const matchingEnemy = deletedEnemies.find(enemy => enemy.name === quest.objective);
        if (matchingEnemy && matchingEnemy.count >= quest.counter) {
            completedQuests.push({ id: Date.now(), name: quest.name, completed: true });
            localStorage.setItem('completedQuests', JSON.stringify(completedQuests));
            return true;
        }

        return false;
    };

    const updatedQuestTree = {
        history: quests.questTree.history.map(quest => ({ ...quest, finished: isQuestCompleted(quest) })),
        secondary: quests.questTree.secondary.map(quest => ({ ...quest, finished: isQuestCompleted(quest) })),
        others: quests.questTree.others.map(quest => ({ ...quest, finished: isQuestCompleted(quest) }))
    };

    return updatedQuestTree;
}
