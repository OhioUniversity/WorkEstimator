// Function to initialize the workload estimator
function initializeWorkloadEstimator() {
  const root = document.getElementById("root");

  // Create the main container
  const container = document.createElement("div");
  container.style.maxWidth = "600px";
  container.style.margin = "auto";
  container.style.padding = "20px";
  container.style.textAlign = "center";

  // Create the title
  const title = document.createElement("h1");
  title.textContent = "Enhanced Workload Estimator";
  container.appendChild(title);

  // Create input for class weeks
  const classWeeksLabel = document.createElement("label");
  classWeeksLabel.textContent = "Class Duration (Weeks): ";
  const classWeeksInput = document.createElement("input");
  classWeeksInput.type = "number";
  classWeeksInput.value = 15;
  classWeeksInput.style.marginLeft = "10px";
  classWeeksInput.style.padding = "5px";
  classWeeksLabel.appendChild(classWeeksInput);
  container.appendChild(classWeeksLabel);

  container.appendChild(document.createElement("br"));
  container.appendChild(document.createElement("br"));

  // Create input for weekly pages
  const weeklyPagesLabel = document.createElement("label");
  weeklyPagesLabel.textContent = "Weekly Pages: ";
  const weeklyPagesInput = document.createElement("input");
  weeklyPagesInput.type = "number";
  weeklyPagesInput.value = 0;
  weeklyPagesInput.style.marginLeft = "10px";
  weeklyPagesInput.style.padding = "5px";
  weeklyPagesLabel.appendChild(weeklyPagesInput);
  container.appendChild(weeklyPagesLabel);

  container.appendChild(document.createElement("br"));
  container.appendChild(document.createElement("br"));

  // Create input for reading density
  const readingDensityLabel = document.createElement("label");
  readingDensityLabel.textContent = "Page Density: ";
  const readingDensitySelect = document.createElement("select");
  ["450 Words", "600 Words", "750 Words"].forEach((option, index) => {
    const opt = document.createElement("option");
    opt.value = index + 1;
    opt.textContent = option;
    readingDensitySelect.appendChild(opt);
  });
  readingDensityLabel.appendChild(readingDensitySelect);
  container.appendChild(readingDensityLabel);

  container.appendChild(document.createElement("br"));
  container.appendChild(document.createElement("br"));

  // Create input for difficulty
  const difficultyLabel = document.createElement("label");
  difficultyLabel.textContent = "Difficulty: ";
  const difficultySelect = document.createElement("select");
  ["No New Concepts", "Some New Concepts", "Many New Concepts"].forEach(
    (option, index) => {
      const opt = document.createElement("option");
      opt.value = index + 1;
      opt.textContent = option;
      difficultySelect.appendChild(opt);
    }
  );
  difficultyLabel.appendChild(difficultySelect);
  container.appendChild(difficultyLabel);

  container.appendChild(document.createElement("br"));
  container.appendChild(document.createElement("br"));

  // Create the calculate button
  const calculateButton = document.createElement("button");
  calculateButton.textContent = "Calculate Workload";
  calculateButton.style.padding = "10px 20px";
  calculateButton.style.cursor = "pointer";
  container.appendChild(calculateButton);

  container.appendChild(document.createElement("br"));
  container.appendChild(document.createElement("br"));

  // Create the result display
  const resultDisplay = document.createElement("p");
  resultDisplay.style.fontWeight = "bold";
  container.appendChild(resultDisplay);

  // Add event listener to the button
  calculateButton.addEventListener("click", () => {
    const classWeeks = parseFloat(classWeeksInput.value);
    const weeklyPages = parseFloat(weeklyPagesInput.value);
    const readingDensity = parseInt(readingDensitySelect.value);
    const difficulty = parseInt(difficultySelect.value);

    if (
      isNaN(classWeeks) ||
      isNaN(weeklyPages) ||
      isNaN(readingDensity) ||
      isNaN(difficulty) ||
      classWeeks <= 0
    ) {
      resultDisplay.textContent = "Please enter valid numbers.";
      return;
    }

    // Calculate workload based on the logic from server.R
    const pagesPerHourMatrix = {
      1: { 1: 67, 2: 33, 3: 17 },
      2: { 1: 50, 2: 25, 3: 13 },
      3: { 1: 40, 2: 20, 3: 10 },
    };

    const pagesPerHour = pagesPerHourMatrix[difficulty][readingDensity];
    const workload = (weeklyPages / pagesPerHour / classWeeks).toFixed(2);

    resultDisplay.textContent = `Estimated Workload: ${workload} hours/week`;
  });

  // Append the container to the root element
  root.appendChild(container);
}

// Initialize the workload estimator when the page loads
document.addEventListener("DOMContentLoaded", initializeWorkloadEstimator);