# El Libro Escarlata

**El Libro Escarlata** es una aplicación de Aventura y RPG Narrativo desarrollada con React, TypeScript y Vite. La arquitectura del frontend se centra en ofrecer una experiencia de juego rica y dinámica a través de la web, utilizando **Zustand** para la gestión del estado global y **Firebase** para la persistencia de datos.

Este documento detalla el ciclo de vida de la aplicación, el flujo de usuario y la arquitectura de estado, brindando una visión integral del *workflow* del proyecto.

---

## 1. Ciclo de Vida y Bootstrapping (Application Flow)

El punto de entrada principal del ciclo de vida es `src/App.tsx`. Aquí se coordina el router, los *Loaders* y la inicialización de los datos del estado global.

### Loaders: Inyección de Datos Estáticos
Al montar la aplicación, una serie de componentes conceptualizados como *Loaders* sin vistas, inyectan de forma secuencial entidades esenciales al estado global. Esto asegura que elementos como armas, clases, NPCs o misiones estén listos antes de que el jugador acceda a ellos.

- **Ejemplos de Loaders**: `PlayerStateLoader`, `WeaponLoader`, `StoryLoader`, `ItemShopLoader`, `DialogLoader`.
- **Ventaja**: Mantiene el estado limpio y delegable, centralizando la configuración base.

### Persistencia y Sincronización
La persistencia de la partida del usuario y el estado de la aplicación se maneja a través de dos mecanismos:
1. **Local Storage**: Se intercepta el evento `beforeunload` para guardar el estado del jugador (`playerState`) y de su inventario (`inventoryState`) en la memoria del navegador.
2. **Firebase**: El componente `PlayerStateSaver` (y lógica relacionada en `LandingPage`) se encarga de guardar y recuperar los datos en la nube.

---

## 2. Flujo del Jugador (User Workflow)

El recorrido del usuario (Player Engine) consta de fases modulares:

### A. Autenticación y Creación (`/` y `/characterSelector`)
- El jugador inicia en **LandingPage**, donde puede cargar su héroe (Local Storage/Firebase).
- De no existir figura, la ruta **CharacterSelector** permite crear un nuevo personaje y configurar su clase y atributos iniciales.

### B. Hub de Gestión: El Campamento (`/home`)
Una vez en la partida activa, `/home` centraliza la navegación a otros sistemas modulares:
- **`Inventory`**: Gestión de ítems equipables, armaduras, armas.
- **`PlayerStats`**: Ficha del personaje.
- **`ItemShop` / `PetStore`**: Tiendas in-game.
- **`Bestiary`**: Progreso de conocimiento de criaturas rivales.

### C. Sistema de Juego Core (Narrativa & Combate)
- **Modo Historia (`/storyMode`, `/chapter`)**: Permite avanzar capítulos predefinidos con descripciones narrativas.
- **Combate (`/fightScene`)**: Se renderizan batallas utilizando la lógica acoplada de criaturas enemigas y gestión de combate y turnos.

---

## 3. Arquitectura del Estado Global (Zustand)

La aplicación utiliza **Zustand** para agrupar estados globales en archivos modulares de la carpeta `src/stores/`. El diseño modular separa y desacopla lógicas de dominios independientes.

### Core Stores
- **`playerStore`**: Administra los datos estáticos del jugador, vitalidad, atributos (fuerza, inteligencia, etc.) y experiencia.
- **`inventoryStore`**: Estado integral de lo que el jugador retiene, y gestión de ítems, armaduras y equipo en uso.

### Game State & Systems Stores
- **`storyStore`**: Controla el registro de misiones completadas, el capítulo actual, la historia presente y decisiones del jugador.
- **`turnStore`**: Empleado expresamente para gestionar máquinas de estado por turnos durante `/fightScene`.
- **`dialogStore`**: Complementario a la narrativa, almacena los diálogos y respuestas al interactuar con NPCs.

### Entity Data Stores
Registros masivos centralizados o mutables de ítems y fauna que el Loader carga o actualiza globalmente:
- **`itemsStore`, `weaponStore`, `armorStore`, `bookStore`, `potionsStore`**: Datos base del ecosistema mercantil e ítemización.
- **`creatures.ts`**: Repositorio de estadísticas de monstruos cargados.

---

## 4. Sistema de Diálogos (NPCDialog Component)

El componente `NPCDialog` permite crear y manejar la progresividad narrativa.

### Descripción
`NPCDialog` gestiona los diálogos interconectados entre un creador narrativo (NPC/Mundo) y el jugador:
- Mostrar texto al estilo máquina de escribir progresivamente.
- Permitir opciones o interactuar de forma que impacte el progreso (`handleOptionSelect`).
- Navegar a escenas de acción basadas en los resultados del diálogo.

### Props del Componente
| Prop           | Tipo         | Descripción                                            |
| -------------- | ------------ | ------------------------------------------------------ |
| `dialogId`     | `string`     | ID del diálogo inicial a obtener del estado.           |
| `onDialogEnd`  | `() => void` | Callback gatillado al fin del loop conversacional.     |
| `chapterIndex` | `number`     | Opcional: Índice del capítulo actual en la historia.   |
| `storyIndex`   | `number`     | Opcional: Índice estricto de la historia en progreso.  |
| `storyId`      | `string`     | ID único de la historia actual.                        |

### Manejo de Eventos en `dialogHandlers.ts`
El componente utiliza controladores separados para mantener pura la UI:

1. **`handleOptionSelect`**:
   - Evalúa lógicas según el resultado (`outcome`) de la selección.
   - Permite iniciar combates, verificar ítems de inventario o promover la historia y el viaje (`travelCounter`).

2. **`handleContinue`**:
   - Avanza de la línea actual del `currentDialog` a la consiguiente, o cierra el evento si todas han sido reproducidas.
