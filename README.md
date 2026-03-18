# Typing Practice App

A modern, high-performance web application designed to help users improve their typing speed and accuracy through thematic practice sessions. Built with **React 18**, **Vite**, and **TypeScript**.

## 🚀 Getting Started

### Prerequisites
- [PNPM](https://pnpm.io/) (v8+ recommended)
- Node.js (LTS version recommended)

### Commands

| Command | Action |
| :--- | :--- |
| `pnpm install` | Install all project dependencies. |
| `pnpm dev` | Launch the Vite development server (port 3000 by default). |
| `pnpm build` | Compile TypeScript and generate a production-ready bundle. |
| `pnpm test` | Run unit tests using Vitest. |
| `pnpm lint` | Execute ESLint for static code analysis. |
| `pnpm preview` | Locally preview the generated production build. |
| `pnpm -s obfuscate < file.txt` | Convert a text/code file to Base64 (for `.bin` practice). |

## 🛡️ Creating Obfuscated Files

If you want to practice with code while keeping it "hidden" (obfuscated as Base64), you can convert your source files into `.bin` files:

```bash
# Convert a Python script to an obfuscated binary format
pnpm -s obfuscate < script.py > script.py.bin
```

Then, upload the `script.py.bin` file in the "Créer un Texte Personnalisé" section of the app. The app will automatically detect it is obfuscated and decode it for your practice session.

## 🏗️ Architecture & Tech Stack

- **Framework:** [React 18](https://reactjs.org/) (Functional components with Hooks).
- **Build Tool:** [Vite](https://vitejs.dev/) for ultra-fast development.
- **Routing:** [@tanstack/react-router](https://tanstack.com/router) for type-safe, file-based routing.
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) for lightweight, decoupled state.
- **Testing:** [Vitest](https://vitest.dev/) for fast unit testing of core logic.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/) for a consistent, accessible UI.
- **PWA:** [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) for offline support and installability.

## 📄 License

This project is licensed under the MIT License. You are free to use, modify, and distribute the code as per the terms of the license.
