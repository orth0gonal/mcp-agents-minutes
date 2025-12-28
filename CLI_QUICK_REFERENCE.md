# CLI Quick Reference

## Installation

```bash
cd /Users/pyo/workspace/personal/mcp_workflow
npm install
npm run build
npm link
```

## Basic Commands

### Simplest Usage
```bash
meeting-summary ./meeting.txt
```
→ Outputs Korean format to console

### Save to File
```bash
meeting-summary ./meeting.txt -o summary.md
```

### Add a Note
```bash
meeting-summary ./meeting.txt -n "중요: EOD까지 완료 필요"
```

### Different Format
```bash
meeting-summary ./meeting.txt --format json
```

### Complete Example
```bash
meeting-summary ./meetings/251219-arbitrum.txt \
  -f korean \
  -o ./summaries/251219-summary.md \
  -n "다음 회의: 2026-01-05"
```

## Output Formats

| Format | Flag | Description |
|--------|------|-------------|
| korean | `-f korean` | Korean structured format (default) |
| json | `-f json` | JSON data structure |
| markdown | `-f markdown` | English markdown format |
| text | `-f text` | Plain text format |

## Command Options

| Option | Short | Description | Example |
|--------|-------|-------------|---------|
| `--format` | `-f` | Output format | `-f korean` |
| `--output` | `-o` | Save to file | `-o summary.md` |
| `--note` | `-n` | Add note | `-n "Important"` |
| `--help` | `-h` | Show help | `-h` |

## Sample Workflow

### 1. Record Meeting → Save as TXT
```
251219-arbitrum-partnership.txt
```

### 2. Summarize
```bash
meeting-summary ./251219-arbitrum-partnership.txt \
  -o ./251219-summary.md \
  -n "액션 아이템 확인 필요"
```

### 3. Check Output
```bash
cat ./251219-summary.md
```

## File Format Tips

Your meeting record file should include:

```
Title: Meeting Title
Date: YYYY-MM-DD
Attendees: Name 1, Name 2, Name 3

Speaker 1: Discussion content
Speaker 2: Response

Decision: What was decided

Action: Who will do what by when

Next meeting: Date and time
```

## Output Example

```
## Meeting Details
251219 Arbitrum 파트너십 논의

## Attendees
- 김철수 (CTO)
- 이영희 (마케팅 팀장)

## Key Discussion Points
- Point 1
- Point 2

## Action Items

**김철수:**
- Task 1 (마감: Friday)

**이영희:**
- Task 2 (마감: Dec 25)

## Next Steps/Meeting
2026년 1월 5일 오후 2시

---

**Note:** 액션 아이템 확인 필요

📊 Summary Statistics:
   File: 251219-arbitrum-partnership.txt
   Attendees: 4
   Key Points: 5
   Decisions: 2
   Action Items: 4
```

## Troubleshooting

**Command not found:**
```bash
npm link
```

**File not found:**
- Use absolute path: `/full/path/to/file.txt`
- Or relative: `./meetings/file.txt`

**Rebuild after changes:**
```bash
npm run build
```

## Advanced Usage

### Batch Processing
```bash
for file in meetings/*.txt; do
  meeting-summary "$file" -o "summaries/$(basename "$file" .txt)-summary.md"
done
```

### Pipe to Other Commands
```bash
meeting-summary ./meeting.txt | grep "Action Items" -A 10
```

### Integration with Scripts
```bash
#!/bin/bash
MEETING_FILE="$1"
OUTPUT_DIR="./summaries"
NOTE="Processed on $(date +%Y-%m-%d)"

meeting-summary "$MEETING_FILE" \
  -o "$OUTPUT_DIR/$(basename "$MEETING_FILE" .txt)-summary.md" \
  -n "$NOTE"
```

## Help Command

```bash
meeting-summary --help
```

Shows all available options and examples.
