const timeline = document.querySelector("#timeline");
const sourcesList = document.querySelector("#sources-list");
const revisionList = document.querySelector("#revision-list");
const finalSummary = document.querySelector("#final-summary");
const askbackPanel = document.querySelector("#askback-panel");
const askbackCopy = document.querySelector("#askback-copy");
const eventLogPreview = document.querySelector("#event-log-preview");

const stageLabel = document.querySelector("#stage-label");
const contractMode = document.querySelector("#contract-mode");
const agentState = document.querySelector("#agent-state");
const budgetStatus = document.querySelector("#budget-status");
const complianceStatus = document.querySelector("#compliance-status");
const runtimeConfidence = document.querySelector("#runtime-confidence");
const escalationCount = document.querySelector("#escalation-count");

const confidenceThreshold = document.querySelector("#confidence-threshold");
const escalationThreshold = document.querySelector("#escalation-threshold");
const confidenceValue = document.querySelector("#confidence-value");
const escalationValue = document.querySelector("#escalation-value");

const draftContractButton = document.querySelector("#draft-contract");
const startResearchButton = document.querySelector("#start-research");
const approveOnceButton = document.querySelector("#approve-once");
const reviseContractButton = document.querySelector("#revise-contract");
const denySourceButton = document.querySelector("#deny-source");
const rerunStepButton = document.querySelector("#rerun-step");
const resetDemoButton = document.querySelector("#reset-demo");
const startSessionButton = document.querySelector("#start-session");
const exportLogButton = document.querySelector("#export-log");

const participantIdInput = document.querySelector("#participant-id");
const conditionIdSelect = document.querySelector("#condition-id");
const sessionIdInput = document.querySelector("#session-id");
const researcherNotesInput = document.querySelector("#researcher-notes");
const sessionStatus = document.querySelector("#session-status");

const sourceBlogs = document.querySelector("#source-blogs");

const state = {
  stage: "task_setup",
  contractDrafted: false,
  runStarted: false,
  escalationActive: false,
  revised: false,
  completed: false,
  escalationEvents: 0,
  timeline: [],
  sources: [],
  revisions: [],
  eventLog: [],
  sessionActive: false,
  sessionId: null,
  sessionStartedAt: null,
};

const scenario = {
  official: {
    name: "Official product announcement",
    trust: "Trusted",
    note: "Primary source, aligned with contract.",
  },
  major: {
    name: "Major reporting summary",
    trust: "Trusted",
    note: "Secondary summary, still within policy.",
  },
  blog: {
    name: "Interpretive research blog",
    trust: "Outside preferred policy",
    note: "Conflicts with the official source on rollout scope.",
  },
};

function setButtonEnabled(button, enabled) {
  button.disabled = !enabled;
  button.classList.toggle("disabled", !enabled);
}

function addTimelineItem(title, note) {
  state.timeline.push({ title, note });
  renderTimeline();
}

function addSource(source) {
  state.sources.push(source);
  renderSources();
}

function addRevision(note) {
  state.revisions.push(note);
  renderRevisions();
}

function renderTimeline() {
  timeline.innerHTML = "";
  state.timeline.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.title}</strong><span>${item.note}</span>`;
    timeline.appendChild(li);
  });
}

function renderSources() {
  sourcesList.innerHTML = "";
  state.sources.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.name}</strong>${item.trust}: ${item.note}`;
    sourcesList.appendChild(li);
  });
}

function renderRevisions() {
  revisionList.innerHTML = "";
  if (!state.revisions.length) {
    const li = document.createElement("li");
    li.textContent = "No contract revisions yet.";
    revisionList.appendChild(li);
    return;
  }

  state.revisions.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    revisionList.appendChild(li);
  });
}

