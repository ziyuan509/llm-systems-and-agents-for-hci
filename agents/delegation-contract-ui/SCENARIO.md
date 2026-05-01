# Representative Scenario

## Scenario Name

Verifying conflicting claims in a time-bounded research task

## Why This Scenario

This scenario is a strong first prototype case because it naturally surfaces:

- source trust decisions
- escalation timing
- uncertainty communication
- policy revision after conflict

## User

A graduate student is preparing a short briefing on whether a new AI product feature has changed how online information work should be validated.

The user is not an agent developer and does not want to inspect chain-of-thought-like traces or edit prompts.

## Task

The user asks:

- "Prepare a short research brief comparing three recent sources about the feature, but avoid rumor-driven blogs, prioritize official sources and reputable reporting, and ask me before citing uncertain claims."

## Initial Contract

The system suggests:

- prioritize official product announcements
- allow major news and research blogs
- ban anonymous forum posts
- ask back when sources conflict
- stop before exceeding a 15-minute budget

The user revises the contract:

- removes research blogs
- keeps official sources and major reporting only
- lowers the confidence threshold for escalation

## Runtime Event

During execution, the agent finds:

- one official announcement
- one reputable news summary
- one secondary source that interprets the feature differently

The system detects that:

- the secondary source conflicts with the official announcement
- the source type is outside the preferred policy

## Ask-Back Moment

The interface tells the user:

- a conflicting source was found
- it is outside the preferred source policy
- the agent can either ignore it, include it with a warning, or ask the user to revise the contract

The user chooses:

- revise the contract to exclude this source type completely

## Repair

The system reruns the synthesis step with the revised policy.

It then produces:

- a shorter but more reliable brief
- a note that one disputed interpretation was excluded due to the user's source policy

## Why This Scenario Is Good for the MVP

- it can be demoed in a short session
- it makes policy editing visibly meaningful
- it distinguishes governance from generic progress tracking
- it creates a clear ask-back moment without needing a fully autonomous browser agent

## What This Scenario Lets You Evaluate

- whether users understand the policy objects
- whether ask-back timing feels appropriate
- whether users prefer policy revision over raw step-by-step control
- whether the final report feels more trustworthy because the contract shaped the process
