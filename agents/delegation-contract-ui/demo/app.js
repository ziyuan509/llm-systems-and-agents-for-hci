// DOM references
const appShell = document.querySelector(".app-shell");
const timeline = document.querySelector("#timeline");
const contextList = document.querySelector("#context-list");
const revisionList = document.querySelector("#revision-list");
const finalSummary = document.querySelector("#final-summary");
const askbackPanel = document.querySelector("#askback-panel");
const askbackTitle = document.querySelector("#askback-title");
const askbackCopy = document.querySelector("#askback-copy");
const askbackRule = document.querySelector("#askback-rule");
const askbackRisk = document.querySelector("#askback-risk");
const askbackImpact = document.querySelector("#askback-impact");
const eventLogPreview = document.querySelector("#event-log-preview");
const runtimeLog = document.querySelector("#runtime-log");
const runtimeLogTitle = document.querySelector("#runtime-log-title");
const runtimeLogBadge = document.querySelector("#runtime-log-badge");
const conditionCopy = document.querySelector("#condition-copy");
const contractCard = document.querySelector("#contract-card");
const contractPreview = document.querySelector("#contract-preview");
const progressSteps = document.querySelectorAll("[data-progress-step]");

const stageLabel = document.querySelector("#stage-label");
const contractMode = document.querySelector("#contract-mode");
const agentState = document.querySelector("#agent-state");
const budgetStatus = document.querySelector("#budget-status");
const complianceStatus = document.querySelector("#compliance-status");
const runtimeConfidence = document.querySelector("#runtime-confidence");
const escalationCount = document.querySelector("#escalation-count");

const summarizeNotes = document.querySelector("#summarizeNotes");
const rememberTaskPreferences = document.querySelector("#rememberTaskPreferences");
const askBeforePersonalMemory = document.querySelector("#askBeforePersonalMemory");
const bystanderApprovalRequired = document.querySelector("#bystanderApprovalRequired");
const externalSharingApproval = document.querySelector("#externalSharingApproval");
const timeBudgetSelect = document.querySelector("#time-budget");
const toolScopeSelect = document.querySelector("#tool-scope");
const confidenceThreshold = document.querySelector("#confidence-threshold");
const escalationThreshold = document.querySelector("#escalation-threshold");
const confidenceValue = document.querySelector("#confidence-value");
const escalationValue = document.querySelector("#escalation-value");

const draftContractButton = document.querySelector("#draft-contract");
const startRunButton = document.querySelector("#start-run");
const backToTaskButton = document.querySelector("#back-to-task");
const backToTaskSecondaryButton = document.querySelector("#back-to-task-secondary");
const backToBoundariesButton = document.querySelector("#back-to-boundaries");
const backToRunButton = document.querySelector("#back-to-run");
const reviewEditBoundariesButton = document.querySelector("#review-edit-boundaries");
const approveOnceButton = document.querySelector("#approve-once");
const reviseContractButton = document.querySelector("#revise-contract");
const excludeContentButton = document.querySelector("#exclude-content");
const rerunStepButton = document.querySelector("#rerun-step");
const resetDemoButton = document.querySelector("#reset-demo");
const startSessionButton = document.querySelector("#start-session");
const exportLogButton = document.querySelector("#export-log");

const participantIdInput = document.querySelector("#participant-id");
const conditionIdSelect = document.querySelector("#condition-id");
const sessionIdInput = document.querySelector("#session-id");
const researcherNotesInput = document.querySelector("#researcher-notes");
const sessionStatus = document.querySelector("#session-status");

// Static configuration
const contractControls = [
  summarizeNotes,
  rememberTaskPreferences,
  askBeforePersonalMemory,
  bystanderApprovalRequired,
  externalSharingApproval,
  timeBudgetSelect,
  toolScopeSelect,
  confidenceThreshold,
  escalationThreshold,
];

const conditionModes = {
  governance: {
    badge: "Governance",
    runtimeTitle: "Governance log",
    contractEditable: true,
    stageLabel: "Runtime Governance",
    draftButton: "Continue to boundaries",
    startButton: "Start run",
    askbackTitle: "No decision needed",
    askbackDefault:
      "The assistant will pause here when a boundary needs your decision.",
    conditionCopy:
      "Contract UI exposes controls, ask-back, and durable repair across sensing, memory, actions, disclosure, and escalation.",
    contractModeIdle: "Draft",
    contractModeActive: "Active",
    approveLabel: "Use once, anonymized",
    reviseLabel: "Make this a rule",
    denyLabel: "Exclude from summary",
    rerunLabel: "Rerun from safe checkpoint",
  },
  blackbox: {
    badge: "Black box",
    runtimeTitle: "System internals hidden",
    contractEditable: false,
    stageLabel: "Black-box Run",
    draftButton: "Continue with preset",
    startButton: "Start baseline",
    askbackTitle: "Run interruption",
    askbackDefault:
      "This baseline does not interrupt the run for privacy repair. The system proceeds with its preset behavior.",
    conditionCopy:
      "Black-box baseline offers no visible controls, no ask-back, and no durable repair; " +
      "participants only see progress and the final output.",
    contractModeIdle: "Preset hidden",
    contractModeActive: "Preset hidden",
    approveLabel: "Use once, anonymized",
    reviseLabel: "Make this a rule",
    denyLabel: "Exclude from summary",
    rerunLabel: "Rerun from safe checkpoint",
  },
  oversight: {
    badge: "Oversight",
    runtimeTitle: "Oversight log",
    contractEditable: false,
    stageLabel: "Oversight Run",
    draftButton: "Continue to oversight",
    startButton: "Start oversight run",
    askbackTitle: "Oversight checkpoint",
    askbackDefault:
      "This baseline reveals step-level privacy markers instead of high-level contract repair controls.",
    conditionCopy:
      "Oversight baseline surfaces privacy markers, but it does not let participants convert a decision into a reusable contract repair.",
    contractModeIdle: "Preset hidden",
    contractModeActive: "Oversight visible",
    approveLabel: "Continue Run",
    reviseLabel: "Make this a rule",
    denyLabel: "Exclude from summary",
    rerunLabel: "Rerun from safe checkpoint",
  },
};