function renderSummary() {
  if (!state.completed) {
    finalSummary.textContent =
      "Finish the scenario to generate a governance-aware result summary.";
    finalSummary.classList.add("empty");
    return;
  }

  finalSummary.classList.remove("empty");
  finalSummary.textContent =
    "Research brief complete.\n\n" +
    "Result:\nThe feature change is supported by the official announcement and major reporting, but a conflicting interpretation from a secondary blog was excluded after the user tightened the contract.\n\n" +
    "Governance impact:\n- 1 escalation triggered by source-policy mismatch and conflicting evidence\n- Contract revised to remove research blogs from allowed sources\n- Synthesis rerun from the last safe checkpoint\n- Final output is shorter but more reliable under the chosen policy";
}

function renderEventLogPreview() {
  eventLogPreview.innerHTML = "";

  if (!state.eventLog.length) {
    const li = document.createElement("li");
    li.textContent = "No events logged yet.";
    eventLogPreview.appendChild(li);
    return;
  }

  state.eventLog.slice(-8).forEach((entry) => {
    const li = document.createElement("li");
    li.innerHTML = `<code>${entry.timestamp}</code> ${entry.type}`;
    eventLogPreview.appendChild(li);
  });
}

function nowIso() {
  return new Date().toISOString();
}

function createSessionId() {
  return `session-${Date.now().toString(36)}`;
}

function logEvent(type, payload = {}) {
  if (!state.sessionActive) {
    return;
  }

  state.eventLog.push({
    timestamp: nowIso(),
    type,
    stage: state.stage,
    participantId: participantIdInput.value.trim() || null,
    condition: conditionIdSelect.value,
    payload,
  });
  renderEventLogPreview();
}

function currentContractSnapshot() {
  return {
    officialSources: document.querySelector("#source-official").checked,
    majorReporting: document.querySelector("#source-major").checked,
    researchBlogs: sourceBlogs.checked,
    banForums: document.querySelector("#ban-forums").checked,
    timeBudget: document.querySelector("#time-budget").value,
    toolScope: document.querySelector("#tool-scope").value,
    confidenceThreshold: Number(confidenceThreshold.value),
    escalationThreshold: Number(escalationThreshold.value),
  };
}

function resetAskbackPanel() {
  askbackPanel.className = "card callout neutral";
  askbackCopy.textContent =
    "The agent will pause here when a contract-relevant event occurs.";
  setButtonEnabled(approveOnceButton, false);
  setButtonEnabled(reviseContractButton, false);
  setButtonEnabled(denySourceButton, false);
}

function syncSliders() {
  confidenceValue.textContent = confidenceThreshold.value;
  escalationValue.textContent = escalationThreshold.value;
}

function initialize() {
  state.stage = "task_setup";
  state.contractDrafted = false;
  state.runStarted = false;
  state.escalationActive = false;
  state.revised = false;
  state.completed = false;
  state.escalationEvents = 0;
  state.timeline = [];
  state.sources = [];
  state.revisions = [];

  sourceBlogs.checked = true;
  confidenceThreshold.value = 70;
  escalationThreshold.value = 55;
  syncSliders();

  stageLabel.textContent = "Task Setup";
  contractMode.textContent = "Draft";
  agentState.textContent = "Waiting for task";
  budgetStatus.textContent = "0 / 15 min";
  complianceStatus.textContent = "No active run";
  runtimeConfidence.textContent = "N/A";
  escalationCount.textContent = "0";
  sessionIdInput.value = state.sessionId || "";

  addTimelineItem(
    "Task received",
    "User requests a short research brief with source trust constraints."
  );

  renderSources();
  renderRevisions();
  renderSummary();
  renderEventLogPreview();
  resetAskbackPanel();
  setButtonEnabled(startResearchButton, false);
  setButtonEnabled(rerunStepButton, false);
  setButtonEnabled(exportLogButton, state.sessionActive);
}

function draftContract() {
  state.contractDrafted = true;
  state.stage = "contract_setup";
  stageLabel.textContent = "Contract Setup";
  contractMode.textContent = "Drafted by system";
  agentState.textContent = "Ready for review";

  addTimelineItem(
    "Draft contract prepared",
    "System proposes trusted sources, budgets, and escalation defaults."
  );

  setButtonEnabled(startResearchButton, true);
  logEvent("contract_drafted", {
    contract: currentContractSnapshot(),
  });
}

