# MCP Meeting Minutes Server

An intelligent MCP (Model Context Protocol) server that processes meeting recordings and transcripts to generate structured, actionable summaries with key points, decisions, and action items.

## Features

- 📝 **Comprehensive Summarization**: Extracts overview, key points, decisions, and next steps
- ✅ **Action Item Extraction**: Identifies tasks with owners, deadlines, and priorities
- 🎯 **Decision Tracking**: Captures decisions with context and timestamps
- 📊 **Multiple Output Formats**: JSON, Markdown, and plain text
- 🔍 **Smart Parsing**: Detects speakers, topics, and meeting structure
- ⚡ **Fast Processing**: Handles typical meetings (<10K words) in <2 seconds

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd mcp_workflow
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Configure Claude Code to use the server (see [Configuration](#configuration))

## Configuration

### Claude Code Integration

Add the server to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "meeting-minutes": {
      "command": "node",
      "args": ["/absolute/path/to/mcp_workflow/dist/index.js"]
    }
  }
}
```

**Note**: Replace `/absolute/path/to/mcp_workflow` with the actual path to this project.

### Development Mode

For development with auto-rebuild:

```bash
npm run dev
```

## Available Tools

### 1. `summarize_meeting`

Generates a comprehensive meeting summary including:
- Overview of the meeting
- Key discussion points
- Decisions made with context
- Action items with owners and deadlines
- Topics discussed
- Next steps

**Parameters:**
- `transcript` (string, required): Meeting transcript text
- `metadata` (object, optional): Meeting metadata (date, attendees, duration, title)
- `format` (enum, optional): Output format - `json`, `markdown`, or `text` (default: `markdown`)

### 2. `extract_action_items`

Extracts action items from meeting transcripts with:
- Task description
- Owner/assignee
- Deadline
- Priority level (high/medium/low)

**Parameters:**
- `transcript` (string, required): Meeting transcript text
- `format` (enum, optional): Output format - `json`, `markdown`, or `text` (default: `json`)

## Usage Examples

See [examples/usage.md](examples/usage.md) for detailed usage examples and integration patterns.

### Quick Example

```typescript
// Using summarize_meeting
{
  "transcript": "Sarah: We need to decide on the deployment timeline. Mike: I propose next Friday. Team: Agreed. Action: Sarah will prepare deployment checklist by Thursday.",
  "metadata": {
    "title": "Deployment Planning",
    "date": "2025-12-15",
    "attendees": ["Sarah", "Mike"]
  },
  "format": "markdown"
}
```

## Project Structure

```
mcp_workflow/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── types/                # TypeScript type definitions
│   ├── parser/               # Meeting transcript parser
│   ├── summarizer/           # Summarization engine
│   ├── formatter/            # Output formatters
│   └── tools/                # MCP tool implementations
├── tests/
│   ├── fixtures/             # Sample meeting transcripts
│   └── unit/                 # Unit tests
├── examples/                 # Usage examples and documentation
├── PRD.md                    # Product requirements document
├── AGENT.md                  # Development memory and context
└── README.md                 # This file
```

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm test
npm run test:coverage
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

## Meeting Transcript Format

For best results, format transcripts with:

1. **Speaker identification**: `Name: dialogue`
2. **Action indicators**: `will`, `should`, `action`, `@mentions`
3. **Decision markers**: `decided`, `agreed`, `resolved`
4. **Metadata headers**: Date, Attendees, Duration at the top

### Example

```
Title: Sprint Planning
Date: 2025-12-15
Attendees: Alice, Bob, Charlie
Duration: 30 minutes

Alice: Let's review the sprint goals.
Bob: I'll work on authentication this sprint.
Decision: UI redesign postponed to Sprint 14.
Action: @Bob to complete authentication by Friday (high priority).
```

## Output Formats

### JSON
- Structured data for programmatic processing
- All fields included with type safety
- Ideal for integration with other tools

### Markdown
- Human-readable with rich formatting
- Emoji indicators for priorities
- Perfect for documentation and sharing

### Plain Text
- Clean, simple formatting
- Compatible with any text viewer
- Great for email and plain text environments

## Performance

- **Processing Time**: <2 seconds for typical meetings (<10K words)
- **Recommended Limits**: Transcripts under 50K words
- **Memory Usage**: Minimal, suitable for concurrent processing
- **Accuracy**: ≥90% for action items, ≥95% for decisions

## Architecture

The server is built with:

- **TypeScript**: Type-safe development
- **Zod**: Schema validation
- **MCP SDK**: Model Context Protocol integration
- **Modular Design**: Separation of concerns (parser → summarizer → formatter)

### Core Components

1. **TranscriptParser**: Parses raw transcripts into structured data
2. **MeetingSummarizer**: Analyzes content and extracts insights
3. **OutputFormatter**: Formats summaries in different output types
4. **MCP Tools**: Exposes functionality via MCP protocol

## Contributing

See [PRD.md](PRD.md) for project roadmap and [AGENT.md](AGENT.md) for development context.

## License

MIT

## Support

For issues, feature requests, or questions, please open an issue in the repository.

## Roadmap

- [x] Core summarization engine
- [x] Action item extraction
- [x] Multiple output formats
- [x] MCP server implementation
- [ ] Audio file transcription integration
- [ ] Multi-language support
- [ ] Custom summarization templates
- [ ] Integration with task management systems
- [ ] Real-time meeting summarization

## Version

**Current Version**: 1.0.0

See [PRD.md](PRD.md) for detailed version history and task tracking.
