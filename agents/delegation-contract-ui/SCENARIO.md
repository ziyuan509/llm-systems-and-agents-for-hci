# Representative Scenario

## Scenario Name

Governing an ambient AI assistant in a shared studio meeting

## Why This Scenario

This scenario is a strong workshop prototype because it surfaces:

- sensing boundaries in a shared physical space
- bystander privacy
- memory and disclosure decisions
- runtime ask-back under uncertainty
- policy repair after a boundary conflict

## User

A student uses an ambient AI assistant during a shared studio meeting. The
assistant can summarize the user's notes, remember action-item preferences, and
draft a follow-up message.

The user is not an agent developer and does not want to inspect raw execution
traces or write prompt rules. Other students may be nearby, so some sensed
comments should not be stored or disclosed.

## Task

The user asks:

- "Summarize my shared studio meeting, remember my own action items, and draft a follow-up. Do not store or disclose bystander comments unless I explicitly approve."

## Initial Contract

The system suggests:

- summarize the user's spoken notes
- remember the user's task preferences
- do not process bystander voices by default
- require approval before external sharing
- ask back when bystander or disclosure risk crosses the threshold

## Runtime Event

During execution, the assistant handles:

- the user's spoken meeting notes
- the user's task preference memory
- a bystander voice segment detected while preparing the summary

The system detects that:

- the bystander segment is outside the current sensing boundary
- storing or disclosing it could affect someone who did not delegate to the agent

## Ask-Back Moment

The interface tells the user:

- another person's voice was detected
- the current contract does not authorize autonomous processing of bystander voices
- the user can exclude it, include an anonymized mention once, or edit the contract

The user chooses:

- edit the contract to keep bystander voices excluded and require approval before external sharing

## Repair

The system reruns the summary from a safe checkpoint.

It then produces:

- a meeting summary based on the user's own notes
- a task preference memory update for the user only
- an audit note that bystander content was excluded due to the revised contract

## Why This Scenario Is Good for the MVP

- it is clearly situated in a pervasive AI setting
- it makes bystander privacy visible without requiring real sensors
- it turns privacy control into policy repair, not prompt editing
- it distinguishes governance from generic progress tracking or debugging

## What This Scenario Lets You Evaluate

- whether users understand sensing, memory, disclosure, and escalation boundaries
- whether ask-back timing feels appropriate
- whether users can repair future behavior after seeing a boundary conflict
- whether the audit summary supports calibrated reliance and accountability
