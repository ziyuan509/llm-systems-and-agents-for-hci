# Pilot Walkthrough Protocol

## Goal

Evaluate whether users can understand, revise, and repair delegation contracts
for privacy-sensitive ambient AI scenarios.

## Scenario

A student uses an ambient assistant during a shared studio meeting. The
assistant can summarize spoken notes, remember the user's own action items, and
draft follow-up messages, but it must avoid storing or disclosing bystander
comments without approval.

## Conditions

- Condition A: Black-box ambient assistant
- Condition B: Oversight baseline with step-level privacy markers
- Condition C: Delegation-contract interface

## Tasks

1. Configure the initial contract.
2. Start the ambient run.
3. Respond to a bystander/privacy ask-back moment.
4. Repair the contract after an inappropriate memory or disclosure attempt.
5. Explain the final audit summary.

## Interview Questions

- Which rule was easiest to understand?
- Which rule was confusing?
- When should the assistant ask back?
- Did this feel more controllable than prompt instructions or raw traces?
- What would you want to change before using this in real shared spaces?

## Observations to Record

- whether participants distinguish sensing, storing, and disclosing
- whether they understand one-time exceptions versus durable policy repair
- where they hesitate before choosing an ask-back response
- whether they can explain why the final output was allowed, blocked, or escalated
- short quotes about control, trust, and privacy risk

## Exported Session Log

The prototype exports a JSON file containing:

- `sessionId`
- `sessionStartedAt`
- `participantId`
- `condition`
- `researcherNotes`
- `finalStage`
- `finalContract`
- `finalRevisions`
- `runtimeLog`
- `eventLog`

Use exported logs as supporting evidence for early design insights, not as
statistical proof of effectiveness.