const scenario = {
  taskNote:
    "User delegates a shared studio meeting to an ambient assistant with bystander privacy constraints.",
  contexts: [
    {
      id: "notes",
      type: "notes",
      name: "User spoken notes",
      note: "Summarizes the user's own meeting contributions and action items.",
      budget: 2,
      confidenceDelta: 8,
      conflict: false,
    },
    {
      id: "memory",
      type: "memory",
      name: "Action-item memory",
      note: "Stores the user's own action items while avoiding unrelated personal details.",
      budget: 4,
      confidenceDelta: 6,
      conflict: false,
    },
    {
      id: "bystander",
      type: "bystander",
      name: "Bystander voice segment",
      note: "Detects another student's comment while drafting the meeting summary.",
      budget: 4,
      confidenceDelta: -13,
      conflict: true,
    },
  ],
};

// Runtime state
const state = {
  stage: "task_setup",
  contractDrafted: false,
  runStarted: false,
  escalationActive: false,
  revised: false,
  completed: false,
  escalationEvents: 0,
  timeline: [],
  contexts: [],
  revisions: [],
  eventLog: [],
  runtimeLog: [],
  sessionActive: false,
  sessionId: null,
  sessionStartedAt: null,
  runtimeBudgetUsed: 0,
  currentConfidence: null,
  summarySections: [],
  activeCondition: "governance",
  queuedSteps: [],
  pausedEvent: null,
  timerId: null,
  blockedContextIds: [],
  runOutcome: "governance_repair",
};

// Shared helpers
function clearElement(element) {
  element.replaceChildren();
}

function createTextElement(tagName, text, className) {
  const element = document.createElement(tagName);
  element.textContent = text;

  if (className) {
    element.className = className;
  }

  return element;
}

function appendAuditSection(parent, title, content) {
  const section = document.createElement("section");
  section.className = "audit-section";
  section.appendChild(createTextElement("h4", title));

  if (Array.isArray(content)) {
    const list = document.createElement("ul");
    content.forEach((item) => {
      list.appendChild(createTextElement("li", item));
    });
    section.appendChild(list);
  } else {
    section.appendChild(createTextElement("p", content));
  }

  parent.appendChild(section);
}

function setButtonEnabled(button, enabled) {
  button.disabled = !enabled;
  button.classList.toggle("disabled", !enabled);
}

function clearTimer() {
  if (state.timerId) {
    window.clearTimeout(state.timerId);
    state.timerId = null;
  }
}

function getConditionKey() {
  const label = conditionIdSelect.value;
  if (label === "Black-box baseline") {
    return "blackbox";
  }
  if (label === "Oversight baseline") {
    return "oversight";
  }
  return "governance";
}

function getConditionConfig() {
  return conditionModes[state.activeCondition];
}

function addTimelineItem(title, note) {
  state.timeline.push({ title, note });
  renderTimeline();
}

function addContextRecord(context) {
  state.contexts.push(context);
  renderContextRecords();
}

function addRevision(note) {
  state.revisions.push(note);
  renderRevisions();
}

function addRuntimeLog(label, detail) {
  state.runtimeLog.push({ label, detail });
  renderRuntimeLog();
}

function getProgressStep(stage) {
  if (stage === "task_setup") {
    return "task";
  }
  if (stage === "contract_setup") {
    return "boundaries";
  }
  if (stage === "final_summary") {
    return "review";
  }
  return "run";
}

function syncProgressStep() {
  const activeStep = getProgressStep(state.stage);
  const order = ["task", "boundaries", "run", "review"];
  const activeIndex = order.indexOf(activeStep);

  appShell.dataset.view = activeStep;

  progressSteps.forEach((step) => {
    const stepIndex = order.indexOf(step.dataset.progressStep);
    step.classList.toggle("is-active", step.dataset.progressStep === activeStep);
    step.classList.toggle("is-complete", stepIndex >= 0 && stepIndex < activeIndex);
  });
}

function getTimelineStatus(item) {
  const text = `${item.title} ${item.note}`.toLowerCase();

  if (text.includes("escalation") || text.includes("bystander content")) {
    return { label: "Needs decision", className: "warning" };
  }
  if (text.includes("waiting") || text.includes("paused")) {
    return { label: "Paused", className: "paused" };
  }
  if (text.includes("complete") || text.includes("output produced")) {
    return { label: "Done", className: "done" };
  }
  return { label: "Allowed", className: "allowed" };
}

// Render functions
function renderTimeline() {
  clearElement(timeline);
  state.timeline.forEach((item, index) => {
    const li = document.createElement("li");
    const status = getTimelineStatus(item);
    const indexMarker = createTextElement(
      "span",
      String(index + 1),
      "timeline-index"
    );
    const copy = document.createElement("div");

    indexMarker.setAttribute("aria-hidden", "true");
    copy.className = "timeline-copy";
    copy.append(
      createTextElement("strong", item.title),
      createTextElement("span", item.note)
    );
    li.append(
      indexMarker,
      copy,
      createTextElement("span", status.label, `timeline-status ${status.className}`)
    );
    timeline.appendChild(li);
  });
}

function renderContextRecords() {
  clearElement(contextList);
  if (!state.contexts.length) {
    contextList.appendChild(
      createTextElement("li", "No ambient context handled yet.")
    );
    return;
  }

  state.contexts.forEach((item) => {
    const li = document.createElement("li");
    li.append(
      createTextElement("strong", item.name),
      document.createTextNode(`${item.trust}: ${item.note}`)
    );
    contextList.appendChild(li);
  });
}

function renderRevisions() {
  clearElement(revisionList);
  if (!state.revisions.length) {
    revisionList.appendChild(
      createTextElement("li", "No contract revisions yet.")
    );
    return;
  }

  state.revisions.forEach((item) => {
    revisionList.appendChild(createTextElement("li", item));
  });
}

