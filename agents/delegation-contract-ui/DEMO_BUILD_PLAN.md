# Agent Demo Build Plan

## Goal

Push the delegation-contract project from framing into a locally runnable
workshop prototype for privacy-sensitive pervasive AI.

## MVP Demo Definition

The first demo should prove one claim clearly:

- ordinary users can govern an ambient AI assistant through a `delegation contract` rather than prompts, static privacy dashboards, or raw execution traces

The demo does not need:

- live sensors or audio processing
- multi-agent orchestration
- production-grade backend
- fully dynamic model inference

The demo must include:

1. `Shared-space task setup`
2. `Delegation contract editing`
3. `Runtime governance`
4. `Ask-back / escalation`
5. `Repair and rerun`
6. `Governance audit summary`

## Default Scenario

Working scenario:

- a student uses an ambient AI assistant during a shared studio meeting
- the assistant may summarize the user's notes and remember task preferences
- the assistant detects another student's voice while preparing the summary
- the system escalates because bystander processing is outside the current contract
- the user repairs the contract and reruns the summary from a safe checkpoint

## Implementation Decision

The first local artifact should be a single-page clickable prototype:

- static HTML/CSS/JS
- no framework dependency
- state-driven flow with mocked ambient AI internals

## Immediate Build Tasks

1. Capture setup, ask-back, repair, and audit screenshots.
2. Add a pilot walkthrough protocol for 3-5 participants.
3. Add a manual QA checklist.
4. Prepare an anonymized short-paper artifact package.
