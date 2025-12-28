# Meeting Minutes MCP Server - Usage Guide

## 🎯 Recommended I/O Interface

This guide explains the simplest way to use the meeting minutes summarization server.

## 📁 Method 1: File Upload (Recommended)

**Simplest approach** - Just provide the file path to your meeting record.

### Using with Claude Code

Simply say:
```
Please summarize this meeting file in Korean format:
/path/to/your/meeting-record.txt
```

Claude will automatically use the `summarize_meeting_file` tool.

### Tool Parameters

```json
{
  "file_path": "/path/to/meeting-record.txt",
  "format": "korean"  // Optional, defaults to "korean"
}
```

### Supported File Formats
- `.txt` - Plain text files
- `.md` - Markdown files
- Any text-based format

---

## 📝 Method 2: Direct Text Input

If you prefer to paste the content directly:

```json
{
  "transcript": "[paste your meeting content here]",
  "format": "korean"
}
```

---

## 🔧 Available Tools

### 1. `summarize_meeting_file` (Recommended)
**Purpose**: Summarize a meeting from a file

**Input**:
```json
{
  "file_path": "/Users/pyo/workspace/meetings/2025-12-19-arbitrum.txt",
  "format": "korean"  // or "json", "markdown", "text"
}
```

**Output**: Complete Korean structured summary

---

### 2. `summarize_meeting` (Alternative)
**Purpose**: Summarize a meeting from direct text input

**Input**:
```json
{
  "transcript": "Title: Meeting...\nDate: 2025-12-19...",
  "metadata": {
    "title": "Meeting Title",
    "date": "2025-12-19",
    "attendees": ["Person 1", "Person 2"]
  },
  "format": "korean"
}
```

---

### 3. `extract_action_items`
**Purpose**: Extract only action items from a meeting

**Input**:
```json
{
  "transcript": "Meeting content...",
  "format": "korean"  // Groups by owner in Korean
}
```

---

## 📋 Meeting Record File Format

### Recommended Structure

```
Title: [Meeting Title]
Date: [YYYY-MM-DD or Korean date]
Attendees: [Name 1], [Name 2], [Name 3]
Duration: [X minutes] (optional)

[Speaker 1]: [Discussion content]
[Speaker 2]: [Discussion content]

Decision: [Decision made]

Action: [Person] will/to/should [task] by [deadline]

Next meeting: [Date and time]
```

### Example File

See `examples/sample-meeting-record.txt` for a complete example.

---

## 🎯 Korean Format Output Structure

The output follows this structure:

```markdown
## Meeting Details
YYMMDD Title

## Attendees
- Name 1
- Name 2

## Key Discussion Points
- Point 1
- Point 2
- Decision 1
- Decision 2

## Action Items

**Owner 1:**
- Task 1 (마감: deadline)
- Task 2 (마감: deadline)

**Owner 2:**
- Task 3 (마감: deadline)

## Next Steps/Meeting
Next meeting information
```

---

## 💡 Quick Start Examples

### Example 1: Summarize a File

**With Claude Code:**
```
User: Summarize this meeting in Korean format:
/Users/pyo/workspace/meetings/arbitrum-partnership.txt

Claude: [Uses summarize_meeting_file tool automatically]
```

### Example 2: Specify Different Format

```
User: Summarize this meeting as JSON:
/Users/pyo/workspace/meetings/arbitrum-partnership.txt
format: json

Claude: [Uses summarize_meeting_file with format="json"]
```

### Example 3: Extract Only Action Items

```
User: Extract action items from:
/Users/pyo/workspace/meetings/arbitrum-partnership.txt

Claude: [Uses extract_action_items tool]
```

---

## 🔍 Testing Your Setup

### Test with Sample File

1. Use the provided sample:
```bash
# File is at:
/Users/pyo/workspace/personal/mcp_workflow/examples/sample-meeting-record.txt
```

2. In Claude Code, say:
```
Please summarize this meeting in Korean format:
/Users/pyo/workspace/personal/mcp_workflow/examples/sample-meeting-record.txt
```

3. You should get output like:
```markdown
## Meeting Details
251219 Arbitrum 파트너십 논의

## Attendees
- 김철수 (CTO)
- 이영희 (마케팅 팀장)
- 박민준 (개발팀장)
- 최지훈 (프로덕트 매니저)

## Key Discussion Points
- L2 솔루션 통합 필요성
- 마케팅 측면에서 Arbitrum 브랜드 인지도
- 개발 리소스 고려 시 최소 2개월 필요
- 2026년 1월부터 Arbitrum 메인넷 통합 프로젝트 시작
- 테스트넷 배포는 2026년 1월 15일 목표

## Action Items

**김철수:**
- prepare technical partnership proposal (마감: next Friday)

**이영희:**
- create comprehensive marketing strategy (마감: December 25)
- coordinate with Arbitrum Foundation for joint announcement (마감: January 10)

**박민준:**
- prepare development resource allocation plan (마감: next Tuesday)

## Next Steps/Meeting
2026년 1월 5일 오후 2시, 온라인 회의
```

---

## 📂 Workflow Recommendation

### Suggested Workflow:

1. **Record your meeting** → Save as `.txt` file
2. **Name the file** → Use clear naming: `YYMMDD-topic.txt`
3. **In Claude Code** → Simply provide the file path
4. **Get summary** → Automatic Korean format summary
5. **Save result** → Copy to your documentation

### File Naming Convention:
```
251219-arbitrum-partnership.txt
251220-team-retrospective.txt
251221-product-planning.txt
```

---

## ⚙️ Configuration

Make sure your `claude_desktop_config.json` includes:

```json
{
  "mcpServers": {
    "meeting-minutes": {
      "command": "node",
      "args": ["/Users/pyo/workspace/personal/mcp_workflow/dist/index.js"]
    }
  }
}
```

Restart Claude Code after any configuration changes.

---

## 🆘 Troubleshooting

**File not found error:**
- Use absolute paths: `/Users/pyo/workspace/meetings/file.txt`
- Check file exists: `ls /path/to/file.txt`

**No Korean names detected:**
- Ensure file is UTF-8 encoded
- Check names are in proper format: `김철수`, not `kim chul-su`

**Missing action items:**
- Use clear action indicators: `will`, `to`, `should`, `needs to`
- Include owner names before action verbs

---

## 📚 Additional Resources

- **Full documentation**: `README.md`
- **Korean format examples**: `examples/korean-format-example.md`
- **Sample files**: `examples/sample-meeting-record.txt`
- **Tests**: `tests/unit/korean-format.test.ts`