function startResearch() {
  state.runStarted = true;
  state.stage = "runtime";
  stageLabel.textContent = "Runtime Governance";
  contractMode.textContent = "Active";
  agentState.textContent = "Collecting evidence";
  budgetStatus.textContent = "6 / 15 min";
  complianceStatus.textContent = "Within contract";
  runtimeConfidence.textContent = "74%";

  addTimelineItem(
    "Execution started",
    "Agent begins a bounded research loop under the active contract."
  );

  addSource(scenario.official);
  addSource(scenario.major);
  addTimelineItem(
    "Trusted sources collected",
    "Official announcement and major reporting agree on the core feature change."
  );
  logEvent("research_started", {
    contract: currentContractSnapshot(),
    budgetStatus: "6 / 15 min",
  });

  window.setTimeout(triggerEscalation, 400);
}

function triggerEscalation() {
  state.escalationActive = true;
  state.escalationEvents += 1;
  state.stage = "askback";

  stageLabel.textContent = "Ask-Back";
  agentState.textContent = "Paused for user decision";
  budgetStatus.textContent = "10 / 15 min";
  complianceStatus.textContent = "Conflict outside preferred policy";
  runtimeConfidence.textContent = "61%";
  escalationCount.textContent = String(state.escalationEvents);

  addSource(scenario.blog);
  addTimelineItem(
    "Escalation triggered",
    "A conflicting blog source falls outside the preferred source policy."
  );

  askbackPanel.className = "card callout warning";
  askbackCopy.textContent =
    "The agent found a conflicting interpretation from a research blog. This source is outside the preferred policy. Approve it once, revise the contract, or deny it.";

  setButtonEnabled(approveOnceButton, true);
  setButtonEnabled(reviseContractButton, true);
  setButtonEnabled(denySourceButton, true);
  logEvent("askback_triggered", {
    trigger: "source_conflict_outside_policy",
    source: scenario.blog.name,
  });
}

function reviseContract() {
  if (!state.escalationActive) {
    return;
  }

  state.revised = true;
  state.stage = "repair";
  sourceBlogs.checked = false;
  contractMode.textContent = "Revised";
  stageLabel.textContent = "Repair and Rerun";
  agentState.textContent = "Waiting for rerun";

  addRevision("Removed research blogs from allowed sources after escalation.");
  addTimelineItem(
    "Contract revised",
    "User tightens source policy instead of approving the exception."
  );

  askbackPanel.className = "card callout safe";
  askbackCopy.textContent =
    "Revision recorded. The system can now rerun from the last safe checkpoint using the updated contract.";

  setButtonEnabled(approveOnceButton, false);
  setButtonEnabled(reviseContractButton, false);
  setButtonEnabled(denySourceButton, false);
  setButtonEnabled(rerunStepButton, true);
  logEvent("contract_revised", {
    revision: "Removed research blogs from allowed sources.",
    contract: currentContractSnapshot(),
  });
}

function rerunStep() {
  if (!state.revised) {
    return;
  }

  state.completed = true;
  state.stage = "final_summary";
  stageLabel.textContent = "Final Summary";
  agentState.textContent = "Run complete";
  budgetStatus.textContent = "12 / 15 min";
  complianceStatus.textContent = "Contract satisfied after repair";
  runtimeConfidence.textContent = "82%";

  addTimelineItem(
    "Synthesis rerun",
    "The agent reruns the synthesis step without the excluded source type."
  );
  addTimelineItem(
    "Governance-aware output produced",
    "Final answer explains how the contract changed the result."
  );

  renderSummary();
  setButtonEnabled(rerunStepButton, false);
  logEvent("run_completed", {
    finalConfidence: "82%",
    escalationCount: state.escalationEvents,
    revisions: [...state.revisions],
  });
}