function renderRuntimeLog() {
  clearElement(runtimeLog);
  if (!state.runtimeLog.length) {
    runtimeLog.appendChild(createTextElement("li", "No runtime events yet."));
    return;
  }

  state.runtimeLog.slice(-10).forEach((entry) => {
    const li = document.createElement("li");
    li.append(
      createTextElement("strong", entry.label),
      createTextElement("span", entry.detail)
    );
    runtimeLog.appendChild(li);
  });
}

function renderSummary() {
  clearElement(finalSummary);

  if (!state.completed) {
    finalSummary.appendChild(
      createTextElement(
        "p",
        "Finish the scenario to generate a governance-aware result summary."
      )
    );
    finalSummary.classList.add("empty");
    return;
  }

  finalSummary.classList.remove("empty");
  state.summarySections.forEach((section) => {
    appendAuditSection(finalSummary, section.title, section.content);
  });
}

function renderEventLogPreview() {
  clearElement(eventLogPreview);
  if (!state.eventLog.length) {
    eventLogPreview.appendChild(
      createTextElement("li", "No events logged yet.")
    );
    return;
  }

  state.eventLog.slice(-8).forEach((entry) => {
    const li = document.createElement("li");
    li.append(
      createTextElement("code", entry.timestamp),
      document.createTextNode(` ${entry.type}`)
    );
    eventLogPreview.appendChild(li);
  });
}

function nowIso() {
  return new Date().toISOString();
}

function createSessionId() {
  return `session-${Date.now().toString(36)}`;
}

function getTimeBudgetLimit() {
  return Number.parseInt(timeBudgetSelect.value, 10);
}

function clampConfidence(value) {
  return Math.max(35, Math.min(92, value));
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
    summarizeNotes: summarizeNotes.checked,
    rememberTaskPreferences: rememberTaskPreferences.checked,
    askBeforePersonalMemory: askBeforePersonalMemory.checked,
    bystanderApprovalRequired: bystanderApprovalRequired.checked,
    externalSharingApproval: externalSharingApproval.checked,
    reviewWindow: timeBudgetSelect.value,
    allowedActions: toolScopeSelect.value,
    autonomyConfidence: Number(confidenceThreshold.value),
    privacyEscalation: Number(escalationThreshold.value),
  };
}

function buildContractPreview() {
  const contract = currentContractSnapshot();
  const lines = [];

  if (contract.summarizeNotes) {
    lines.push("The assistant may summarize my spoken notes.");
  } else {
    lines.push("The assistant should not summarize spoken notes automatically.");
  }

  if (contract.rememberTaskPreferences) {
    lines.push("It may remember my task preferences within the current project context.");
  } else {
    lines.push("It should not remember task preferences after this session.");
  }

  if (contract.askBeforePersonalMemory) {
    lines.push("It must ask before storing personal details.");
  }

  if (contract.bystanderApprovalRequired) {
    lines.push("It must not store or use bystander voices without explicit approval.");
  }

  if (contract.externalSharingApproval) {
    lines.push("It must ask before sharing content externally.");
  }

  lines.push(
    "If the situation involves bystander data, ambiguous consent, or external disclosure, " +
      "the assistant should pause and ask back instead of acting autonomously."
  );

  return lines.join(" ");
}

function renderContractPreview() {
  contractPreview.textContent = buildContractPreview();
}

function syncSliders() {
  confidenceValue.textContent = confidenceThreshold.value;
  escalationValue.textContent = escalationThreshold.value;
  renderContractPreview();
}

function setContractControlsLocked(locked) {
  contractCard.classList.toggle("is-locked", locked);
  contractControls.forEach((control) => {
    control.disabled = locked;
  });
}

function applyConditionUI() {
  state.activeCondition = getConditionKey();
  const config = getConditionConfig();

  runtimeLogTitle.textContent = config.runtimeTitle;
  runtimeLogBadge.textContent = config.badge;
  conditionCopy.textContent = config.conditionCopy;
  draftContractButton.textContent = config.draftButton;
  startRunButton.textContent = config.startButton;
  approveOnceButton.textContent = config.approveLabel;
  reviseContractButton.textContent = config.reviseLabel;
  excludeContentButton.textContent = config.denyLabel;
  rerunStepButton.textContent = config.rerunLabel;
  contractMode.textContent = config.contractModeIdle;
  setContractControlsLocked(!config.contractEditable);
}

function resetAskbackPanel() {
  const config = getConditionConfig();
  askbackPanel.className = "decision-card callout neutral";
  askbackTitle.textContent = config.askbackTitle;
  askbackCopy.textContent = config.askbackDefault;
  askbackRule.textContent = "No boundary triggered yet";
  askbackRisk.textContent = "No active risk";
  askbackImpact.textContent = "No decision needed";
  setButtonEnabled(approveOnceButton, false);
  setButtonEnabled(reviseContractButton, false);
  setButtonEnabled(excludeContentButton, false);
}

function resetRunProgress() {
  clearTimer();
  state.runStarted = false;
  state.escalationActive = false;
  state.revised = false;
  state.completed = false;
  state.escalationEvents = 0;
  state.contexts = [];
  state.revisions = [];
  state.runtimeLog = [];
  state.runtimeBudgetUsed = 0;
  state.currentConfidence = 68;
  state.summarySections = [];
  state.queuedSteps = [];
  state.pausedEvent = null;
  state.blockedContextIds = [];
  state.runOutcome = "governance_repair";

  budgetStatus.textContent = `0 / ${getTimeBudgetLimit()} min`;
  complianceStatus.textContent = "No active run";
  runtimeConfidence.textContent = "N/A";
  escalationCount.textContent = "0";
  renderContextRecords();
  renderRevisions();
  renderRuntimeLog();
  renderSummary();
  resetAskbackPanel();
  setButtonEnabled(rerunStepButton, false);
}

function goToTask() {
  resetRunProgress();
  state.stage = "task_setup";
  state.contractDrafted = false;
  state.timeline = [];
  syncProgressStep();

  stageLabel.textContent = "Task Setup";
  contractMode.textContent = getConditionConfig().contractModeIdle;
  agentState.textContent = "Waiting for shared-space task";
  setButtonEnabled(startRunButton, false);
  addTimelineItem("Task received", scenario.taskNote);
}

