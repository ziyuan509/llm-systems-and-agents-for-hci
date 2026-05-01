# Wireflow

## Goal

Translate the delegation-contract concept into a small interaction flow that can be prototyped and demoed.

This document defines the minimum screen-to-screen logic for version 1.

## Primary User Story

A non-expert user wants a research agent to investigate a topic, but wants to constrain what sources the agent can use, when it should ask for confirmation, and how it should respond to conflicting evidence.

## Interaction States

### State 1: Task Setup

Purpose:

- define the user goal in plain language
- set the task scope before any autonomous action starts

What the user provides:

- research question
- desired output format
- time sensitivity or urgency

System response:

- parses the task into a draft plan
- suggests a default delegation contract based on task type

Key UI elements:

- task input box
- output format selector
- "Draft contract" button

Transition:

- user moves to Contract Setup

### State 2: Contract Setup

Purpose:

- let the user define a higher-level governance policy before execution

Editable policy objects:

- trusted source types
- banned source types
- time budget
- cost budget
- escalation threshold
- confidence threshold for autonomous synthesis
- allowed tools

Interaction pattern:

- each policy is visible as a plain-language card rather than a hidden system parameter
- advanced settings remain collapsed by default

Key UI elements:

- source policy cards
- budget sliders or selectors
- tool permission toggles
- escalation rule picker
- "Start research" button

Transition:

- user starts execution
- system moves to Runtime Execution

### State 3: Runtime Execution

Purpose:

- show progress at a level suitable for ordinary users
- avoid raw traces unless the user asks for detail

What is shown:

- current research step
- sources consulted
- confidence status
- budget usage
- contract compliance status

Design principle:

- summarize what the agent is doing
- highlight only contract-relevant events

Key UI elements:

- progress timeline
- source list with trust status
- contract badge panel
- "Pause" and "Inspect decision" actions

Possible transitions:

- continue autonomously
- trigger Ask-Back
- finish with draft result

### State 4: Ask-Back / Escalation

Purpose:

- interrupt autonomy when the contract requires user confirmation

Example triggers:

- source falls outside trusted policy
- evidence conflicts across sources
- budget is near limit
- confidence is too low for autonomous synthesis

What the system should say:

- what triggered the interruption
- what action the agent wants to take
- what contract rule is relevant

User actions:

- approve once
- revise contract
- deny and redirect
- continue with warning

Key UI elements:

- escalation card
- short rationale
- contract rule reference
- action buttons

Transition:

- return to Runtime Execution
- or move to Post-Hoc Repair if the user decides broader revision is needed

### State 5: Post-Hoc Repair

Purpose:

- let the user revise the policy after a bad step, poor source, or unsatisfactory result

Repair targets:

- source policy
- escalation threshold
- confidence threshold
- allowed tools
- task framing

Key UI elements:

- "What went wrong?" prompt
- contract diff view
- revise and rerun button

Transition:

- rerun from last safe checkpoint
- or end task with current result

### State 6: Final Summary

Purpose:

- communicate not only the result, but how the contract shaped the result

What is shown:

- final answer or report
- sources used
- escalations triggered
- policy revisions made
- unresolved uncertainty

Why this matters:

- it reinforces governance as part of the task outcome, not a hidden control layer

## End-to-End Happy Path

1. User enters a research question.
2. System drafts a delegation contract.
3. User adjusts source and escalation rules.
4. Agent starts collecting and summarizing sources.
5. System pauses when it encounters conflicting evidence from a questionable source.
6. User revises the source policy and asks the agent to continue.
7. Agent finishes with a report and a summary of policy decisions made during execution.

## MVP UI Requirement

The first prototype only needs:

- one task setup screen
- one contract setup screen
- one runtime progress screen
- one escalation modal or panel
- one repair screen
- one final summary screen

## Open Questions

- Which policies should be first-class on screen versus hidden under advanced settings?
- Should budget and confidence be numeric or plain-language choices?
- How much runtime detail is enough before the interface starts to resemble a debugger?