function startStudySession() {
  state.sessionActive = true;
  state.sessionId = createSessionId();
  state.sessionStartedAt = nowIso();
  state.eventLog = [];
  sessionIdInput.value = state.sessionId;
  sessionStatus.textContent = `Session active: ${state.sessionId}`;
  setButtonEnabled(exportLogButton, true);
  logEvent("session_started", {
    sessionStartedAt: state.sessionStartedAt,
    participantId: participantIdInput.value.trim() || null,
    condition: conditionIdSelect.value,
    researcherNotes: researcherNotesInput.value.trim() || null,
  });
}

function exportSessionLog() {
  if (!state.sessionActive) {
    return;
  }

  const payload = {
    sessionId: state.sessionId,
    sessionStartedAt: state.sessionStartedAt,
    participantId: participantIdInput.value.trim() || null,
    condition: conditionIdSelect.value,
    researcherNotes: researcherNotesInput.value.trim() || null,
    finalStage: state.stage,
    finalContract: currentContractSnapshot(),
    finalRevisions: [...state.revisions],
    eventLog: state.eventLog,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.sessionId || "delegation-contract-session"}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  logEvent("session_exported", {
    eventCount: state.eventLog.length,
  });
}

draftContractButton.addEventListener("click", draftContract);
startResearchButton.addEventListener("click", startResearch);
reviseContractButton.addEventListener("click", reviseContract);
rerunStepButton.addEventListener("click", rerunStep);
resetDemoButton.addEventListener("click", initialize);
startSessionButton.addEventListener("click", startStudySession);
exportLogButton.addEventListener("click", exportSessionLog);

approveOnceButton.addEventListener("click", () => {
  if (!state.escalationActive) {
    return;
  }

  addRevision("Approved the conflicting source once without changing policy.");
  addTimelineItem(
    "One-time exception approved",
    "This path keeps the run moving but weakens the governance argument."
  );
  askbackCopy.textContent =
    "One-time approval recorded. Reset the demo if you want to show the repair-and-rerun path.";
  setButtonEnabled(approveOnceButton, false);
  setButtonEnabled(reviseContractButton, false);
  setButtonEnabled(denySourceButton, false);
  logEvent("approve_once", {
    source: scenario.blog.name,
  });
});

denySourceButton.addEventListener("click", () => {
  if (!state.escalationActive) {
    return;
  }

  addRevision("Denied the out-of-policy source for this run.");
  addTimelineItem(
    "Source denied",
    "The run rejects the conflicting source but does not revise the broader policy."
  );
  askbackCopy.textContent =
    "Source denied for this run. Reset the demo if you want to show explicit contract revision.";
  setButtonEnabled(approveOnceButton, false);
  setButtonEnabled(reviseContractButton, false);
  setButtonEnabled(denySourceButton, false);
  logEvent("deny_source", {
    source: scenario.blog.name,
  });
});

confidenceThreshold.addEventListener("input", syncSliders);
escalationThreshold.addEventListener("input", syncSliders);
participantIdInput.addEventListener("change", () => {
  logEvent("participant_updated", {
    participantId: participantIdInput.value.trim() || null,
  });
});
conditionIdSelect.addEventListener("change", () => {
  logEvent("condition_updated", {
    condition: conditionIdSelect.value,
  });
});
researcherNotesInput.addEventListener("change", () => {
  logEvent("researcher_notes_updated", {
    researcherNotes: researcherNotesInput.value.trim() || null,
  });
});
document.querySelectorAll("input[type='checkbox'], select").forEach((element) => {
  if (element.id === "condition-id") {
    return;
  }

  element.addEventListener("change", () => {
    logEvent("contract_control_changed", {
      control: element.id,
      value: element.type === "checkbox" ? element.checked : element.value,
      contract: currentContractSnapshot(),
    });
  });
});
confidenceThreshold.addEventListener("change", () => {
  logEvent("contract_control_changed", {
    control: "confidence-threshold",
    value: Number(confidenceThreshold.value),
    contract: currentContractSnapshot(),
  });
});
escalationThreshold.addEventListener("change", () => {
  logEvent("contract_control_changed", {
    control: "escalation-threshold",
    value: Number(escalationThreshold.value),
    contract: currentContractSnapshot(),
  });
});

initialize();
