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
    startButton: "Start Ambient Run",
    askbackTitle: "Ask-back panel",
    askbackDefault:
      "The agent will pause here when a contract-relevant event occurs.",
    conditionCopy:
      "Contract UI exposes controls, ask-back, and durable repair across sensing, memory, actions, disclosure, and escalation.",
    contractModeIdle: "Draft",
    contractModeActive: "Active",
    approveLabel: "Include Anonymized",
    reviseLabel: "Edit Contract",
    denyLabel: "Exclude Content",
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
      "This baseline does not interrupt the run for privacy repair. The system proceeds with its preset behavior.",
    conditionCopy:
      "Black-box baseline offers no visible controls, no ask-back, and no durable repair; participants only see progress and the final output.",
    contractModeIdle: "Preset hidden",
    contractModeActive: "Preset hidden",
    approveLabel: "Include Anonymized",
    reviseLabel: "Edit Contract",
    denyLabel: "Exclude Content",
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
      "This baseline reveals step-level privacy markers instead of high-level contract repair controls.",
    conditionCopy:
      "Oversight baseline surfaces privacy markers, but it does not let participants convert a decision into a reusable contract repair.",
    contractModeIdle: "Preset hidden",
    contractModeActive: "Oversight visible",
    approveLabel: "Continue Run",
    reviseLabel: "Edit Contract",
    denyLabel: "Exclude Content",
    rerunLabel: "Rerun from safe checkpoint",
  },
};

