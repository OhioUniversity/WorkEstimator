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
   git clone https://github.com/OhioUniversity/WorkEstimator.git
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
├── src/                 # TypeScript and UI source files
│   ├── main.ts          # Main application entry with component registration
│   ├── calc.ts          # Workload calculation logic
│   ├── ui.html          # HTML template for the UI
│   ├── ui.css           # CSS styles for the UI
│   └── calc.test.ts     # Unit tests for calculation logic
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

## How to Add Custom Styles

1. Create a user.css file
   - In the dist folder with the bundled index.html, create a file named user.css.

2. Write your CSS
   - You can target host-level styles or shadow DOM elements.

3. Deploy or serve your project
   - Ensure user.css is present in the same folder of the final index.html when the project is hosted or served locally.

---

## How to Embed into an Iframe

1. Into the html file insert the iframe with the src link to where the component is deployed
   - EX:
      ```html
     <iframe 
      src="https://ohiouniversity.github.io/WorkEstimator/" 
      width="100%" 
      height="800" 
      style="border: none;" 
      title="Course Workload Estimator" 
      loading="lazy" 
      allowfullscreen 
      ></iframe>

## 📦 How to Publish a New Release to GitHub Packages

This project is set up to automatically build and publish the Work Estimator library to GitHub Packages whenever a new GitHub Release is published.

### 🚀 How to Publish a New Version

1. Bump the version in `package.json` following [Semantic Versioning](https://semver.org/).
2. Commit and push the change.
3. Create a new GitHub Release using the "Releases" tab, matching the new version tag (e.g., `v1.2.0`).
4. The GitHub Actions workflow will automatically:
   - Install dependencies  
   - Build the project  
   - Publish it to GitHub Packages.  

---

### 🛠️ For Forks or Personal Use

If you're forking this repository and want to publish the library to your own GitHub Packages namespace:

1. Update the package scope in `package.json` (e.g., `"name": "@your-username/work-estimator"`).
2. Generate a GitHub personal access token (PAT) with the `write:packages` and `repo` scopes.
3. Add it as a secret named `GH_TOKEN` in your repository settings.
4. Ensure your `.npmrc` or workflow references your scoped package and authentication:
   ```ini
   //npm.pkg.github.com/:_authToken=${GH_TOKEN}
## 💡 Usage in Other Projects

To use the **Workload Estimator** in another project:

1. **Include the compiled script** from the `dist/` folder in your HTML:
   ```html
   <script type="module" src="./work-estimator.es.js"></script>
2. Add the custom element to your HTML where you want the component to render:
   ```html
   <workload-estimator></workload-estimator>
 - ⚠️ Note: If you're serving the page from a subdirectory (e.g., GitHub Pages), update the script path accordingly:
   ```html
   <script type="module" src="/REPO_NAME/work-estimator.es.js"></script>

The component will load its own UI and styles via the Shadow DOM.

---

## 🙏 Acknowledgments

- Inspired by the [Shiny R App](https://shiny.justinesarey.com/wfuworkloadapp/).
- Reading and writing rates are based on research by [Wake Forest University](https://cat.wfu.edu/resources/workload/estimationdetails/).

---

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](./LICENSE) file for details.
