# MVP Spec

## Problem

Ordinary users increasingly rely on long-running agents for online research, but current interfaces often force them into one of two poor choices:

- trust a black-box agent
- inspect low-level traces designed for developers

The system should offer a higher-level governance interface instead.

## Target User

- ordinary knowledge workers
- graduate students
- non-expert users of research agents

## Task Domain

- deep research
- online information gathering
- source comparison and synthesis

## Core Interaction Object

`Delegation contract`

The contract is a user-editable policy layer that shapes how the agent may act.

## Editable Policy Objects

- preferred source types
- banned source types
- time budget
- cost budget
- confidence threshold for autonomous synthesis
- escalation rules
- allowed tools

## Minimum UI States

1. Task setup
2. Contract setup
3. Runtime execution with ask-back
4. Post-hoc repair and contract revision

## Runtime Escalation Triggers

- conflicting evidence across sources
- low confidence in synthesis
- source outside trusted policy
- budget overrun risk
- ambiguous high-impact claim

## User Actions

- approve
- revise contract
- deny action
- restart step
- continue with warning

## Baseline Conditions

- black-box chat research agent
- trace-oriented oversight interface

## MVP Boundary

The first version does not need:

- full autonomous browsing stack
- multi-agent orchestration
- long-term memory management
- personalized learning across weeks

It only needs a believable single-session governance loop.
