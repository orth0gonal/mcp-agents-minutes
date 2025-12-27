# MCP Meeting Minutes Server - Usage Examples

This document provides examples of how to use the MCP Meeting Minutes Server tools.

## Available Tools

### 1. `summarize_meeting`

Generates a comprehensive summary from a meeting transcript, including key points, decisions, action items, and next steps.

#### Parameters

- `transcript` (required): The meeting transcript text to summarize
- `metadata` (optional): Meeting metadata object
  - `date`: Meeting date (ISO 8601 format)
  - `attendees`: Array of attendee names
  - `duration`: Meeting duration in minutes
  - `title`: Meeting title
  - `location`: Meeting location
- `format` (optional): Output format - `json`, `markdown`, or `text` (default: `markdown`)

#### Example: Basic Usage

```typescript
{
  "transcript": "Sarah: We need to decide on the deployment timeline. Mike: I propose we deploy next Friday. Team agreed. Action: Sarah will prepare deployment checklist.",
  "format": "markdown"
}
```

#### Example: With Metadata

```typescript
{
  "transcript": "Discussion about Q4 roadmap...",
  "metadata": {
    "title": "Q4 Planning Meeting",
    "date": "2025-12-15",
    "attendees": ["Sarah Johnson", "Mike Chen"],
    "duration": 45
  },
  "format": "json"
}
```

#### Sample Output (Markdown)

```markdown
# Meeting Summary

**Title:** Q4 Planning Meeting
**Date:** 2025-12-15
**Attendees:** Sarah Johnson, Mike Chen
**Duration:** 45 minutes

## Overview

Q4 Planning Meeting with 2 attendees. The meeting resulted in 2 decisions and 3 action items.

## Key Discussion Points

- Mobile app redesign progress at 80% completion
- API v2 migration challenges with backward compatibility
- Performance issues affecting enterprise customers
- Security audit findings in authentication flow

## Decisions Made

### Provide 6-month migration window and deprecate API v1 by June 2026

**Context:** After discussing the pros and cons of maintaining two API versions vs. forcing migration

### Security vulnerabilities take priority over feature development

**Context:** Security audit revealed vulnerabilities in the authentication flow

## Action Items

- 🔴 Mike to analyze performance bottlenecks and create optimization plan **Due:** December 18th
- 🟡 David will create migration docs *(@David)* **Due:** December 22nd
- 🟡 Emily to complete competitive analysis for real-time collaboration *(@Emily)* **Due:** December 29th

## Topics Discussed

- Mobile app redesign
- API v2 migration
- Performance optimization
- Security vulnerabilities

## Next Steps

1. Mike to analyze performance bottlenecks and create optimization plan
2. David will create migration docs by December 22nd
3. Emily to complete competitive analysis for real-time collaboration
4. Reconvene in early January to review progress
```

---

### 2. `extract_action_items`

Extracts action items from a meeting transcript with owners, deadlines, and priorities.

#### Parameters

- `transcript` (required): The meeting transcript text to analyze
- `format` (optional): Output format - `json`, `markdown`, or `text` (default: `json`)

#### Example Usage

```typescript
{
  "transcript": "Mike will investigate the bug by Friday. Sarah needs to prepare the presentation for next week. David should review the code when possible.",
  "format": "markdown"
}
```

#### Sample Output (JSON)

```json
{
  "action_items": [
    {
      "task": "Mike will investigate the bug",
      "owner": "Mike",
      "deadline": "Friday",
      "priority": "medium",
      "status": "pending"
    },
    {
      "task": "Sarah needs to prepare the presentation",
      "owner": "Sarah",
      "deadline": "next week",
      "priority": "medium",
      "status": "pending"
    },
    {
      "task": "David should review the code",
      "owner": "David",
      "priority": "low",
      "status": "pending"
    }
  ]
}
```

#### Sample Output (Markdown)

```markdown
# Action Items

- 🟡 Mike will investigate the bug *(@Mike)* **Due:** Friday
- 🟡 Sarah needs to prepare the presentation *(@Sarah)* **Due:** next week
- 🟢 David should review the code *(@David)*
```

---

## Integration with Claude Code

To use this MCP server with Claude Code, add it to your MCP configuration:

### Configuration (claude_desktop_config.json)

```json
{
  "mcpServers": {
    "meeting-minutes": {
      "command": "node",
      "args": ["/path/to/mcp_workflow/dist/index.js"]
    }
  }
}
```

### Using in Claude Code

Once configured, you can use the tools directly in your conversations:

**Example 1: Summarize a meeting**

```
User: Please summarize this meeting transcript:
[paste transcript]

Claude: [Uses summarize_meeting tool and returns formatted summary]
```

**Example 2: Extract action items**

```
User: Extract all action items from this meeting:
[paste transcript]

Claude: [Uses extract_action_items tool and returns action items list]
```

---

## Tips for Best Results

### Meeting Transcript Format

For best results, format your transcripts with:

1. **Speaker identification**: Use "Name: " prefix for each speaker
2. **Clear action indicators**: Use words like "will", "should", "action", "@mentions"
3. **Decision markers**: Use phrases like "decided", "agreed", "resolved"
4. **Metadata headers**: Include Date, Attendees, Duration at the top

### Example Well-Formatted Transcript

```
Title: Sprint Planning
Date: 2025-12-15
Attendees: Alice, Bob, Charlie
Duration: 30 minutes

Alice: Let's review the sprint goals.

Bob: I'll work on the authentication feature this sprint.

Charlie: Agreed. We also decided to postpone the UI redesign to next sprint.

Decision: UI redesign postponed to Sprint 14.

Action: @Bob to complete authentication by Friday (high priority).
```

---

## Output Formats

### JSON Format
- Best for programmatic processing
- Structured data with all fields
- Easy to parse and integrate with other tools

### Markdown Format
- Best for human readability
- Rich formatting with emojis and emphasis
- Great for documentation and reports

### Text Format
- Best for plain text environments
- Clean, simple formatting
- Compatible with any text viewer

---

## Common Use Cases

1. **Meeting Documentation**: Convert voice recordings (transcribed) into structured summaries
2. **Action Item Tracking**: Extract tasks for project management tools
3. **Decision Records**: Document key decisions with context
4. **Team Alignment**: Share concise meeting summaries with stakeholders
5. **Historical Reference**: Create searchable meeting archives

---

## Error Handling

The server provides clear error messages for common issues:

- **Missing transcript**: "Invalid input: transcript is required"
- **Invalid format**: "Invalid input: format must be json, markdown, or text"
- **Malformed input**: Specific validation errors from Zod schema

---

## Performance

- **Typical processing time**: <2 seconds for meetings up to 10,000 words
- **Recommended limits**: Transcripts under 50,000 words for optimal performance
- **Memory usage**: Minimal - suitable for concurrent processing
