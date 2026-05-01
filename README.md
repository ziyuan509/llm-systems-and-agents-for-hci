# LLM Systems and Agents for HCI

Public learning-and-building repository for connecting LLM fundamentals,
agent systems, and HCI-oriented research prototypes.

## Current Main Project

`Project 01: Delegation Contract UI for Deep Research Agents`

This project investigates how ordinary users can govern delegation to
long-running research agents without editing raw prompts or reading low-level
execution traces.

## Research Focus

Core question:

- How can ordinary users set, revise, and repair delegation policies for agentic systems over time?

Current preferred framing:

- end-user agent governance
- delegation contracts as the main interaction object
- deep research as the first application domain

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
- Clickable demo prototype with study logging in `agents/delegation-contract-ui/demo/`

## Next Milestone

Move the prototype from runnable demo to study-ready artifact:

- tighten the comparison baseline definitions
- run pilot walkthroughs with exported session logs
- add screenshots or a short screen recording
- document limitations and expected interpretation of study data

See `ROADMAP.md` and `agents/delegation-contract-ui/SPEC.md`.

## Local Demo

The current local demo is in:

- `agents/delegation-contract-ui/demo/`

Open `agents/delegation-contract-ui/demo/index.html` in a browser to run the
prototype. No build step is required.
