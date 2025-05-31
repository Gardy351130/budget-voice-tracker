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

function updateDisplay() {
  document.getElementById("needsTotal").innerText = needsTotal.toFixed(2);
  document.getElementById("wantsTotal").innerText = wantsTotal.toFixed(2);
  document.getElementById("futureTotal").innerText = futureTotal.toFixed(2);
}

function setSalary() {
  const salaryInput = document.getElementById("salaryInput").value;
  const salary = parseFloat(salaryInput);
  const breakdownDiv = document.getElementById("salaryBreakdown");

  if (isNaN(salary) || salary <= 0) {
    breakdownDiv.innerHTML = "<p style='color:red;'>Please enter a valid salary amount.</p>";
    return;
  }

  salaryAmount = salary;

  const needs = salary * 0.5;
  const wants = salary * 0.3;
  const future = salary * 0.2;

  breakdownDiv.innerHTML = `
    <p>📊 Based on your salary of $${salary.toFixed(2)}:</p>
    <ul>
      <li><strong>Needs (50%):</strong> $${needs.toFixed(2)}</li>
      <li><strong>Wants (30%):</strong> $${wants.toFixed(2)}</li>
      <li><strong>Future (20%):</strong> $${future.toFixed(2)}</li>
    </ul>
  `;

  logOutput(`💰 Salary set to $${salary.toFixed(2)}`);
}

function addExpense(inputText = null) {
  const input = inputText || manualInput.value.trim();
  if (!input) return;

  const match = input.match(/\$?([\d.]+)\s+(needs|wants|future)/i);
  if (match) {
    const amount = parseFloat(match[1]);
    const category = match[2].toLowerCase();

    if (category === "needs") needsTotal += amount;
    if (category === "wants") wantsTotal += amount;
    if (category === "future") futureTotal += amount;

    updateDisplay();
    logOutput(`Added $${amount.toFixed(2)} to ${category}`);
  } else {
    logOutput(`❌ Couldn't understand: "${input}". Try: "$12 needs"`);
  }

  manualInput.value = "";
}

function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    logOutput("Speech recognition not supported in this browser.");
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
  };

  recognition.onerror = (event) => {
    logOutput(`❌ Voice error: ${event.error}`);
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
}

function showWeeklySummary() {
  document.getElementById("weeklyNeeds").innerText = needsTotal.toFixed(2);
  document.getElementById("weeklyWants").innerText = wantsTotal.toFixed(2);
  document.getElementById("weeklyFuture").innerText = futureTotal.toFixed(2);
  document.getElementById("weeklyPopup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("weeklyPopup").classList.add("hidden");
}

// ✅ Expose to HTML
window.setSalary = setSalary;
window.addExpense = addExpense;
window.startVoice = startVoice;
window.downloadCSV = downloadCSV;
window.showWeeklySummary = showWeeklySummary;
window.closePopup = closePopup;

