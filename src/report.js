// Files the fixed QuickBite bug report. The API ignores anything we send,
// so the request carries no body.
const REPORT_URL = "https://q9djze7eg0.execute-api.us-east-1.amazonaws.com/report";
const ISSUE_URL_PREFIX =
  "https://github.com/diegotry/durable-food-ordering-demo/issues/";

const button = document.getElementById("report-bug");
const status = document.getElementById("report-status");

function showError(message) {
  const text = document.createElement("p");
  text.className = "report-error";
  text.textContent = message;
  status.replaceChildren(text);
}

function showIssue(issueNumber, issueUrl) {
  const intro = document.createElement("p");
  intro.append(`Issue #${issueNumber} is open. `);
  const link = document.createElement("a");
  link.href = issueUrl;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "Watch the agent on GitHub";
  intro.append(link);

  const steps = document.createElement("ol");
  for (const step of [
    "An agent finds the cause (about 30 seconds).",
    "Diego approves the plan.",
    "A second agent opens the fix (about 20 seconds).",
  ]) {
    const item = document.createElement("li");
    item.textContent = step;
    steps.append(item);
  }
  status.replaceChildren(intro, steps);
}

button.addEventListener("click", async () => {
  button.disabled = true;
  button.textContent = "Reporting…";
  status.replaceChildren();
  try {
    const response = await fetch(REPORT_URL, { method: "POST" });
    if (response.status === 429) {
      throw new Error("The demo is busy right now. Ask the booth team.");
    }
    if (!response.ok) {
      throw new Error("That didn't work. Please try again.");
    }
    const { issueNumber, issueUrl } = await response.json();
    if (
      !Number.isSafeInteger(issueNumber) ||
      typeof issueUrl !== "string" ||
      !issueUrl.startsWith(ISSUE_URL_PREFIX)
    ) {
      throw new Error("That didn't work. Please try again.");
    }
    button.textContent = "Reported";
    showIssue(issueNumber, issueUrl);
  } catch (error) {
    button.disabled = false;
    button.textContent = "Report this bug";
    showError(
      error instanceof Error && error.message.startsWith("The demo")
        ? error.message
        : "That didn't work. Please try again.",
    );
  }
});