function goToBoundaries() {
  resetRunProgress();
  state.stage = "contract_setup";
  state.contractDrafted = true;
  state.timeline = [];
  syncProgressStep();

  stageLabel.textContent = "Contract Setup";
  contractMode.textContent = getConditionConfig().contractEditable
    ? "Drafted by system"
    : getConditionConfig().contractModeIdle;
  agentState.textContent = "Ready for review";
  setButtonEnabled(startRunButton, true);
  addTimelineItem("Task received", scenario.taskNote);
  addTimelineItem(
    "Draft contract prepared",
    "System proposes sensing, memory, disclosure, and escalation defaults."
  );
}

function goToRunReview() {
  clearTimer();
  state.stage = "runtime";
  state.completed = false;
  state.escalationActive = false;
  state.pausedEvent = null;
  syncProgressStep();

  stageLabel.textContent = getConditionConfig().stageLabel;
  agentState.textContent = "Run ready for review";
  complianceStatus.textContent = "Previous run available for review";
  renderSummary();
  resetAskbackPanel();
  setButtonEnabled(startRunButton, false);
  setButtonEnabled(rerunStepButton, false);
}

function resetRunState() {
  clearTimer();
  state.stage = "task_setup";
  state.contractDrafted = false;
  state.runStarted = false;
  state.escalationActive = false;
  state.revised = false;
  state.completed = false;
  state.escalationEvents = 0;
  state.timeline = [];
  state.contexts = [];
  state.revisions = [];
  state.runtimeLog = [];
  state.runtimeBudgetUsed = 0;
  state.currentConfidence = 68;
  state.summarySections = [];
  state.queuedSteps = [];
  state.pausedEvent = null;
  state.blockedContextIds = [];
  state.runOutcome = "governance_repair";
}

function setDefaultControls() {
  summarizeNotes.checked = true;
  rememberTaskPreferences.checked = true;
  askBeforePersonalMemory.checked = true;
  bystanderApprovalRequired.checked = true;
  externalSharingApproval.checked = true;
  timeBudgetSelect.value = "15 minutes";
  toolScopeSelect.value = "Summarize + draft follow-up";
  confidenceThreshold.value = 70;
  escalationThreshold.value = 55;
  syncSliders();
  renderContractPreview();
}

function initialize() {
  resetRunState();
  setDefaultControls();
  applyConditionUI();
  syncProgressStep();

  stageLabel.textContent = "Task Setup";
  agentState.textContent = "Waiting for shared-space task";
  budgetStatus.textContent = "0 / 15 min";
  complianceStatus.textContent = "No active run";
  runtimeConfidence.textContent = "N/A";
  escalationCount.textContent = "0";
  sessionIdInput.value = state.sessionId || "";
  sessionStatus.textContent = state.sessionActive
    ? `Session active: ${state.sessionId}`
    : "Start a session before running the scenario so events can be logged.";

  addTimelineItem("Task received", scenario.taskNote);
  renderContextRecords();
  renderRevisions();
  renderRuntimeLog();
  renderSummary();
  renderEventLogPreview();
  resetAskbackPanel();
  setButtonEnabled(startRunButton, false);
  setButtonEnabled(rerunStepButton, false);
  setButtonEnabled(exportLogButton, state.sessionActive);
}

function draftContract() {
  const config = getConditionConfig();
  state.contractDrafted = true;
  state.stage = "contract_setup";
  syncProgressStep();

  stageLabel.textContent = "Contract Setup";
  contractMode.textContent = config.contractEditable
    ? "Drafted by system"
    : config.contractModeIdle;
  agentState.textContent = config.contractEditable
    ? "Ready for review"
    : "Preset loaded";

  addTimelineItem(
    config.contractEditable ? "Draft contract prepared" : "Baseline preset loaded",
    config.contractEditable
      ? "System proposes sensing, memory, disclosure, and escalation defaults."
      : "System loads a fixed privacy behavior so the participant sees the comparison condition."
  );

  addRuntimeLog(
    "Planner",
    config.contractEditable
      ? "Autonomy boundaries are available before sensing and disclosure actions start."
      : "This condition fixes the policy before execution."
  );

  setButtonEnabled(startRunButton, true);
  logEvent("contract_drafted", {
    contract: currentContractSnapshot(),
    condition: state.activeCondition,
  });
}

function buildRunQueue() {
  const contract = currentContractSnapshot();
  const steps = [
    {
      type: "plan",
      label: "Shared-space task parsed into sensing, memory, and disclosure checks.",
    },
  ];

  if (contract.summarizeNotes) {
    steps.push({ type: "collect", context: scenario.contexts[0] });
  } else {
    steps.push({
      type: "skip",
      context: scenario.contexts[0],
      reason: "Summarizing the user's spoken notes is disabled in the current contract.",
    });
  }

  if (contract.rememberTaskPreferences) {
    steps.push({ type: "collect", context: scenario.contexts[1] });
  } else {
    steps.push({
      type: "skip",
      context: scenario.contexts[1],
      reason: "Longer-term memory updates are disabled in the current contract.",
    });
  }

  steps.push({ type: "collect", context: scenario.contexts[2] });
  steps.push({ type: "synthesize" });
  return steps;
}

function startAmbientRun() {
  if (!state.contractDrafted || state.runStarted) {
    return;
  }

  const config = getConditionConfig();
  state.runStarted = true;
  state.stage = "runtime";
  state.queuedSteps = buildRunQueue();
  state.currentConfidence = 68;
  syncProgressStep();

  stageLabel.textContent = config.stageLabel;
  contractMode.textContent = config.contractModeActive;
  agentState.textContent = "Planning bounded ambient run";
  budgetStatus.textContent = `0 / ${getTimeBudgetLimit()} min`;
  complianceStatus.textContent = config.contractEditable
    ? "Within contract"
    : "Preset condition active";
  runtimeConfidence.textContent = `${state.currentConfidence}%`;

  addTimelineItem(
    "Execution started",
    config.contractEditable
      ? "Assistant begins a bounded ambient run under the active contract."
      : "Assistant begins the same shared-space task under a comparison condition."
  );
  addRuntimeLog(
    "Loop start",
    `${state.queuedSteps.length - 1} sensing, memory, and disclosure checks queued.`
  );

  logEvent("ambient_run_started", {
    contract: currentContractSnapshot(),
    condition: state.activeCondition,
    queuedSteps: state.queuedSteps.map((step) => step.type),
  });

  scheduleNextStep(320);
}

