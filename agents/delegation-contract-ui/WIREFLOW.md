# Wireflow

## Goal

Translate the delegation-contract concept into a small interaction flow for
governing privacy-sensitive ambient AI in shared physical spaces.

This document defines the minimum screen-to-screen logic for version 1.

## Primary User Story

A non-expert user wants an ambient AI assistant to summarize a shared studio
meeting, remember their own action items, and draft a follow-up. Other students
may be present, so the user needs to constrain sensing, memory, disclosure, and
ask-back behavior without writing prompts or inspecting developer traces.

## Interaction States

### State 1: Task Setup

Purpose:

- define the user's shared-space goal in plain language
- set the output type and urgency before any autonomous action starts

What the user provides:

- ambient assistant task
- output format
- urgency

System response:

- parses the task into sensing, memory, action, disclosure, and escalation needs
- suggests a default delegation contract based on shared-space privacy risk

Key UI elements:

- task input box
- output format selector
- `Draft contract` button

### State 2: Contract Setup

Purpose:

- let the user define a higher-level autonomy boundary before execution

Editable policy objects:

- sensing boundary
- memory boundary
- allowed actions
- disclosure approval
- escalation threshold
- confidence threshold for autonomous action

Interaction pattern:

- each policy is visible as a plain-language card or control
- a plain-language preview translates settings into a user-readable contract

Key UI elements:

- sensing and memory toggles
- disclosure approval toggle
- action selector
- privacy escalation threshold
- contract preview
- `Start Ambient Run` button

### State 3: Runtime Governance

Purpose:

- show progress at a level suitable for ordinary users
- avoid raw traces unless the user asks for detail

What is shown:

- current governance stage
- context handled
- confidence status
- review window usage
- contract compliance status

Design principle:

- summarize what the assistant is doing
- highlight only contract-relevant events

### State 4: Ask-Back / Escalation

Purpose:

- interrupt autonomy when the contract requires user confirmation

Example triggers:

- bystander voice is detected
- the assistant attempts external disclosure
- memory update contains private context
- confidence is too low for autonomous action

What the system should say:

- what boundary was triggered
- what privacy or safety risk is present
- how each user choice affects future autonomy

User actions:

- include anonymized content once
- edit contract
- exclude content
- continue with oversight only in baseline conditions

### State 5: Repair

Purpose:

- let the user revise the policy after a boundary conflict

Repair targets:

- bystander sensing
- memory retention
- external disclosure approval
- escalation threshold
- allowed actions

Key UI elements:

- triggered rule
- risk explanation
- decision impact
- revise and rerun button

### State 6: Audit Summary

Purpose:

- communicate not only the output, but how the contract shaped agent autonomy

What is shown:

- result
- data used
- data excluded
- escalations triggered
- contract revisions made
- remaining uncertainty

Why this matters:

- it reinforces accountability as part of the task outcome, not a hidden control layer

## End-to-End Happy Path

1. User enters an ambient assistant task for a shared studio meeting.
2. System drafts a delegation contract.
3. User adjusts sensing, memory, disclosure, and escalation rules.
4. Assistant starts the ambient run.
5. System pauses when it detects bystander voice content.
6. User repairs the contract and asks the assistant to continue.
7. Assistant finishes with an audit summary of data use and policy decisions.

## MVP UI Requirement

The first prototype only needs:

- one task setup screen
- one contract setup screen
- one runtime governance screen
- one ask-back panel
- one repair path
- one audit summary screen

## Open Questions

- Which policies should be first-class on screen versus hidden under advanced settings?
- Should sensing and memory controls use plain-language examples instead of category labels?
- How much runtime detail is enough before the interface starts to resemble a debugger?
