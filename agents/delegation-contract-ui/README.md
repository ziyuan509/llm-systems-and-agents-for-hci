# Delegation Contract UI

Main HCI project in this repository.

## Project Summary

This project explores a governance-oriented interface for deep research agents.

Instead of editing prompts or inspecting raw traces, users govern the agent
through a delegation contract that defines:

- source constraints
- budget or time limits
- escalation rules
- tool permissions
- confidence thresholds
- repair expectations

## Current Goal

Prepare a study-ready prototype that demonstrates:

- contract setup
- runtime ask-back
- post-hoc policy revision
- comparison conditions for black-box and trace-oriented oversight
- lightweight event logging for pilot sessions

The local demo is implemented as static HTML/CSS/JS in `demo/`.

## Core Artifacts

| Artifact | Role |
| --- | --- |
| `SPEC.md` | System model and MVP behavior. |
| `WIREFLOW.md` | Screen flow and interaction sequence. |
| `SCENARIO.md` | Representative user task and escalation moment. |
| `TASKS.md` | Working task list. |
| `DECISIONS.md` | Design decisions and tradeoffs. |
| `DEMO_BUILD_PLAN.md` | Scope for the first local prototype. |
| `demo/` | Runnable clickable prototype and study instrumentation. |

See these files to move from concept framing to prototype implementation.