function scheduleNextStep(delay = 260) {
  clearTimer();
  state.timerId = window.setTimeout(runNextStep, delay);
}

function runNextStep() {
  if (state.pausedEvent || state.completed) {
    return;
  }

  const step = state.queuedSteps.shift();
  if (!step) {
    completeRun(state.runOutcome);
    return;
  }

  if (step.type === "plan") {
    addRuntimeLog("Planner", step.label);
    scheduleNextStep();
    return;
  }

  if (step.type === "skip") {
    addRuntimeLog("Skip", `${step.context.name} skipped. ${step.reason}`);
    scheduleNextStep();
    return;
  }

  if (step.type === "collect") {
    handleContextStep(step.context);
    return;
  }

  if (step.type === "synthesize") {
    handleSynthesisStep();
  }
}

function makeContextRecord(context, trust, note) {
  return {
    name: context.name,
    trust,
    note,
  };
}

function updateRuntimeStatus() {
  budgetStatus.textContent = `${state.runtimeBudgetUsed} / ${getTimeBudgetLimit()} min`;
  runtimeConfidence.textContent = `${state.currentConfidence}%`;
}

function evaluateContext(context) {
  const contract = currentContractSnapshot();
  const outsidePolicy =
    context.type === "bystander" && contract.bystanderApprovalRequired;
  const conflict = context.conflict;
  let riskScore = 28;

  if (outsidePolicy) {
    riskScore = 84;
  } else if (conflict) {
    riskScore = 64;
  }

  return {
    context,
    outsidePolicy,
    conflict,
    riskScore,
    shouldEscalate:
      state.activeCondition === "governance" &&
      riskScore >= contract.privacyEscalation,
    shouldPauseOversight: state.activeCondition === "oversight" && conflict,
  };
}

function handleContextStep(context) {
  const evaluation = evaluateContext(context);
  state.runtimeBudgetUsed += context.budget;
  state.currentConfidence = clampConfidence(
    state.currentConfidence + context.confidenceDelta
  );

  addRuntimeLog("Context check", `Handled ${context.name}. ${context.note}`);

  if (!evaluation.outsidePolicy) {
    addContextRecord(
      makeContextRecord(
        context,
        context.conflict ? "Sensitive / boundary risk" : "Allowed context",
        evaluation.conflict
          ? "Includes bystander information and lowers autonomy confidence."
          : context.note
      )
    );
  } else {
    addContextRecord(
      makeContextRecord(
        context,
        "Ask-back required",
        "Detected during the ambient run, and the contract requires user confirmation before storage or disclosure."
      )
    );
  }

  if (context.id === "memory") {
    addTimelineItem(
      "User context prepared",
      "The assistant can summarize the meeting and remember the user's own action items."
    );
  }

  if (evaluation.shouldEscalate) {
    triggerGovernanceAskback(evaluation);
    return;
  }

  if (evaluation.shouldPauseOversight) {
    triggerOversightPause(evaluation);
    return;
  }

  if (evaluation.conflict && state.activeCondition === "blackbox") {
    state.runOutcome = "blackbox_hidden_conflict";
    complianceStatus.textContent = "Bystander risk absorbed into baseline run";
    addTimelineItem(
      "Bystander content absorbed",
      "The baseline keeps running without exposing a privacy repair path."
    );
    addRuntimeLog(
      "Policy hidden",
      "Bystander information remains in the summary path without user intervention."
    );
  } else if (evaluation.conflict) {
    complianceStatus.textContent = evaluation.outsidePolicy
      ? "Bystander content requires user confirmation"
      : "Privacy risk noted below escalation threshold";
    state.runOutcome = evaluation.outsidePolicy
      ? "denied_for_run"
      : "governance_no_pause";
  } else {
    complianceStatus.textContent =
      state.activeCondition === "governance"
        ? "Within contract"
        : "Preset condition active";
  }

  updateRuntimeStatus();
  logEvent("context_handled", {
    context: context.name,
    conflict: evaluation.conflict,
    outsidePolicy: evaluation.outsidePolicy,
    riskScore: evaluation.riskScore,
  });
  scheduleNextStep();
}

function triggerGovernanceAskback(evaluation) {
  state.pausedEvent = evaluation;
  state.escalationActive = true;
  state.escalationEvents += 1;
  state.stage = "askback";
  state.runOutcome = "governance_repair";
  syncProgressStep();

  stageLabel.textContent = "Ask-Back";
  agentState.textContent = "Paused for policy decision";
  complianceStatus.textContent = evaluation.outsidePolicy
    ? "Bystander content requires ask-back"
    : "Privacy risk exceeds escalation threshold";
  escalationCount.textContent = String(state.escalationEvents);
  updateRuntimeStatus();

  addTimelineItem(
    "Escalation triggered",
    evaluation.outsidePolicy
      ? "The assistant detected bystander speech outside the active sensing boundary."
      : "A privacy-sensitive context crosses the escalation threshold and requires contract guidance."
  );
  addRuntimeLog(
    "Escalation",
    `Paused at privacy risk score ${evaluation.riskScore} for ${evaluation.context.name}.`
  );

  askbackPanel.className = "decision-card callout warning";
  askbackTitle.textContent = "The assistant needs your decision";
  askbackCopy.textContent = evaluation.outsidePolicy
    ? "Possible bystander comment detected. The assistant found a comment " +
      "that may belong to someone else in the shared studio."
    : "The assistant found privacy-sensitive context. " +
      "The current contract requires ask-back before storing personal details or disclosing content externally.";
  askbackRule.textContent = evaluation.outsidePolicy
    ? "Bystander data requires approval."
    : "Personal details require approval before storage or disclosure.";
  askbackRisk.textContent =
    "The detected comment may belong to another person in the shared space.";
  askbackImpact.textContent =
    "Approving will include this content once. Excluding will remove it from the summary. " +
    "Revising the contract will apply this rule to future similar cases.";
  setButtonEnabled(approveOnceButton, true);
  setButtonEnabled(reviseContractButton, true);
  setButtonEnabled(excludeContentButton, true);

  logEvent("bystander_risk_detected", {
    context: evaluation.context.name,
    riskScore: evaluation.riskScore,
    outsidePolicy: evaluation.outsidePolicy,
  });
  logEvent("ask_back_triggered", {
    rule: "bystander_approval_required",
    context: evaluation.context.name,
  });
}

