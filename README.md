El Libro Escarlata

# NPCDialog Component

El componente `NPCDialog` permite crear y manejar un sistema de diálogo interactivo en una aplicación React, ideal para narrativas y eventos en videojuegos. Este README describe cómo funciona el componente y cómo está estructurado su código.

## Descripción

`NPCDialog` gestiona los diálogos entre un NPC (personaje no jugable) y el jugador, incluyendo:

- Mostrar líneas de diálogo progresivamente.
- Manejar eventos basados en opciones seleccionadas por el jugador.
- Actualizar el progreso de la historia y el inventario del jugador.
- Navegar a escenas como combates o eventos de viaje.

### Props del Componente

| Prop           | Tipo                  | Descripción                                                                 |
|----------------|-----------------------|-----------------------------------------------------------------------------|
| `dialogId`     | `string`             | ID del diálogo inicial.                                                    |
| `onDialogEnd`  | `() => void`         | Callback que se ejecuta al finalizar el diálogo.                           |
| `chapterIndex` | `number | undefined` | Índice del capítulo actual en la historia.                                 |
| `storyIndex`   | `number | undefined` | Índice de la historia en progreso.                                         |
| `storyId`      | `string`             | ID único de la historia a la que pertenece el diálogo.                     |

### Estados Internos

1. **`currentDialog`**: Contiene el diálogo actual obtenido por su ID.
2. **`currentLine`**: Representa la línea actual del diálogo que se muestra al jugador.
3. **`displayedText`**: Almacena el texto mostrado progresivamente para crear un efecto de máquina de escribir.
4. **`travelCounter`**: Lleva la cuenta de los días de viaje en eventos que requieren este cálculo.

### Funcionalidades Clave

1. **Carga de Diálogo Inicial**: Al montar el componente, busca y carga el diálogo por `dialogId`.
2. **Progresión del Texto**: Cada línea del diálogo se muestra carácter por carácter.
3. **Interacción con Opciones**: Ofrece al jugador opciones basadas en el contexto, como combates o entregas de objetos.
4. **Persistencia de Estado**: Utiliza `localStorage` para guardar y recuperar datos como progreso de eventos o viajes.

### Manejo de Eventos y Opciones

El componente utiliza funciones definidas en `dialogHandlers.ts`:

- **`handleOptionSelect`**: Controla las acciones al seleccionar una opción del diálogo. Las opciones pueden:
  - Iniciar un combate.
  - Requerir objetos específicos del inventario.
  - Actualizar el progreso de la historia.
- **`handleContinue`**: Avanza a la siguiente línea del diálogo o finaliza el mismo.

## `dialogHandlers.ts`

Este archivo contiene los controladores para manejar las interacciones en el diálogo:

1. **`handleOptionSelect`**:
   - Lógica para determinar la acción según el resultado (`outcome`) de la opción seleccionada.
   - Actualiza el progreso del jugador, navega a escenas específicas o gestiona el inventario.

2. **`handleContinue`**:
   - Avanza el diálogo a la siguiente línea o finaliza el diálogo si no hay más líneas.



