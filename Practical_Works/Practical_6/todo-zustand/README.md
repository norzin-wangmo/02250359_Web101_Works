**Course layout:** This app is **Practical 6 only** (`Practical_Works/Practical_6/todo-zustand`). Keep your own `node_modules` per practical.

---

# Todo List with Zustand

A simple Todo List built with React and [Zustand](https://github.com/pmndrs/zustand) for state management, including `localStorage` persistence.

## Features

- Add, complete, remove, and clear completed todos
- Central Zustand store (no prop drilling)
- Todos persist across page refresh via Zustand `persist` middleware

## Getting started

```bash
cd Practical_Works/Practical_6/todo-zustand
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Project structure

```
src/
├── components/
│   ├── TodoInput.jsx
│   ├── TodoItem.jsx
│   └── TodoList.jsx
├── store/
│   └── todoStore.js
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start dev server         |
| `npm run build`| Production build         |
| `npm run preview` | Preview production build |