function triggerOversightPause(evaluation) {
  state.pausedEvent = evaluation;
  state.escalationActive = true;
  state.escalationEvents += 1;
  state.stage = "oversight_pause";
  state.runOutcome = "oversight_continued";
  syncProgressStep();

  stageLabel.textContent = "Oversight Checkpoint";
  agentState.textContent = "Paused for oversight review";
  complianceStatus.textContent = "Privacy marker surfaced";
  escalationCount.textContent = String(state.escalationEvents);
  updateRuntimeStatus();

  addTimelineItem(
    "Oversight checkpoint reached",
    "The baseline pauses at a privacy marker rather than a contract repair prompt."
  );
  addRuntimeLog(
    "Privacy marker",
    "A bystander voice segment was detected while preparing the shared-space summary."
  );

  askbackPanel.className = "decision-card callout neutral";
  askbackTitle.textContent = "Oversight checkpoint";
  askbackCopy.textContent =
    "The latest context includes another person's voice. This baseline can continue the run, " +
    "but it does not offer contract repair as the main decision.";
  askbackRule.textContent =
    "No editable delegation boundary is available in this baseline.";
  askbackRisk.textContent =
    `${evaluation.context.name} may be stored or disclosed without a reusable privacy rule.`;
  askbackImpact.textContent =
    "Continuing keeps bystander content in the final output path without revising future autonomy.";
  setButtonEnabled(approveOnceButton, true);
  setButtonEnabled(reviseContractButton, false);
  setButtonEnabled(excludeContentButton, false);

  logEvent("oversight_privacy_marker", {
    context: evaluation.context.name,
    riskScore: evaluation.riskScore,
  });
}

function reviseContract() {
  if (!state.pausedEvent || state.activeCondition !== "governance") {
    return;
  }

  state.revised = true;
  state.stage = "repair";
  syncProgressStep();
  state.escalationActive = false;
  state.pausedEvent = null;
  state.blockedContextIds.push("bystander");
  state.currentConfidence = clampConfidence(state.currentConfidence + 6);
  askBeforePersonalMemory.checked = true;
  bystanderApprovalRequired.checked = true;
  externalSharingApproval.checked = true;
  renderContractPreview();

  stageLabel.textContent = "Repair and Rerun";
  contractMode.textContent = "Revised";
  agentState.textContent = "Waiting for rerun";
  complianceStatus.textContent = "Revised policy ready for checkpoint rerun";

  addRevision("Contract revised: future bystander comments and personal details require explicit approval before storage or disclosure.");
  addRevision("Memory repair: private meeting details will not be stored without confirmation.");
  addTimelineItem(
    "Contract revised",
    "User tightens the sensing and disclosure boundary instead of approving the exception."
  );
  addTimelineItem(
    "Memory repair recorded",
    "The assistant attempted to store a private meeting detail; the repaired contract blocks similar memory updates."
  );
  addRuntimeLog(
    "Repair",
    "Participant excluded bystander voices and prepared a rerun from the last safe checkpoint."
  );
  addRuntimeLog(
    "Memory repair",
    "Memory update blocked. Future personal details from shared-space meetings require confirmation before storage."
  );

  askbackPanel.className = "decision-card callout safe";
  askbackTitle.textContent = "Repair recorded";
  askbackCopy.textContent =
    "Revision recorded. The system can rerun the summary without storing or disclosing " +
    "bystander content, and similar personal details now require confirmation before memory updates.";
  askbackRule.textContent =
    "Sensing boundary updated: bystander voices remain excluded.";
  askbackRisk.textContent =
    "The bystander comment will not shape this meeting summary or future memory.";
  askbackImpact.textContent =
    "The agent can continue from the checkpoint under revised sensing, memory, and disclosure boundaries.";
  setButtonEnabled(approveOnceButton, false);
  setButtonEnabled(reviseContractButton, false);
  setButtonEnabled(excludeContentButton, false);
  setButtonEnabled(rerunStepButton, true);
  updateRuntimeStatus();

  logEvent("contract_revised", {
    updatedRules: [
      "bystanderApprovalRequired",
      "askBeforePersonalMemory",
      "externalSharingApproval",
    ],
    contract: currentContractSnapshot(),
  });
}

function rerunStep() {
  if (!state.revised || state.activeCondition !== "governance") {
    return;
  }

  state.stage = "rerun";
  state.runOutcome = "governance_repair";
  syncProgressStep();
  state.runtimeBudgetUsed += 2;
  state.currentConfidence = clampConfidence(state.currentConfidence + 8);

  stageLabel.textContent = "Rerun";
  agentState.textContent = "Rerunning summary";
  complianceStatus.textContent = "Contract satisfied after repair";

  addTimelineItem(
    "Summary rerun",
    "The assistant reruns the summary without bystander content."
  );
  addRuntimeLog(
    "Rerun",
    "Restarted from the last safe checkpoint with bystander voices excluded from output and memory."
  );

  setButtonEnabled(rerunStepButton, false);
  updateRuntimeStatus();
  logEvent("safe_rerun_started", {
    blockedContexts: [...state.blockedContextIds],
  });

  scheduleCompletion("governance_repair");
}

