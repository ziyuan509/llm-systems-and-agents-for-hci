# Pilot Walkthrough Protocol

## Goal

Evaluate whether users can understand, revise, and repair delegation contracts for privacy-sensitive ambient AI scenarios.

The walkthrough focuses on whether ordinary users can manage agent boundaries around:

- sensing
- memory
- bystander data
- external disclosure
- autonomous action
- escalation
- repair

## Scenario

A student uses an ambient AI assistant during a shared studio meeting.

The assistant can:

- summarize the user's spoken notes
- remember the user's own action items
- draft a follow-up message
- help organize meeting outcomes

However, the meeting takes place in a shared space. Other people may speak nearby, and some comments may contain bystander information. The assistant should not store or disclose bystander comments unless the user explicitly approves.

## Participants

Target pilot size:

- 3-5 participants

Participant background:

- students or early-career researchers
- no technical expertise required
- ideally familiar with AI assistants, but not necessarily with agent systems

## Conditions

The prototype supports three comparison conditions:

1. Governance UI  
   Users can configure policy controls, respond to ask-back moments, revise the contract, and inspect the audit summary.

2. Black-box baseline  
   Users interact with a simplified agent flow with limited control over privacy boundaries.

3. Oversight baseline  
   Users inspect agent behavior through more trace-like information, but without a structured delegation contract.

For the first pilot, it is acceptable to focus mainly on the Governance UI condition and use the other two as discussion references.

## Procedure

### Step 1: Introduction

Briefly introduce the scenario:

- The participant is using an ambient assistant in a shared studio meeting.
- The assistant can help summarize and draft follow-up messages.
- The participant must decide what the assistant can sense, remember, disclose, and do autonomously.

Estimated time: 2 minutes.

### Step 2: Initial Contract Setup

Ask the participant to configure the initial delegation contract.

Tasks:

- decide whether the assistant can summarize spoken notes
- decide whether the assistant can remember task preferences
- decide how bystander comments should be handled
- decide whether external sharing requires approval
- choose allowed action scope
- set privacy escalation sensitivity

Observe:

- which controls are understood immediately
- which controls require explanation
- whether the participant can predict what the agent will do

Estimated time: 5 minutes.

### Step 3: Runtime Ask-back

Start the ambient run.

The assistant should encounter a privacy-sensitive moment, such as:

- bystander speech is detected
- a comment may not belong to the user
- the assistant is preparing content that may be shared externally

Ask the participant to choose one of the available responses:

- approve once
- revise contract
- exclude content

Observe:

- whether the participant understands why the agent paused
- whether the participant sees ask-back as useful or annoying
- whether the participant wants this decision to become a future rule

Estimated time: 5 minutes.

### Step 4: Contract Repair

Create a situation where the participant needs to repair the contract.

Example repair prompt:

The assistant attempted to remember or disclose information that may involve a bystander.

Ask the participant to revise the contract so similar situations are handled better in the future.

Observe:

- whether the participant understands the difference between fixing one output and changing a future rule
- whether the participant can express the desired boundary
- whether the repair action feels clear

Estimated time: 5 minutes.

### Step 5: Safe Rerun

Ask the participant to rerun from a safe checkpoint.

Observe:

- whether the participant understands what changed after the repair
- whether the agent's new behavior matches the participant's expectation
- whether the participant trusts the revised contract more than the original one

Estimated time: 3 minutes.

### Step 6: Audit Summary

Ask the participant to inspect the governance audit summary.

Prompt questions:

- Why did the assistant pause?
- Which contract rule was triggered?
- What content was excluded or approved?
- What changed after the contract revision?

Observe:

- whether the audit summary supports accountability
- whether the participant can explain the agent's behavior in their own words
- whether the audit summary is too technical or too vague

Estimated time: 5 minutes.

## Interview Questions

Ask these after the walkthrough:

1. Which control was easiest to understand?
2. Which control was most confusing?
3. Did the contract make the assistant feel more controllable?
4. When should the assistant ask back instead of acting automatically?
5. Did the repair flow feel like fixing one mistake or changing a future rule?
6. Would you prefer this type of control over writing a prompt?
7. Would you prefer this type of control over inspecting raw agent traces?
8. What privacy risk did you notice most clearly?
9. What would you want to change about the interface?

## Data to Collect

For each session, collect:

- participant ID
- condition
- task success or failure
- hesitation points
- misunderstood policy objects
- ask-back decision
- repair decision
- short participant quotes
- researcher notes
- exported event log

## Current Instrumentation

The local prototype records browser-side session events for:

- session start
- contract drafting
- contract control changes
- ambient run start
- ask-back trigger
- approve once
- exclude content
- contract revision
- safe rerun
- run completion
- session export

## Export Format

Each export is a JSON file containing:

- `sessionId`
- `sessionStartedAt`
- `participantId`
- `condition`
- `researcherNotes`
- `finalStage`
- `finalContract`
- `finalRevisions`
- `eventLog`

## Recommended Immediate Use

Use this prototype for:

- pilot sessions
- think-aloud walkthroughs
- internal advisor demos
- early instrumentation testing
- collecting early design insights for a short workshop paper

## Expected Early Findings

The pilot should help identify:

- which contract controls are understandable to non-expert users
- whether users understand bystander privacy risks
- when users want the agent to ask back
- whether repair is more meaningful than initial setup
- whether audit summaries help users explain agent behavior