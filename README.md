# Trello Web Clone

A Trello-inspired project management interface built with React. The application models boards, columns, and cards and provides an interactive board experience with sortable columns and cards.

The project is currently focused on the frontend experience. The board is rendered with local mock data, making the repository useful for developing and testing the UI, component structure, and drag-and-drop interactions before connecting a production API. The current entry point renders a board directly; authentication, user pages, and API modules are organized as part of the application structure and can be expanded as the project grows.

## Features

- Trello-style board layout with columns and cards
- Drag and drop for rearranging columns across a board
- Drag and drop for moving cards within a column and switching cards between columns
- Drag overlays and collision detection for a clear, responsive drag interaction
- Stable column and card ordering through explicit `columnOrderIds` and `cardOrderIds` collections
- Placeholder handling for empty columns
- Board hierarchy composed of boards, columns, and cards
- Reusable application components and board-specific components
- Material UI components, icons, and Emotion styling
- Theme support prepared through the shared theme and mode-selection modules
- Mock data for local development

## Tech Stack

- **React 18** and **React DOM** for the component-based user interface
- **JavaScript and JSX** for application code, with `jsconfig.json` path aliases
- **Vite** for development, hot module replacement, bundling, and preview builds
- **Material UI** (`@mui/material`) and **MUI Icons** for interface components and icons
- **Emotion** (`@emotion/react`, `@emotion/styled`) for Material UI-compatible styling
- **dnd-kit** (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`) for drag sensors, collision detection, drag overlays, and sortable columns/cards
- **Lodash** for utility operations such as deep cloning and emptiness checks
- **ESLint** with React, Hooks, and Refresh plugins for code-quality checks
- **SWC React plugin** for fast JSX transformation during Vite development

Redux Toolkit, Axios, and Tailwind CSS are not currently listed as installed dependencies. The `src/redux/` and `src/apis/` directories provide the intended boundaries for shared state and external data access, so those libraries can be introduced when the backend integration is implemented.

## Project Structure

```text
trello-web/
├── .github/
│   └── copilot-instructions.md       # Project conventions and Copilot context
├── public/                           # Static files served as-is by Vite
├── src/
│   ├── apis/                         # API clients and integration functions
│   │   └── mock-data.js              # Local board data used by the current UI
│   ├── assets/                       # Images, icons, and other static resources
│   │   └── auth/                     # Authentication-related assets
│   ├── components/                   # Reusable UI components
│   │   ├── AppBar/                   # Main navigation and application menus
│   │   │   └── Menus/                # Profiles, recent items, templates, etc.
│   │   ├── Modal/                    # Reusable modal dialog components
│   │   └── ModeSelect/               # Light and dark mode selection
│   ├── pages/                        # Top-level page components
│   │   ├── Auth/                     # Login and registration screens
│   │   ├── Boards/                   # Board pages and board interactions
│   │   │   ├── BoardBar/             # Board header and controls
│   │   │   └── BoardContent/         # Columns, cards, and drag-and-drop logic
│   │   └── Users/                    # User list and user detail pages
│   ├── redux/                        # Redux store and future state slices/selectors
│   ├── utils/                        # Constants, formatters, and sorting helpers
│   ├── App.jsx                       # Root application layout and page entry
│   ├── main.jsx                      # React application bootstrap
│   └── theme.js                      # Shared theme and design tokens
├── index.html                        # Vite HTML entry point
├── jsconfig.json                     # JavaScript path aliases and editor settings
├── package.json                      # Dependencies and npm scripts
└── vite.config.js                    # Vite configuration
```

### Board Component Hierarchy

The board UI is divided into small, focused components:

```text
Board
└── BoardContent
	 └── ListColumns
		  └── Column
				└── ListCards
					 └── Card
```

This separation keeps board layout, column behavior, card lists, and individual card presentation independently maintainable.

### Board Interaction Flow

The board uses `DndContext` from dnd-kit to coordinate pointer and touch interactions:

1. A column or card becomes the active drag item when a drag starts.
2. Collision detection identifies the column or card currently beneath the pointer.
3. Cards can be reordered in their current column or moved into another column.
4. Columns can be reordered across the board.
5. Local state updates the visible order while preserving `columnOrderIds` and `cardOrderIds`.

This behavior is currently client-side. Persisting the new order to a backend is the next integration boundary for `src/apis/` and shared application state.

## Prerequisites

- Node.js 18 or newer is recommended.
- npm, which is included with Node.js.

## Getting Started

1. Clone the repository and enter the project directory:

   ```bash
   git clone <repository-url>
   cd trello-web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   Vite will print the local URL in the terminal. The `--host` flag also makes the development server available on the local network.

## Available Scripts

| Command           | Description                                                   |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Start the Vite development server with hot module replacement |
| `npm run build`   | Create an optimized production build in `dist/`               |
| `npm run preview` | Serve the production build locally for verification           |
| `npm run lint`    | Run ESLint and fail on warnings or unused disable directives  |

## Development Notes

- The current application entry renders the board page from `src/App.jsx`.
- Board content is seeded from `src/apis/mock-data.js` while backend services are being developed.
- Keep reusable UI elements in `src/components/` and page-level workflows in `src/pages/`.
- Put external data access in `src/apis/`, shared state in `src/redux/`, and pure helpers in `src/utils/`.
- Use the existing theme and component libraries when adding new UI so the interface remains consistent.

## Production Build

Build the application with:

```bash
npm run build
```

To inspect that build locally:

```bash
npm run preview
```