function scheduleCompletion(outcome) {
  clearTimer();
  state.timerId = window.setTimeout(() => completeRun(outcome), 320);
}

function handleSynthesisStep() {
  state.stage = "synthesis";
  syncProgressStep();
  agentState.textContent = "Preparing meeting summary";
  complianceStatus.textContent =
    state.activeCondition === "blackbox"
      ? "Baseline preset completed"
      : "Preparing governed output";

  addRuntimeLog(
    "Prepare output",
    "Combining allowed notes and memory into the meeting summary."
  );
  updateRuntimeStatus();

  if (state.activeCondition === "blackbox") {
    state.runOutcome = "blackbox_hidden_conflict";
  } else if (state.activeCondition === "oversight") {
    state.runOutcome = "oversight_continued";
  } else if (state.runOutcome === "governance_repair") {
    state.runOutcome = state.pausedEvent ? "governance_repair" : "governance_no_pause";
  }

  scheduleCompletion(state.runOutcome);
}

function buildSummarySections(outcome) {
  if (outcome === "governance_repair") {
    return [
      {
        title: "Action paused",
        content:
          "The assistant paused before using a possible bystander comment.",
      },
      {
        title: "Rule used",
        content:
          "Bystander data requires approval before storage or disclosure.",
      },
      {
        title: "User decision",
        content:
          "The user excluded the bystander content and revised the contract.",
      },
      {
        title: "Repair outcome",
        content:
          "Future similar bystander comments and personal details will require explicit approval before storage or disclosure.",
      },
      {
        title: "Final output",
        content: [
          "Generated: private action-item summary.",
          "Used: user's spoken notes and action-item memory.",
          "Excluded: bystander voice segment.",
          "Not stored: private bystander or meeting details.",
        ],
      },
    ];
  }

  if (outcome === "approved_exception") {
    return [
      {
        title: "Result",
        content:
          "The final meeting summary includes an anonymized one-time mention of bystander context.",
      },
      {
        title: "Data used",
        content: [
          "Used: user's spoken notes",
          "Used: user's action-item memory",
          "Exception: anonymized bystander mention",
        ],
      },
      {
        title: "Actions and rules",
        content: [
          "Allowed: summarize the user's own notes.",
          "Escalated: bystander voice required ask-back before storage or disclosure.",
          "Allowed once: anonymized mention was included without changing the contract.",
        ],
      },
      {
        title: "Escalations",
        content: ["1 ask-back triggered by bystander privacy risk."],
      },
      {
        title: "Contract revisions",
        content: ["No durable policy change was recorded."],
      },
      {
        title: "Remaining uncertainty",
        content:
          "The exception helps this output but leaves future bystander handling unchanged.",
      },
    ];
  }

  if (outcome === "denied_for_run") {
    return [
      {
        title: "Result",
        content:
          "The final meeting summary excludes bystander content for this run only.",
      },
      {
        title: "Data used",
        content: [
          "Used: user's spoken notes",
          "Used: user's action-item memory",
          "Denied for this run: bystander voice segment",
        ],
      },
      {
        title: "Actions and rules",
        content: [
          "Allowed: summarize the user's own notes.",
          "Escalated: bystander voice required ask-back before storage or disclosure.",
          "Blocked for this run: bystander content was excluded without durable repair.",
        ],
      },
      {
        title: "Escalations",
        content: ["1 ask-back triggered by bystander privacy risk."],
      },
      {
        title: "Contract revisions",
        content: ["No reusable policy repair was saved."],
      },
      {
        title: "Remaining uncertainty",
        content:
          "Future runs could hit the same bystander boundary because the contract itself did not change.",
      },
    ];
  }

  if (outcome === "oversight_continued") {
    return [
      {
        title: "Result",
        content:
          "The final meeting summary includes bystander context after the participant continued from an oversight checkpoint.",
      },
      {
        title: "Data used",
        content: [
          "Used: user's spoken notes",
          "Used: user's action-item memory",
          "Included: bystander voice segment",
        ],
      },
      {
        title: "Actions and rules",
        content: [
          "Allowed: summarize the user's own notes.",
          "Surfaced: oversight marker showed bystander privacy risk.",
          "Continued: bystander content remained in the output path without policy repair.",
        ],
      },
      {
        title: "Escalations",
        content: ["1 oversight checkpoint surfaced bystander privacy risk."],
      },
      {
        title: "Contract revisions",
        content: ["No policy boundary was editable in this condition."],
      },
      {
        title: "Remaining uncertainty",
        content:
          "The interface shows the privacy risk, but it does not turn the decision into a reusable delegation policy.",
      },
    ];
  }

  if (outcome === "blackbox_hidden_conflict") {
    return [
      {
        title: "Result",
        content:
          "The final meeting summary includes bystander context without an explicit repair opportunity.",
      },
      {
        title: "Data used",
        content: [
          "Used: user's spoken notes",
          "Used: user's action-item memory",
          "Included without repair: bystander voice segment",
        ],
      },
      {
        title: "Actions and rules",
        content: [
          "Allowed: baseline summary proceeded under hidden policy assumptions.",
          "Not surfaced: bystander content was not escalated to the user.",
          "Not repaired: no durable contract update was available.",
        ],
      },
      {
        title: "Escalations",
        content: ["No intervention point was offered during execution."],
      },
      {
        title: "Contract revisions",
        content: ["Policy assumptions remained hidden."],
      },
      {
        title: "Remaining uncertainty",
        content:
          "Privacy accountability is harder because the user never saw or repaired the autonomy boundary.",
      },
    ];
  }

  if (outcome === "governance_no_pause") {
    return [
      {
        title: "Result",
        content:
          "The meeting summary includes bystander context because the original contract and threshold allowed the assistant to continue.",
      },
      {
        title: "Data used",
        content: [
          "Used: user's spoken notes",
          "Used: user's action-item memory",
          "Included under original threshold: bystander voice segment",
        ],
      },
      {
        title: "Actions and rules",
        content: [
          "Allowed: summarize the user's own notes.",
          "Allowed: bystander content stayed below the configured ask-back threshold.",
          "Not repaired: no boundary change was made.",
        ],
      },
      {
        title: "Escalations",
        content: ["No ask-back was triggered under the configured threshold."],
      },
      {
        title: "Contract revisions",
        content: ["The original delegation contract remained active."],
      },
      {
        title: "Remaining uncertainty",
        content:
          "The audit records that bystander content was allowed by the current boundary settings.",
      },
    ];
  }

  return [
    {
      title: "Result",
      content: "The meeting summary stayed within the original contract.",
    },
    {
      title: "Data used",
      content: [
        "Used: user's spoken notes",
        "Used: user's action-item memory",
      ],
    },
    {
      title: "Actions and rules",
      content: [
        "Allowed: summarize the user's own notes.",
        "Allowed: action-item memory stayed within the original contract.",
      ],
    },
    {
      title: "Escalations",
      content: ["No ask-back was required under the configured threshold."],
    },
    {
      title: "Contract revisions",
      content: ["The original delegation contract remained active."],
    },
    {
      title: "Remaining uncertainty",
      content:
        "The run reflects the user's initial sensing, memory, and disclosure boundaries.",
    },
  ];
}

