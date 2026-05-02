// DOM references
const timeline = document.querySelector("#timeline");
const sourcesList = document.querySelector("#sources-list");
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

const stageLabel = document.querySelector("#stage-label");
const contractMode = document.querySelector("#contract-mode");
const agentState = document.querySelector("#agent-state");
const budgetStatus = document.querySelector("#budget-status");
const complianceStatus = document.querySelector("#compliance-status");
const runtimeConfidence = document.querySelector("#runtime-confidence");
const escalationCount = document.querySelector("#escalation-count");

const sourceOfficial = document.querySelector("#source-official");
const sourceMajor = document.querySelector("#source-major");
const sourceBlogs = document.querySelector("#source-blogs");
const banForums = document.querySelector("#ban-forums");
const timeBudgetSelect = document.querySelector("#time-budget");
const toolScopeSelect = document.querySelector("#tool-scope");
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

// Static configuration
const contractControls = [
  sourceOfficial,
  sourceMajor,
  sourceBlogs,
  banForums,
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
    draftButton: "Draft Contract",
    startButton: "Start Research",
    askbackTitle: "Ask-back panel",
    askbackDefault:
      "The agent will pause here when a contract-relevant event occurs.",
    conditionCopy:
      "Governance UI exposes editable policy controls, runtime ask-back, and explicit contract repair before rerun.",
    contractModeIdle: "Draft",
    contractModeActive: "Active",
    approveLabel: "Approve Once",
    reviseLabel: "Revise Contract",
    denyLabel: "Deny Source",
    rerunLabel: "Rerun from safe checkpoint",
  },
  blackbox: {
    badge: "Black box",
    runtimeTitle: "System internals hidden",
    contractEditable: false,
    stageLabel: "Black-box Run",
    draftButton: "Load Baseline Preset",
    startButton: "Start Baseline Run",
    askbackTitle: "Run interruption",
    askbackDefault:
      "This baseline does not interrupt the run for contract repair. The system proceeds with its preset policy.",
    conditionCopy:
      "Black-box baseline hides editable policy and user repair. Participants only see high-level progress and the final answer.",
    contractModeIdle: "Preset hidden",
    contractModeActive: "Preset hidden",
    approveLabel: "Approve Once",
    reviseLabel: "Revise Contract",
    denyLabel: "Deny Source",
    rerunLabel: "Rerun from safe checkpoint",
  },
  trace: {
    badge: "Oversight",
    runtimeTitle: "Oversight log",
    contractEditable: false,
    stageLabel: "Oversight Run",
    draftButton: "Load Oversight Condition",
    startButton: "Start Oversight Run",
    askbackTitle: "Oversight checkpoint",
    askbackDefault:
      "This baseline reveals low-level execution steps instead of high-level contract repair controls.",
    conditionCopy:
      "Oversight baseline shows step-level conflict markers, but it does not make policy repair the primary interaction.",
    contractModeIdle: "Preset hidden",
    contractModeActive: "Oversight visible",
    approveLabel: "Continue Run",
    reviseLabel: "Revise Contract",
    denyLabel: "Deny Source",
    rerunLabel: "Rerun from safe checkpoint",
  },
};

