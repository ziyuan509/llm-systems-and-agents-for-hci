# MVP Spec

## Problem

AI agents are moving from screen-based chat into pervasive environments such as
shared studios, classrooms, homes, wearables, and ambient assistants. In these
settings, agents may sense bystanders, remember private context, draft messages,
and disclose information to others.

Ordinary users need more than a black-box assistant, a static privacy dashboard,
or a developer-style execution trace. They need an interface for governing what
the agent may sense, remember, do, disclose, and when it must ask back.

## Target User

- ordinary users of context-aware AI assistants
- students or knowledge workers in shared spaces
- non-expert users who need privacy and accountability controls

## Task Domain

- shared-space ambient AI assistance
- meeting summarization and follow-up drafting
- bystander privacy and disclosure governance
- policy repair after a boundary conflict

## Core Interaction Object

`Delegation contract`

A delegation contract is a user-facing, revisable set of boundaries that
specifies what an AI agent may sense, remember, do, disclose, and when it must
ask back.

## Editable Policy Objects

- sensing boundary: what context can be processed
- memory boundary: what can be remembered across tasks
- tool/action boundary: what actions can be performed autonomously
- disclosure boundary: who can receive outputs and when approval is required
- escalation boundary: when uncertainty or risk requires ask-back

## Minimum UI States

1. Task setup for a shared-space ambient assistant
2. Contract setup across sensing, memory, action, disclosure, and escalation
3. Runtime governance with ask-back
4. Repair and contract revision
5. Audit summary that links outcomes to contract rules

## Runtime Escalation Triggers

- bystander voice or information detected
- proposed external disclosure
- attempt to store private context
- low confidence before a high-impact action
- policy mismatch between user intent and agent behavior

## User Actions

- include anonymized content once
- exclude content for this run
- edit contract for future behavior
- rerun from a safe checkpoint
- continue with oversight only in baseline conditions

## Baseline Conditions

- black-box ambient assistant
- oversight baseline with step-level privacy markers
- delegation-contract interface

## MVP Boundary

The first version does not need:

- real sensors or live audio processing
- production agent orchestration
- long-term memory infrastructure
- real message sending

It only needs a believable single-session governance loop for privacy-sensitive
pervasive AI.
