# LLM Systems and Agents for HCI

Public learning-and-building repository for connecting LLM fundamentals,
agent systems, and HCI-oriented research prototypes.

## Current Main Project

`Project 01: Delegation Contracts for Privacy-Sensitive Pervasive AI Agents`

This project investigates how ordinary users can govern AI agents that sense,
remember, act, and disclose information in shared physical spaces without
editing raw prompts or reading developer-facing execution traces.

## Research Focus

Core question:

- How can ordinary users define, revise, and repair delegation boundaries for privacy-sensitive pervasive AI agents?

Current preferred framing:

- end-user agent governance
- delegation contracts as the main interaction object
- privacy-sensitive ambient AI as the first application domain
- bystander privacy and disclosure boundaries in shared spaces

## Repository Structure

| Path | Purpose |
| --- | --- |
| `agents/` | Research-oriented agent prototypes. |
| `agents/delegation-contract-ui/` | Main HCI project for delegation contract design. |
| `foundations/` | Minimal LLM and systems foundations work. |
| `training/` | Training, loss, inference, and finetuning notes or code. |
| `experiments/` | Runnable studies, probes, and evaluation artifacts. |
| `notes/` | Literature notes and design thinking. |
| `tests/` | Checks for code and prototype logic. |

## Current Deliverables

- Project framing and scope
- MVP system specification
- Task plan
- Research questions
- Related-work map
- Evaluation plan
- Clickable ambient AI governance demo with study logging in `agents/delegation-contract-ui/demo/`

## Next Milestone

Move the prototype from runnable demo to study-ready artifact:

- tighten the comparison baseline definitions
- run pilot walkthroughs with exported session logs
- add screenshots or a short screen recording
- document limitations and expected interpretation of study data
- prepare an anonymized UbiComp/ISWC 2026 workshop short paper package

See `ROADMAP.md` and `agents/delegation-contract-ui/SPEC.md`.

## Local Demo

The current local demo is in:

- `agents/delegation-contract-ui/demo/`

Open `agents/delegation-contract-ui/demo/index.html` in a browser to run the
prototype. No build step is required.
