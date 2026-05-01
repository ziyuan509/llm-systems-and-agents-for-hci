# Agent Demo Build Plan

## Goal

Push the delegation-contract project from framing into a locally runnable advisor demo.

## MVP Demo Definition

The first demo should prove one claim clearly:

- ordinary users can govern a research agent through a `delegation contract` rather than prompts or raw traces

The demo does not need:

- live web browsing
- multi-agent orchestration
- production-grade backend
- fully dynamic model inference

The demo must include:

1. `Task setup`
2. `Delegation contract editing`
3. `Runtime progress`
4. `Ask-back / escalation`
5. `Repair and rerun`
6. `Governance-aware final summary`

## Default Scenario

Working scenario:

- a graduate student needs a short research brief
- the agent should prefer official sources and major reporting
- the agent encounters a conflicting secondary source
- the system escalates because the source is outside the preferred policy
- the user revises the contract and reruns the synthesis step

## Implementation Decision

The first local artifact should be a single-page clickable prototype:

- static HTML/CSS/JS
- no framework dependency
- state-driven flow with mocked agent internals

## Immediate Build Tasks

1. Build the clickable prototype shell.
2. Encode one representative runtime escalation event.
3. Encode one contract revision path and rerun outcome.
4. Add a governance-aware summary page.
5. Add lightweight study instrumentation.
