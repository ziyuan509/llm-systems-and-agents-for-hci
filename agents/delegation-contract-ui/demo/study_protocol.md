# Study Prototype Notes

## Current Instrumentation

The local prototype records browser-side session events for:

- session start
- contract drafting
- contract control changes
- research start
- ask-back trigger
- approve once
- deny source
- contract revision
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