const scenario = {
  taskNote:
    "User requests a short research brief with source trust constraints.",
  sources: [
    {
      id: "official",
      type: "official",
      name: "Official product announcement",
      note: "Primary source aligned with the vendor's public statement.",
      budget: 2,
      confidenceDelta: 8,
      conflict: false,
    },
    {
      id: "major",
      type: "major",
      name: "Major reporting summary",
      note: "Secondary reporting that agrees on the core feature change.",
      budget: 4,
      confidenceDelta: 6,
      conflict: false,
    },
    {
      id: "blog",
      type: "blog",
      name: "Interpretive research blog",
      note: "Offers a conflicting interpretation of rollout scope.",
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
  sources: [],
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
  blockedSourceIds: [],
  sourceOutcome: "governance_repair",
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
  if (label === "Trace baseline" || label === "Oversight baseline") {
    return "trace";
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

function addSource(source) {
  state.sources.push(source);
  renderSources();
}

function addRevision(note) {
  state.revisions.push(note);
  renderRevisions();
}

function addRuntimeLog(label, detail) {
  state.runtimeLog.push({ label, detail });
  renderRuntimeLog();
}

// Render functions
function renderTimeline() {
  clearElement(timeline);
  state.timeline.forEach((item, index) => {
    const li = document.createElement("li");
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
    li.append(indexMarker, copy);
    timeline.appendChild(li);
  });
}

function renderSources() {
  clearElement(sourcesList);
  if (!state.sources.length) {
    sourcesList.appendChild(
      createTextElement("li", "No sources consulted yet.")
    );
    return;
  }

  state.sources.forEach((item) => {
    const li = document.createElement("li");
    li.append(
      createTextElement("strong", item.name),
      document.createTextNode(`${item.trust}: ${item.note}`)
    );
    sourcesList.appendChild(li);
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
    officialSources: sourceOfficial.checked,
    majorReporting: sourceMajor.checked,
    researchBlogs: sourceBlogs.checked,
    banForums: banForums.checked,
    timeBudget: timeBudgetSelect.value,
    toolScope: toolScopeSelect.value,
    confidenceThreshold: Number(confidenceThreshold.value),
    escalationThreshold: Number(escalationThreshold.value),
  };
}

function buildContractPreview() {
  const contract = currentContractSnapshot();
  const allowedSources = [];

  if (contract.officialSources) allowedSources.push("official announcements");
  if (contract.majorReporting) allowedSources.push("major reporting");
  if (contract.researchBlogs) allowedSources.push("research blogs");

  const sourceText = allowedSources.length
    ? allowedSources.join(", ")
    : "no source categories until the user adds one";
  const forumPolicy = contract.banForums
    ? "Anonymous forums are outside the autonomy boundary."
    : "Anonymous forums may be considered if other rules allow them.";

  return (
    `The agent may use ${sourceText} within a ${contract.timeBudget} budget. ` +
    `${forumPolicy} It may use ${contract.toolScope.toLowerCase()} and should ask back when conflict or policy mismatch reaches ${contract.escalationThreshold}%. ` +
    `It should only synthesize autonomously when confidence is at least ${contract.confidenceThreshold}%.`
  );
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
  startResearchButton.textContent = config.startButton;
  approveOnceButton.textContent = config.approveLabel;
  reviseContractButton.textContent = config.reviseLabel;
  denySourceButton.textContent = config.denyLabel;
  rerunStepButton.textContent = config.rerunLabel;
  contractMode.textContent = config.contractModeIdle;
  setContractControlsLocked(!config.contractEditable);
}

function resetAskbackPanel() {
  const config = getConditionConfig();
  askbackPanel.className = "card callout neutral";
  askbackTitle.textContent = config.askbackTitle;
  askbackCopy.textContent = config.askbackDefault;
  askbackRule.textContent = "No boundary triggered yet";
  askbackRisk.textContent = "No active risk";
  askbackImpact.textContent = "No decision needed";
  setButtonEnabled(approveOnceButton, false);
  setButtonEnabled(reviseContractButton, false);
  setButtonEnabled(denySourceButton, false);
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
  state.sources = [];
  state.revisions = [];
  state.runtimeLog = [];
  state.runtimeBudgetUsed = 0;
  state.currentConfidence = 68;
  state.summarySections = [];
  state.queuedSteps = [];
  state.pausedEvent = null;
  state.blockedSourceIds = [];
  state.sourceOutcome = "governance_repair";
}

function setDefaultControls() {
  sourceOfficial.checked = true;
  sourceMajor.checked = true;
  sourceBlogs.checked = true;
  banForums.checked = true;
  timeBudgetSelect.value = "15 minutes";
  toolScopeSelect.value = "Search + synthesis";
  confidenceThreshold.value = 70;
  escalationThreshold.value = 55;
  syncSliders();
  renderContractPreview();
}

function initialize() {
  resetRunState();
  setDefaultControls();
  applyConditionUI();

  stageLabel.textContent = "Task Setup";
  agentState.textContent = "Waiting for task";
  budgetStatus.textContent = "0 / 15 min";
  complianceStatus.textContent = "No active run";
  runtimeConfidence.textContent = "N/A";
  escalationCount.textContent = "0";
  sessionIdInput.value = state.sessionId || "";
  sessionStatus.textContent = state.sessionActive
    ? `Session active: ${state.sessionId}`
    : "Start a session before running the scenario so events can be logged.";

  addTimelineItem("Task received", scenario.taskNote);
  renderSources();
  renderRevisions();
  renderRuntimeLog();
  renderSummary();
  renderEventLogPreview();
  resetAskbackPanel();
  setButtonEnabled(startResearchButton, false);
  setButtonEnabled(rerunStepButton, false);
  setButtonEnabled(exportLogButton, state.sessionActive);
}

function draftContract() {
  const config = getConditionConfig();
  state.contractDrafted = true;
  state.stage = "contract_setup";

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
      ? "System proposes trusted sources, budgets, and escalation defaults."
      : "System loads a fixed policy so the participant sees the comparison condition."
  );

  addRuntimeLog(
    "Planner",
    config.contractEditable
      ? "Policy controls are available before execution starts."
      : "This condition fixes the policy before execution."
  );

  setButtonEnabled(startResearchButton, true);
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
      label: "Task parsed into a bounded research loop.",
    },
  ];

  if (contract.officialSources) {
    steps.push({ type: "collect", source: scenario.sources[0] });
  } else {
    steps.push({
      type: "skip",
      source: scenario.sources[0],
      reason: "Official announcements were disabled in the current configuration.",
    });
  }

  if (contract.majorReporting) {
    steps.push({ type: "collect", source: scenario.sources[1] });
  } else {
    steps.push({
      type: "skip",
      source: scenario.sources[1],
      reason: "Major reporting was disabled in the current configuration.",
    });
  }

  steps.push({ type: "collect", source: scenario.sources[2] });
  steps.push({ type: "synthesize" });
  return steps;
}

function startResearch() {
  if (!state.contractDrafted || state.runStarted) {
    return;
  }

  const config = getConditionConfig();
  state.runStarted = true;
  state.stage = "runtime";
  state.queuedSteps = buildRunQueue();
  state.currentConfidence = 68;

  stageLabel.textContent = config.stageLabel;
  contractMode.textContent = config.contractModeActive;
  agentState.textContent = "Planning bounded research loop";
  budgetStatus.textContent = `0 / ${getTimeBudgetLimit()} min`;
  complianceStatus.textContent = config.contractEditable
    ? "Within contract"
    : "Preset condition active";
  runtimeConfidence.textContent = `${state.currentConfidence}%`;

  addTimelineItem(
    "Execution started",
    config.contractEditable
      ? "Agent begins a bounded research loop under the active contract."
      : "Agent begins the same research task under a comparison condition."
  );
  addRuntimeLog(
    "Loop start",
    `${state.queuedSteps.length - 1} execution steps queued for this scenario.`
  );

  logEvent("research_started", {
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
    completeRun(state.sourceOutcome);
    return;
  }

  if (step.type === "plan") {
    addRuntimeLog("Planner", step.label);
    scheduleNextStep();
    return;
  }

  if (step.type === "skip") {
    addRuntimeLog("Skip", `${step.source.name} skipped. ${step.reason}`);
    scheduleNextStep();
    return;
  }

  if (step.type === "collect") {
    handleSourceStep(step.source);
    return;
  }

  if (step.type === "synthesize") {
    handleSynthesisStep();
  }
}

function makeSourceRecord(source, trust, note) {
  return {
    name: source.name,
    trust,
    note,
  };
}

function updateRuntimeStatus() {
  budgetStatus.textContent = `${state.runtimeBudgetUsed} / ${getTimeBudgetLimit()} min`;
  runtimeConfidence.textContent = `${state.currentConfidence}%`;
}

function evaluateSource(source) {
  const contract = currentContractSnapshot();
  const outsidePolicy = source.type === "blog" && !contract.researchBlogs;
  const conflict = source.conflict;
  let riskScore = 28;

  if (outsidePolicy) {
    riskScore = 84;
  } else if (conflict) {
    riskScore = 64;
  }

  return {
    source,
    outsidePolicy,
    conflict,
    riskScore,
    shouldEscalate:
      state.activeCondition === "governance" &&
      riskScore >= contract.escalationThreshold,
    shouldPauseTrace: state.activeCondition === "trace" && conflict,
  };
}

function handleSourceStep(source) {
  const evaluation = evaluateSource(source);
  state.runtimeBudgetUsed += source.budget;
  state.currentConfidence = clampConfidence(
    state.currentConfidence + source.confidenceDelta
  );

  addRuntimeLog("Search", `Checked ${source.name}. ${source.note}`);

  if (!evaluation.outsidePolicy) {
    addSource(
      makeSourceRecord(
        source,
        source.conflict ? "Conflicting / low-trust" : "Trusted",
        evaluation.conflict
          ? "Conflicts with earlier evidence and lowers synthesis confidence."
          : source.note
      )
    );
  } else {
    addSource(
      makeSourceRecord(
        source,
        "Blocked by current policy",
        "Found during search, but outside the revised source policy."
      )
    );
  }

  if (source.id === "major") {
    addTimelineItem(
      "Trusted sources collected",
      "Official announcement and major reporting agree on the core feature change."
    );
  }

  if (evaluation.shouldEscalate) {
    triggerGovernanceAskback(evaluation);
    return;
  }

  if (evaluation.shouldPauseTrace) {
    triggerTracePause(evaluation);
    return;
  }

  if (evaluation.conflict && state.activeCondition === "blackbox") {
    state.sourceOutcome = "blackbox_hidden_conflict";
    complianceStatus.textContent = "Hidden conflict absorbed into baseline run";
    addTimelineItem(
      "Conflicting source absorbed",
      "The baseline keeps running without exposing a policy repair path."
    );
    addRuntimeLog(
      "Policy hidden",
      "Low-trust conflicting evidence remains in the run without user intervention."
    );
  } else if (evaluation.conflict) {
    complianceStatus.textContent = evaluation.outsidePolicy
      ? "Source blocked by current policy"
      : "Conflict noted below escalation threshold";
    state.sourceOutcome = evaluation.outsidePolicy
      ? "denied_for_run"
      : "governance_no_pause";
  } else {
    complianceStatus.textContent =
      state.activeCondition === "governance"
        ? "Within contract"
        : "Preset condition active";
  }

  updateRuntimeStatus();
  logEvent("source_processed", {
    source: source.name,
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
  state.sourceOutcome = "governance_repair";

  stageLabel.textContent = "Ask-Back";
  agentState.textContent = "Paused for policy decision";
  complianceStatus.textContent = evaluation.outsidePolicy
    ? "Candidate source violates current policy"
    : "Conflicting evidence exceeds escalation threshold";
  escalationCount.textContent = String(state.escalationEvents);
  updateRuntimeStatus();

  addTimelineItem(
    "Escalation triggered",
    evaluation.outsidePolicy
      ? "A candidate source falls outside the active source policy."
      : "A conflicting source crosses the escalation threshold and requires contract guidance."
  );
  addRuntimeLog(
    "Escalation",
    `Paused at risk score ${evaluation.riskScore} for ${evaluation.source.name}.`
  );

  askbackPanel.className = "card callout warning";
  askbackTitle.textContent = "Governance checkpoint";
  askbackCopy.textContent = evaluation.outsidePolicy
    ? "The agent found a conflicting source that is outside the current contract. Approve it once, revise the contract, or deny it for this run."
    : "The agent found a low-trust conflicting source. The contract allows you to approve the exception, revise the policy, or deny the source for this run.";
  askbackRule.textContent = evaluation.outsidePolicy
    ? "Source boundary: research blogs are no longer authorized for autonomous use."
    : "Escalation boundary: conflicting evidence crossed the ask-back threshold.";
  askbackRisk.textContent = `${evaluation.source.name} has risk score ${evaluation.riskScore} and conflicts with trusted evidence.`;
  askbackImpact.textContent =
    "Approve once keeps this run moving, revise changes future autonomy, and deny excludes the source only for this run.";
  setButtonEnabled(approveOnceButton, true);
  setButtonEnabled(reviseContractButton, true);
  setButtonEnabled(denySourceButton, true);

  logEvent("askback_triggered", {
    source: evaluation.source.name,
    riskScore: evaluation.riskScore,
    outsidePolicy: evaluation.outsidePolicy,
  });
}

function triggerTracePause(evaluation) {
  state.pausedEvent = evaluation;
  state.escalationActive = true;
  state.escalationEvents += 1;
  state.stage = "trace_pause";
  state.sourceOutcome = "trace_continued";

  stageLabel.textContent = "Oversight Checkpoint";
  agentState.textContent = "Paused for oversight review";
  complianceStatus.textContent = "Low-level conflict marker surfaced";
  escalationCount.textContent = String(state.escalationEvents);
  updateRuntimeStatus();

  addTimelineItem(
    "Oversight checkpoint reached",
    "The baseline pauses at a conflict marker rather than a contract repair prompt."
  );
  addRuntimeLog(
    "Conflict marker",
    "A disagreement was detected between official announcement and blog interpretation."
  );

  askbackPanel.className = "card callout neutral";
  askbackTitle.textContent = "Oversight checkpoint";
  askbackCopy.textContent =
    "The latest source disagrees with prior evidence. This baseline can continue the run, but it does not offer contract repair as the main decision.";
  askbackRule.textContent = "No editable delegation boundary is available in this baseline.";
  askbackRisk.textContent = `${evaluation.source.name} conflicts with earlier trusted evidence.`;
  askbackImpact.textContent =
    "Continuing keeps the conflicting source in the final synthesis without revising future autonomy.";
  setButtonEnabled(approveOnceButton, true);
  setButtonEnabled(reviseContractButton, false);
  setButtonEnabled(denySourceButton, false);

  logEvent("trace_pause", {
    source: evaluation.source.name,
    riskScore: evaluation.riskScore,
  });
}

function reviseContract() {
  if (!state.pausedEvent || state.activeCondition !== "governance") {
    return;
  }

  state.revised = true;
  state.stage = "repair";
  state.escalationActive = false;
  state.pausedEvent = null;
  state.blockedSourceIds.push("blog");
  state.currentConfidence = clampConfidence(state.currentConfidence + 6);
  sourceBlogs.checked = false;

  stageLabel.textContent = "Repair and Rerun";
  contractMode.textContent = "Revised";
  agentState.textContent = "Waiting for rerun";
  complianceStatus.textContent = "Revised policy ready for checkpoint rerun";

  addRevision("Removed research blogs from allowed sources after escalation.");
  addTimelineItem(
    "Contract revised",
    "User tightens source policy instead of approving the exception."
  );
  addRuntimeLog(
    "Repair",
    "Participant removed research blogs and prepared a rerun from the last safe checkpoint."
  );

  askbackPanel.className = "card callout safe";
  askbackTitle.textContent = "Repair recorded";
  askbackCopy.textContent =
    "Revision recorded. The system can rerun the synthesis step without the excluded source type.";
  askbackRule.textContent = "Source boundary updated: research blogs are excluded.";
  askbackRisk.textContent = "The disputed blog interpretation will not shape this synthesis.";
  askbackImpact.textContent =
    "The agent can continue from the checkpoint under the revised autonomy boundary.";
  setButtonEnabled(approveOnceButton, false);
  setButtonEnabled(reviseContractButton, false);
  setButtonEnabled(denySourceButton, false);
  setButtonEnabled(rerunStepButton, true);
  updateRuntimeStatus();

  logEvent("contract_revised", {
    revision: "Removed research blogs from allowed sources.",
    contract: currentContractSnapshot(),
  });
}

function rerunStep() {
  if (!state.revised || state.activeCondition !== "governance") {
    return;
  }

  state.stage = "rerun";
  state.sourceOutcome = "governance_repair";
  state.runtimeBudgetUsed += 2;
  state.currentConfidence = clampConfidence(state.currentConfidence + 8);

  stageLabel.textContent = "Rerun";
  agentState.textContent = "Rerunning synthesis";
  complianceStatus.textContent = "Contract satisfied after repair";

  addTimelineItem(
    "Synthesis rerun",
    "The agent reruns the synthesis step without the excluded source type."
  );
  addRuntimeLog(
    "Rerun",
    "Restarted from the last safe checkpoint with blogs excluded from synthesis."
  );

  setButtonEnabled(rerunStepButton, false);
  updateRuntimeStatus();
  logEvent("rerun_started", {
    blockedSources: [...state.blockedSourceIds],
  });

  scheduleCompletion("governance_repair");
}

function scheduleCompletion(outcome) {
  clearTimer();
  state.timerId = window.setTimeout(() => completeRun(outcome), 320);
}

function handleSynthesisStep() {
  state.stage = "synthesis";
  agentState.textContent = "Synthesizing research brief";
  complianceStatus.textContent =
    state.activeCondition === "blackbox"
      ? "Baseline preset completed"
      : "Preparing final synthesis";

  addRuntimeLog(
    "Synthesize",
    "Combining collected evidence into the final research brief."
  );
  updateRuntimeStatus();

  if (state.activeCondition === "blackbox") {
    state.sourceOutcome = "blackbox_hidden_conflict";
  } else if (state.activeCondition === "trace") {
    state.sourceOutcome = "trace_continued";
  } else if (state.sourceOutcome === "governance_repair") {
    state.sourceOutcome = state.pausedEvent ? "governance_repair" : "governance_no_pause";
  }

  scheduleCompletion(state.sourceOutcome);
}

function buildSummarySections(outcome) {
  if (outcome === "governance_repair") {
    return [
      {
        title: "Result",
        content:
          "The final answer relies on the official announcement and major reporting.",
      },
      {
        title: "Sources",
        content: [
          "Used: official product announcement",
          "Used: major reporting summary",
          "Excluded: conflicting research blog after policy revision",
        ],
      },
      {
        title: "Escalations",
        content: ["1 ask-back triggered by conflicting evidence."],
      },
      {
        title: "Contract revisions",
        content: [
          "Research blogs were removed from allowed sources.",
          "Synthesis reran from the last safe checkpoint.",
        ],
      },
      {
        title: "Remaining uncertainty",
        content:
          "The excluded interpretation may be worth later review, but it is outside this run's revised autonomy boundary.",
      },
    ];
  }

  if (outcome === "approved_exception") {
    return [
      {
        title: "Result",
        content:
          "The final answer cites official and major sources plus a one-time exception for the conflicting blog.",
      },
      {
        title: "Sources",
        content: [
          "Used: official product announcement",
          "Used: major reporting summary",
          "Exception: conflicting research blog",
        ],
      },
      {
        title: "Escalations",
        content: ["1 ask-back triggered by conflicting evidence."],
      },
      {
        title: "Contract revisions",
        content: ["No durable policy change was recorded."],
      },
      {
        title: "Remaining uncertainty",
        content:
          "The exception broadens coverage but leaves future autonomy unchanged.",
      },
    ];
  }

  if (outcome === "denied_for_run") {
    return [
      {
        title: "Result",
        content:
          "The final answer excludes the conflicting blog for this run only.",
      },
      {
        title: "Sources",
        content: [
          "Used: official product announcement",
          "Used: major reporting summary",
          "Denied for this run: conflicting research blog",
        ],
      },
      {
        title: "Escalations",
        content: ["1 ask-back triggered by conflicting evidence."],
      },
      {
        title: "Contract revisions",
        content: ["No reusable policy repair was saved."],
      },
      {
        title: "Remaining uncertainty",
        content:
          "Future runs could hit the same boundary because the contract itself did not change.",
      },
    ];
  }

  if (outcome === "trace_continued") {
    return [
      {
        title: "Result",
        content:
          "The final answer includes the conflicting interpretation after the participant continued from an oversight checkpoint.",
      },
      {
        title: "Sources",
        content: [
          "Used: official product announcement",
          "Used: major reporting summary",
          "Included: conflicting research blog",
        ],
      },
      {
        title: "Escalations",
        content: ["1 oversight checkpoint surfaced a source conflict."],
      },
      {
        title: "Contract revisions",
        content: ["No policy boundary was editable in this condition."],
      },
      {
        title: "Remaining uncertainty",
        content:
          "The interface shows the conflict, but it does not turn the decision into a reusable delegation policy.",
      },
    ];
  }

  if (outcome === "blackbox_hidden_conflict") {
    return [
      {
        title: "Result",
        content:
          "The final answer blends official reporting with a conflicting secondary interpretation.",
      },
      {
        title: "Sources",
        content: [
          "Used: official product announcement",
          "Used: major reporting summary",
          "Included without repair: conflicting research blog",
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
          "Trust decisions are harder to attribute because the user never saw or repaired the autonomy boundary.",
      },
    ];
  }

  return [
    {
      title: "Result",
      content: "The final answer stayed within the original policy.",
    },
    {
      title: "Sources",
      content: [
        "Used: official product announcement",
        "Used: major reporting summary",
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
        "The run reflects the user's initial boundary settings and threshold tolerance.",
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
  const finalConfidenceByOutcome = {
    governance_repair: 84,
    blackbox_hidden_conflict: 71,
    trace_continued: 74,
  };
  const completionTitleByOutcome = {
    blackbox_hidden_conflict: "Black-box output produced",
    trace_continued: "Trace-informed output produced",
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
  setButtonEnabled(startResearchButton, false);
  setButtonEnabled(rerunStepButton, false);

  logEvent("run_completed", {
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
startResearchButton.addEventListener("click", startResearch);
reviseContractButton.addEventListener("click", reviseContract);
rerunStepButton.addEventListener("click", rerunStep);
resetDemoButton.addEventListener("click", initialize);
startSessionButton.addEventListener("click", startStudySession);
exportLogButton.addEventListener("click", exportSessionLog);

approveOnceButton.addEventListener("click", () => {
  if (!state.pausedEvent) {
    return;
  }

  if (state.activeCondition === "trace") {
    addRevision("Participant continued after inspecting low-level trace output.");
    addTimelineItem(
      "Trace reviewed",
      "Participant continued the run after seeing step-level execution evidence."
    );
    addRuntimeLog(
      "Continue",
      "Trace review complete. Conflicting source remains in the final synthesis."
    );
    state.pausedEvent = null;
    state.escalationActive = false;
    scheduleCompletion("trace_continued");
    logEvent("trace_continue", {
      source: "Interpretive research blog",
    });
    return;
  }

  addRevision("Approved the conflicting source once without changing policy.");
  addTimelineItem(
    "One-time exception approved",
    "This path keeps the run moving but weakens the governance argument."
  );
  addRuntimeLog(
    "Exception",
    "Participant allowed the low-trust source once without revising the policy."
  );
  state.pausedEvent = null;
  state.escalationActive = false;
  scheduleCompletion("approved_exception");
  logEvent("approve_once", {
    source: "Interpretive research blog",
  });
});

denySourceButton.addEventListener("click", () => {
  if (!state.pausedEvent || state.activeCondition !== "governance") {
    return;
  }

  addRevision("Denied the out-of-policy source for this run.");
  addTimelineItem(
    "Source denied",
    "The run rejects the conflicting source but does not revise the broader policy."
  );
  addRuntimeLog(
    "Deny",
    "Participant excluded the conflicting source for this run only."
  );
  state.pausedEvent = null;
  state.escalationActive = false;
  scheduleCompletion("denied_for_run");
  logEvent("deny_source", {
    source: "Interpretive research blog",
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
