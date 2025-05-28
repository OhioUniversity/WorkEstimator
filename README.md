# Enhanced Workload Estimator

The **Enhanced Workload Estimator** is a powerful, embeddable TypeScript + Web Component application built to assist educators, instructional designers, and students in estimating the weekly workload of a course. It accounts for a broad range of academic activities and provides real-time, data-driven insights through an intuitive, customizable interface.

---

## 🔧 Features

- **Modular & Encapsulated**: Built as a custom Web Component using Shadow DOM for complete style isolation.
- **Vite-Powered**: Fast development and optimized production builds using [Vite](https://vitejs.dev/).
- **Interactive UI**: Includes panels for:
  - Reading assignments
  - Writing tasks
  - Exams
  - Videos / Podcasts
  - Discussion posts
  - Class meetings
  - Other assignments
- **Customizable Rates**: Adjustable parameters for page density, difficulty, writing genre, drafting, and more.
- **Real-Time Feedback**: Dynamically updates workload estimates as inputs change.
- **Embeddable Component**: Easily insert into any HTML file with a single `<workload-estimator>` tag.

---

## 🚀 Getting Started

These instructions will get you a copy of the project up and running in your local environment for development or evaluation purposes.

### 📦 Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- npm (comes with Node)

### 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/workload-estimator.git
   cd workload-estimator
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and visit:

   ```
   http://localhost:5173
   ```

---

## 🏗️ Project Structure

```
workload-estimator/
├── index.html           # Entry point for the app
├── public/              # Static files (ui.html, ui.css)
├── src/                 # TypeScript source files
│   ├── main.ts          # Main application entry with component registration
│   ├── calc.ts          # Workload calculation logic
│   └── workloadEstimator.ts # Core logic for UI behavior
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
└── package.json         # Dependencies and scripts
```

---

## 🧪 Build for Production

To create an optimized, production-ready build:

```bash
npm run build
```

Then preview the built app locally:

```bash
npm run preview
```

---

## 💡 Usage in Other Projects

To use the workload estimator in another project:

1. Include the compiled script from `dist/`.
2. Add `<workload-estimator></workload-estimator>` to your HTML.

The component will load its own UI and styles via the Shadow DOM.

---

## 🙏 Acknowledgments

- Inspired by the [Shiny R App](https://shiny.justinesarey.com/wfuworkloadapp/).
- Reading and writing rates are based on research by [Wake Forest University](https://cat.wfu.edu/resources/workload/estimationdetails/).

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.



