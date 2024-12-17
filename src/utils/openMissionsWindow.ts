export default function openMissions() {
  const windowFeatures = 'width=400,height=400,top=100,left=100';
  // Obtener la URL actual y agregar el segmento "/quests"
  const currentUrl = window.location.origin;
  const newUrl = `${currentUrl}/quests`;

  // Abrir la ventana con la nueva URL
  window.open(newUrl, '_blank', windowFeatures);
}
