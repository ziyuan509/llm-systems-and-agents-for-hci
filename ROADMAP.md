# Roadmap

Main project: `Privacy-Sensitive Pervasive AI Agents`

## Phase 1: Scope the Research Project

- Lock the project to `Privacy-Sensitive Pervasive AI Agents`.
- Define the main HCI claim: ordinary users need interaction-level mechanisms to govern AI agents that sense, remember, act, and disclose information in shared physical spaces.
- Define the first application domain: shared-space ambient assistance.
- Treat delegation contracts as the core interaction mechanism, not the project title.
- Finalize the core governance dimensions:
  - sensing
  - memory
  - action
  - disclosure
  - escalation
  - repair
- Clarify non-goals:
  - not a general-purpose agent debugger
  - not a prompt engineering workbench
  - not a complete sensing system
  - not a generic privacy dashboard detached from agent action

Status: mostly complete.

## Phase 2: Specify the System

- Define delegation contracts as user-facing, revisable policy objects.
- Define how users configure sensing, memory, disclosure, action, and escalation boundaries.
- Define the UI states:
  - task setup
  - contract drafting
  - runtime governance
  - ask-back moment
  - contract revision
  - safe rerun
  - audit summary
- Define runtime escalation triggers:
  - bystander speech detected
  - external sharing requested
  - private memory update attempted
  - ambiguous consent
  - action outside the current contract
  - low confidence in an autonomous decision
- Define repair actions:
  - exclude content
  - approve once
  - revise contract
  - delete or avoid future memory
  - rerun from a safe checkpoint

Status: mostly complete for the first prototype.

## Phase 3: Build the MVP

- Implement a minimal ambient AI governance loop.
- Expose editable controls for:
  - spoken-note summarization
  - memory update permission
  - bystander data handling
  - external sharing approval
  - allowed action scope
  - privacy escalation threshold
- Support at least one runtime ask-back moment.
- Support at least one memory or disclosure repair flow.
- Support a governance audit summary that explains why the agent acted, paused, or blocked an action.

Status: first static demo implemented in `agents/delegation-contract-ui/demo/`.

## Phase 4: Prepare Research Evidence

- Refine related-work positioning around:
  - pervasive AI privacy
  - bystander privacy
  - end-user control of AI agents
  - agent accountability
  - calibrated reliance
- Define pilot walkthrough tasks.
- Run 3-5 pilot walkthroughs.
- Collect:
  - task success
  - hesitation points
  - misunderstood policy objects
  - repair decisions
  - participant quotes
  - researcher notes
  - exported event logs
- Prepare screenshots and a short demo script.

Status: in progress.

## Phase 5: Paper and Portfolio Package

- Clean repository narrative.
- Add prototype screenshots or diagrams.
- Document design rationale and limitations.
- Prepare an anonymized short paper package for workshop submission.
- Prepare an anonymized demo link or screenshot set.
- Write a 4-page short paper around:
  - problem framing
  - delegation contract model
  - prototype design
  - pilot walkthrough insights
  - discussion and limitations

Status: next focus.