const scenario = {
  taskNote:
    "User delegates a shared studio meeting to an ambient assistant with bystander privacy constraints.",
  sources: [
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
  if (label === "Oversight baseline") {
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
      createTextElement("li", "No ambient context handled yet.")
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
    summarizeUserNotes: sourceOfficial.checked,
    rememberActionItemsOnly: sourceMajor.checked,
    requireBystanderAskBack: sourceBlogs.checked,
    requireDisclosureApproval: banForums.checked,
    reviewWindow: timeBudgetSelect.value,
    allowedActions: toolScopeSelect.value,
    confidenceThreshold: Number(confidenceThreshold.value),
    escalationThreshold: Number(escalationThreshold.value),
  };
}

function buildContractPreview() {
  const contract = currentContractSnapshot();
  const allowedBehaviors = [];

  if (contract.summarizeUserNotes) allowedBehaviors.push("summarize the user's notes");
  if (contract.rememberActionItemsOnly) allowedBehaviors.push("remember the user's action items only");

  const behaviorText = allowedBehaviors.length
    ? allowedBehaviors.join(", ")
    : "no sensing or memory actions until the user adds one";
  const bystanderPolicy = contract.requireBystanderAskBack
    ? "Bystander voices require ask-back before processing or storage."
    : "Bystander voices may be processed without a dedicated ask-back rule.";
  const disclosurePolicy = contract.requireDisclosureApproval
    ? "External sharing requires user approval."
    : "The assistant may share outputs when other rules allow it.";

  return (
    `The assistant may ${behaviorText} within a ${contract.reviewWindow} review window. ` +
    `${bystanderPolicy} ${disclosurePolicy} It may ${contract.allowedActions.toLowerCase()} and should ask back when bystander or disclosure risk reaches ${contract.escalationThreshold}%. ` +
    `It should only act autonomously when confidence is at least ${contract.confidenceThreshold}%.`
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
      ? "System proposes sensing, memory, disclosure, and escalation defaults."
      : "System loads a fixed privacy behavior so the participant sees the comparison condition."
  );

  addRuntimeLog(
    "Planner",
    config.contractEditable
      ? "Autonomy boundaries are available before sensing and disclosure actions start."
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
      label: "Shared-space task parsed into sensing, memory, and disclosure checks.",
    },
  ];

  if (contract.summarizeUserNotes) {
    steps.push({ type: "collect", source: scenario.sources[0] });
  } else {
    steps.push({
      type: "skip",
      source: scenario.sources[0],
      reason: "Summarizing the user's spoken notes is disabled in the current contract.",
    });
  }

  if (contract.rememberActionItemsOnly) {
    steps.push({ type: "collect", source: scenario.sources[1] });
  } else {
    steps.push({
      type: "skip",
      source: scenario.sources[1],
      reason: "Longer-term memory updates are disabled in the current contract.",
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
  const outsidePolicy =
    source.type === "bystander" && contract.requireBystanderAskBack;
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

  addRuntimeLog("Context check", `Handled ${source.name}. ${source.note}`);

  if (!evaluation.outsidePolicy) {
    addSource(
      makeSourceRecord(
        source,
        source.conflict ? "Sensitive / boundary risk" : "Allowed context",
        evaluation.conflict
          ? "Includes bystander information and lowers autonomy confidence."
          : source.note
      )
    );
  } else {
    addSource(
      makeSourceRecord(
        source,
        "Ask-back required",
        "Detected during the ambient run, and the contract requires user confirmation before processing or storage."
      )
    );
  }

  if (source.id === "memory") {
    addTimelineItem(
      "User context prepared",
      "The assistant can summarize the meeting and remember the user's own action items."
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
  logEvent("context_processed", {
    context: source.name,
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
    `Paused at privacy risk score ${evaluation.riskScore} for ${evaluation.source.name}.`
  );

  askbackPanel.className = "card callout warning";
  askbackTitle.textContent = "Governance checkpoint";
  askbackCopy.textContent = evaluation.outsidePolicy
    ? "The assistant detected another person's voice while preparing the meeting summary. Exclude it, include an anonymized mention, or revise the contract for future runs."
    : "The assistant found privacy-sensitive context. The contract allows you to include an anonymized mention, edit the policy, or exclude it for this run.";
  askbackRule.textContent = evaluation.outsidePolicy
    ? "Sensing boundary: bystander voices are not authorized for autonomous processing."
    : "Escalation boundary: privacy-sensitive context crossed the ask-back threshold.";
  askbackRisk.textContent = `${evaluation.source.name} has risk score ${evaluation.riskScore} because it may store or disclose another person's comment.`;
  askbackImpact.textContent =
    "Include anonymized keeps this run moving, edit contract changes future autonomy, and exclude content blocks it only for this run.";
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

  askbackPanel.className = "card callout neutral";
  askbackTitle.textContent = "Oversight checkpoint";
  askbackCopy.textContent =
    "The latest context includes another person's voice. This baseline can continue the run, but it does not offer contract repair as the main decision.";
  askbackRule.textContent = "No editable delegation boundary is available in this baseline.";
  askbackRisk.textContent = `${evaluation.source.name} may be stored or disclosed without a reusable privacy rule.`;
  askbackImpact.textContent =
    "Continuing keeps bystander content in the final output path without revising future autonomy.";
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
  state.blockedSourceIds.push("bystander");
  state.currentConfidence = clampConfidence(state.currentConfidence + 6);
  sourceBlogs.checked = true;
  banForums.checked = true;
  renderContractPreview();

  stageLabel.textContent = "Repair and Rerun";
  contractMode.textContent = "Revised";
  agentState.textContent = "Waiting for rerun";
  complianceStatus.textContent = "Revised policy ready for checkpoint rerun";

  addRevision("Future similar bystander comments will be excluded unless explicitly approved.");
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

  askbackPanel.className = "card callout safe";
  askbackTitle.textContent = "Repair recorded";
  askbackCopy.textContent =
    "Revision recorded. The system can rerun the summary without storing or disclosing bystander content, and similar personal details now require confirmation before memory updates.";
  askbackRule.textContent = "Sensing boundary updated: bystander voices remain excluded.";
  askbackRisk.textContent = "The bystander comment will not shape this meeting summary or future memory.";
  askbackImpact.textContent =
    "The agent can continue from the checkpoint under revised sensing, memory, and disclosure boundaries.";
  setButtonEnabled(approveOnceButton, false);
  setButtonEnabled(reviseContractButton, false);
  setButtonEnabled(denySourceButton, false);
  setButtonEnabled(rerunStepButton, true);
  updateRuntimeStatus();

  logEvent("contract_revised", {
    revision:
      "Excluded bystander voices, blocked private memory updates, and required approval before sharing.",
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
          "The final meeting summary uses the user's own notes and action-item memory without bystander content.",
      },
      {
        title: "Data used",
        content: [
          "Used: user's spoken notes",
          "Used: user's action-item memory",
          "Excluded: bystander voice segment after policy repair",
        ],
      },
      {
        title: "Actions and rules",
        content: [
          "Allowed: summarize the user's own notes.",
          "Escalated: bystander voice required ask-back before processing.",
          "Blocked: private bystander details were not stored or disclosed.",
        ],
      },
      {
        title: "Escalations",
        content: ["1 ask-back triggered by bystander privacy risk."],
      },
      {
        title: "Contract revisions",
        content: [
          "Bystander voices remained outside the sensing boundary.",
          "Memory update blocked for private meeting details.",
          "External sharing requires approval.",
          "Summary reran from the last safe checkpoint.",
        ],
      },
      {
        title: "Remaining uncertainty",
        content:
          "The assistant may need a future ask-back if the user wants to include bystander contributions with consent.",
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
          "Escalated: bystander voice required ask-back before processing.",
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
          "The exception helps this output but leaves future bystander processing unchanged.",
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
          "Escalated: bystander voice required ask-back before processing.",
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

  if (outcome === "trace_continued") {
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
  const finalConfidenceByOutcome = {
    governance_repair: 84,
    blackbox_hidden_conflict: 71,
    trace_continued: 74,
  };
  const completionTitleByOutcome = {
    blackbox_hidden_conflict: "Black-box output produced",
    trace_continued: "Oversight-informed output produced",
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
    scheduleCompletion("trace_continued");
    logEvent("oversight_continue", {
      context: "Bystander voice segment",
    });
    return;
  }

  addRevision("Included an anonymized bystander mention once without changing policy.");
  addTimelineItem(
    "One-time anonymized exception approved",
    "This path keeps the run moving but does not repair future bystander handling."
  );
  addRuntimeLog(
    "Exception",
    "Participant allowed an anonymized bystander mention once without revising the policy."
  );
  state.pausedEvent = null;
  state.escalationActive = false;
  scheduleCompletion("approved_exception");
  logEvent("include_anonymized_once", {
    context: "Bystander voice segment",
  });
});

denySourceButton.addEventListener("click", () => {
  if (!state.pausedEvent || state.activeCondition !== "governance") {
    return;
  }

  addRevision("Excluded bystander content for this run.");
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
  logEvent("exclude_content", {
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