function completeRun(outcome) {
  clearTimer();
  state.completed = true;
  state.runStarted = false;
  state.escalationActive = false;
  state.pausedEvent = null;
  state.stage = "final_summary";
  state.summarySections = buildSummarySections(outcome);
  syncProgressStep();
  const finalConfidenceByOutcome = {
    governance_repair: 84,
    blackbox_hidden_conflict: 71,
    oversight_continued: 74,
  };
  const completionTitleByOutcome = {
    blackbox_hidden_conflict: "Black-box output produced",
    oversight_continued: "Oversight-informed output produced",
    default: "Governance-aware output produced",
  };

  state.currentConfidence = finalConfidenceByOutcome[outcome] || 78;

  stageLabel.textContent = "Final Summary";
  agentState.textContent = "Run complete";
  if (outcome === "governance_repair") {
    complianceStatus.textContent = "Contract satisfied after repair";
  } else if (outcome === "blackbox_hidden_conflict") {
    complianceStatus.textContent = "Outcome produced without repair";
  } else {
    complianceStatus.textContent = "Outcome ready for review";
  }
  updateRuntimeStatus();

  addTimelineItem(
    completionTitleByOutcome[outcome] || completionTitleByOutcome.default,
    outcome === "governance_repair"
      ? "Final answer explains how the contract changed the result."
      : "Final answer reflects the interaction condition used during execution."
  );
  addRuntimeLog(
    "Complete",
    `Run finished with outcome: ${outcome.replaceAll("_", " ")}.`
  );

  renderSummary();
  resetAskbackPanel();
  setButtonEnabled(startRunButton, false);
  setButtonEnabled(rerunStepButton, false);

  logEvent("audit_summary_generated", {
    outcome,
    finalConfidence: state.currentConfidence,
    escalationCount: state.escalationEvents,
    revisions: [...state.revisions],
    runtimeLogLength: state.runtimeLog.length,
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
    runtimeLog: [...state.runtimeLog],
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
    runtimeLogLength: state.runtimeLog.length,
  });
}

// Event wiring
draftContractButton.addEventListener("click", draftContract);
startRunButton.addEventListener("click", startAmbientRun);
backToTaskButton.addEventListener("click", goToTask);
backToTaskSecondaryButton.addEventListener("click", goToTask);
backToBoundariesButton.addEventListener("click", goToBoundaries);
backToRunButton.addEventListener("click", goToRunReview);
reviewEditBoundariesButton.addEventListener("click", goToBoundaries);
reviseContractButton.addEventListener("click", reviseContract);
rerunStepButton.addEventListener("click", rerunStep);
resetDemoButton.addEventListener("click", initialize);
startSessionButton.addEventListener("click", startStudySession);
exportLogButton.addEventListener("click", exportSessionLog);

approveOnceButton.addEventListener("click", () => {
  if (!state.pausedEvent) {
    return;
  }

  if (state.activeCondition === "oversight") {
    addRevision("Participant continued after inspecting the privacy marker.");
    addTimelineItem(
      "Oversight marker reviewed",
      "Participant continued the run after seeing bystander privacy risk."
    );
    addRuntimeLog(
      "Continue",
      "Oversight review complete. Bystander content remains in the final output path."
    );
    state.pausedEvent = null;
    state.escalationActive = false;
    scheduleCompletion("oversight_continued");
    logEvent("oversight_continue", {
      context: "Bystander voice segment",
    });
    return;
  }

  addRevision(
    "Approved once: this content may be used for the current summary, " +
      "but future bystander-related content will still require approval."
  );
  addTimelineItem(
    "One-time anonymized exception approved",
    "This path keeps the run moving but does not repair future bystander handling."
  );
  addRuntimeLog(
    "Exception",
    "Participant included an anonymized bystander mention once without revising the policy."
  );
  state.pausedEvent = null;
  state.escalationActive = false;
  scheduleCompletion("approved_exception");
  logEvent("content_approved_once", {
    rule: "bystander_approval_required",
    scope: "single_use",
    context: "Bystander voice segment",
  });
});

excludeContentButton.addEventListener("click", () => {
  if (!state.pausedEvent || state.activeCondition !== "governance") {
    return;
  }

  addRevision("Excluded: bystander-related content was removed from the summary and was not stored as memory.");
  addTimelineItem(
    "Bystander content excluded",
    "The run rejects the bystander segment but does not revise the broader policy."
  );
  addRuntimeLog(
    "Exclude",
    "Participant excluded bystander content for this run only."
  );
  state.pausedEvent = null;
  state.escalationActive = false;
  scheduleCompletion("denied_for_run");
  logEvent("content_excluded", {
    rule: "bystander_data_excluded",
    memoryStored: false,
    context: "Bystander voice segment",
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
  initialize();
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
    renderContractPreview();
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
