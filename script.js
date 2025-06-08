let needsTotal = 0;
let wantsTotal = 0;
let futureTotal = 0;
let salaryAmount = 0;

const output = document.getElementById("output");
const manualInput = document.getElementById("manualInput");

function logOutput(text) {
  const p = document.createElement("p");
  p.innerText = text;
  output.appendChild(p);
}

function showTooltip(message) {
  const tooltip = document.getElementById("tooltip");
  tooltip.innerText = message;
  tooltip.classList.remove("hidden");
  setTimeout(() => {
    tooltip.classList.add("hidden");
  }, 3000);
}

function updateDisplay() {
  document.getElementById("needsTotal").innerText = needsTotal.toFixed(2);
  document.getElementById("wantsTotal").innerText = wantsTotal.toFixed(2);
  document.getElementById("futureTotal").innerText = futureTotal.toFixed(2);
  updateSliders();
}

function updateSliders() {
  const needsBar = document.getElementById("needsBar");
  const wantsBar = document.getElementById("wantsBar");
  const futureBar = document.getElementById("futureBar");

  if (!salaryAmount || salaryAmount <= 0) {
    needsBar.style.background = "#ddd";
    wantsBar.style.background = "#ddd";
    futureBar.style.background = "#ddd";
    return;
  }

  const maxNeeds = salaryAmount * 0.5;
  const maxWants = salaryAmount * 0.3;
  const maxFuture = salaryAmount * 0.2;

  const needsPercent = Math.max(0, (needsTotal / maxNeeds) * 100);
  const wantsPercent = Math.max(0, (wantsTotal / maxWants) * 100);
  const futurePercent = Math.max(0, (futureTotal / maxFuture) * 100);

  needsBar.style.background = `linear-gradient(to top, #2196f3 ${needsPercent}%, #ddd ${needsPercent}%)`;
  wantsBar.style.background = `linear-gradient(to top, #ff9800 ${wantsPercent}%, #ddd ${wantsPercent}%)`;
  futureBar.style.background = `linear-gradient(to top, #4caf50 ${futurePercent}%, #ddd ${futurePercent}%)`;
}

function setSalary() {
  const salaryInput = document.getElementById("salaryInput").value;
  const salary = parseFloat(salaryInput);
  const breakdownDiv = document.getElementById("salaryBreakdown");

  if (isNaN(salary) || salary <= 0) {
    breakdownDiv.innerHTML = "<p style='color:red;'>Please enter a valid salary amount.</p>";
    showTooltip("Please enter a valid salary.");
    return;
  }

  salaryAmount = salary;
  needsTotal = salary * 0.5;
  wantsTotal = salary * 0.3;
  futureTotal = salary * 0.2;

  breakdownDiv.innerHTML = `
    <p>📊 Based on your salary of $${salary.toFixed(2)}:</p>
    <ul>
      <li><strong>Needs (50%):</strong> $${needsTotal.toFixed(2)}</li>
      <li><strong>Wants (30%):</strong> $${wantsTotal.toFixed(2)}</li>
      <li><strong>Future (20%):</strong> $${futureTotal.toFixed(2)}</li>
    </ul>
  `;

  updateDisplay();
  logOutput(`💰 Salary set to $${salary.toFixed(2)}`);
  showTooltip("Salary updated.");
}

function addExpense(inputText = null) {
  const input = inputText || manualInput.value.trim();
  if (!input) return;

  const match = input.match(/\$?([\d.]+)\s+(needs|wants|future)/i);
  if (match) {
    const amount = parseFloat(match[1]);
    const category = match[2].toLowerCase();

    if (category === "needs") needsTotal -= amount;
    if (category === "wants") wantsTotal -= amount;
    if (category === "future") futureTotal -= amount;

    updateDisplay();
    logOutput(`Deducted $${amount.toFixed(2)} from ${category}`);
    showTooltip(`$${amount.toFixed(2)} deducted from ${category}`);
  } else {
    logOutput(`❌ Couldn't understand: "${input}". Try: "$12 needs"`);
    showTooltip("Couldn't understand input. Try: '$12 needs'");
  }

  manualInput.value = "";
}

function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    logOutput("Speech recognition not supported in this browser.");
    showTooltip("Voice input not supported.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  logOutput("🎤 Listening...");

  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    logOutput(`🗣 You said: "${transcript}"`);
    addExpense(transcript);
    showTooltip("Voice input received.");
  };

  recognition.onerror = (event) => {
    logOutput(`❌ Voice error: ${event.error}`);
    showTooltip("Voice input failed.");
  };
}

function downloadCSV() {
  const rows = [
    ["Category", "Amount"],
    ["Needs", needsTotal.toFixed(2)],
    ["Wants", wantsTotal.toFixed(2)],
    ["Future", futureTotal.toFixed(2)]
  ];

  let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "budget_buckets.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showTooltip("CSV downloaded.");
}

function showWeeklySummary() {
  document.getElementById("weeklyNeeds").innerText = needsTotal.toFixed(2);
  document.getElementById("weeklyWants").innerText = wantsTotal.toFixed(2);
  document.getElementById("weeklyFuture").innerText = futureTotal.toFixed(2);
  document.getElementById("weeklyPopup").classList.remove("hidden");
  showTooltip("Showing weekly summary.");
}

function closePopup() {
  document.getElementById("weeklyPopup").classList.add("hidden");
  showTooltip("Summary closed.");
}

// ✅ Expose to HTML
window.setSalary = setSalary;
window.addExpense = addExpense;
window.startVoice = startVoice;
window.downloadCSV = downloadCSV;
window.showWeeklySummary = showWeeklySummary;
window.closePopup = closePopup;

