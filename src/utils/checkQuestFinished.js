export default function checkQuestsFinished(quests) {
    // Obtener las misiones completadas desde el localStorage
    const completedQuests = JSON.parse(localStorage.getItem('completedQuests') || '[]');
    
    // Recorrer cada rama de misiones (history, secondary, others)
    const updateQuests = (questCategory) => {
        return questCategory.map((quest) => {
            const completedQuest = completedQuests.find((completed) => completed.name === quest.name);
            
            if (completedQuest && completedQuest.completed) {
                // Si la misión está completada, marcarla como finished
                return { ...quest, finished: true };
            }

            // Si no está completada, dejarla como está
            return { ...quest, finished: false };
        });
    };

    // Actualizar todas las ramas de misiones
    const updatedQuestTree = {
        history: updateQuests(quests.questTree.history),
        secondary: updateQuests(quests.questTree.secondary),
        others: updateQuests(quests.questTree.others),
    };

    // Devolver las misiones actualizadas con el estado 'finished'
    return { ...quests, questTree: updatedQuestTree };
}
