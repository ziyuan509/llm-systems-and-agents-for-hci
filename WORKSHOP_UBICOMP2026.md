# UbiComp/ISWC 2026 Workshop Plan

Target workshop:

- `Privacy, Security, Safety and Ethics of AI in Pervasive Environments`
- Workshop site: `https://ai-privacy-ubicomp.github.io`

## Positioning

Working title:

`Delegation Contracts for End-User Governance of Privacy-Sensitive Pervasive AI Agents`

Core claim:

The point is not to make the agent more autonomous. The point is to make
autonomy governable.

## Research Question

How can ordinary users define, revise, and repair delegation boundaries for
privacy-sensitive pervasive AI agents?

## Design Concept

A delegation contract is a user-facing, revisable set of boundaries that
specifies what an AI agent may sense, remember, do, disclose, and when it must
ask back.

Contract dimensions:

- `Sensing`: what context the agent may process
- `Memory`: what can be stored across tasks
- `Tool/action`: what the agent may do autonomously
- `Disclosure`: who can receive outputs and under what approval rules
- `Escalation`: when uncertainty or risk requires ask-back

## Prototype Scenario

A student uses an ambient AI assistant during a shared studio meeting. The
assistant can summarize the user's notes, remember action-item preferences, and
draft a follow-up. When the assistant detects another student's voice, the
delegation contract determines whether to exclude the content, include an
anonymized mention, or ask the user to repair the policy.

## Required Prototype Screenshots

- Contract setup across sensing, memory, tool use, disclosure, and escalation
- Runtime ask-back when bystander information is detected
- Repair after a boundary conflict
- Audit summary linking output decisions to contract rules

## Pilot Walkthrough

Recommended minimum:

- 3-5 participants
- 20-30 minutes each
- tasks: setup, ask-back decision, repair, audit explanation
- evidence: task success, hesitation points, misunderstandings, short quotes

Early findings to look for:

- concrete scenarios may be easier than abstract privacy categories
- ask-back should be risk-calibrated rather than constant
- repair after an error may make delegation contracts easier to understand

## Short Paper Structure

- Introduction: pervasive AI privacy and limits of prompt/dashboard/trace control
- Related work / positioning
- Design concept: delegation contracts
- Prototype: setup, ask-back, repair, audit
- Pilot walkthrough and early findings
- Discussion and limitations

## Submission Checklist

- [ ] anonymize paper, screenshots, and demo links
- [ ] avoid direct GitHub identity links in submitted materials
- [ ] state that the prototype is simulated and early-stage
- [ ] avoid claims of statistical effectiveness from pilot data
- [ ] include limitations around sample size and lack of live sensors
