# Delegation Contract Demo

## Purpose

This is the first local clickable prototype for the `delegation-contract-ui` project.

It demonstrates:

- task setup
- delegation contract editing
- runtime governance
- ask-back / escalation
- repair and rerun
- governance-aware final summary

It is intentionally static: there is no backend, build step, or live research
agent dependency. The prototype uses scripted state transitions so the study
flow can be piloted before implementing heavier infrastructure.

## Run

Open `index.html` in a browser.

No build step is required.

## Study Instrumentation

The prototype includes:

- participant ID input
- condition label
- researcher note field
- session start control
- event log preview
- JSON export for each session

Recommended study flow:

1. Enter participant ID and condition.
2. Click `Start Study Session`.
3. Run the scenario.
4. Export the session log at the end.

## Current Conditions

- `Governance UI`: editable contract controls, ask-back, repair, and rerun.
- `Black-box baseline`: hides policy controls and proceeds without repair.
- `Oversight baseline`: exposes execution-level conflict markers without making
  policy repair the main interaction.
