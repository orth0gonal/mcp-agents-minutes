# Korean Format Example

This document demonstrates the Korean format output for meeting summaries.

## Input Example

```json
{
  "transcript": "Title: Arbitrum 파트너십 논의\nDate: 2025-12-19\nAttendees: 김철수, 이영희, 박민준\n\n김철수: 이번 Arbitrum과의 파트너십에 대해 논의하겠습니다.\n이영희: 기술 통합 일정을 확정해야 합니다. 김철수님이 다음 주까지 제안서를 준비해주세요.\nDecision: 2026년 1월부터 Arbitrum 메인넷 통합 시작하기로 결정\nAction: 김철수 will prepare partnership proposal by next Friday\n박민준: 마케팅 계획도 필요합니다. 이영희님께서 12월 25일까지 마케팅 전략을 작성해주세요.\nAction: 이영희 to create marketing strategy by December 25th\nNext meeting: 2026년 1월 5일 다음 회의 예정",
  "metadata": {
    "title": "Arbitrum 파트너십 논의",
    "date": "2025-12-19",
    "attendees": ["김철수", "이영희", "박민준"]
  },
  "format": "korean"
}
```

## Output Example

```markdown
## Meeting Details
251219 Arbitrum 파트너십 논의

## Attendees
- 김철수
- 이영희
- 박민준

## Key Discussion Points
- 기술 통합 일정을 확정해야 합니다
- 마케팅 계획도 필요합니다
- 2026년 1월부터 Arbitrum 메인넷 통합 시작하기로 결정

## Action Items

**김철수:**
- prepare partnership proposal (마감: next Friday)

**이영희:**
- create marketing strategy (마감: December 25)

## Next Steps/Meeting
2026년 1월 5일 다음 회의 예정
```

## Format Specifications

### Meeting Details
- **Format**: `YYMMDD Title`
- **Example**: `251219 Arbitrum 파트너십 논의`
- Date is automatically formatted to YYMMDD from ISO 8601 format

### Attendees
- Bullet list of all participants
- Roles are specified if provided in metadata

### Key Discussion Points
- Brief summary of each main topic
- Bulleted list format
- Includes both discussion points and decisions

### Action Items
- **Grouped by responsible person or organization**
- Format: `- Task description (마감: deadline)`
- Deadline only shown if available
- Not in table format - uses bullet lists with owner headers

### Next Steps/Meeting
- Date and time for follow-up meetings
- Additional next steps if no meeting date found

## Usage with Claude Code

To get Korean format output:

```typescript
{
  "transcript": "[your meeting transcript]",
  "metadata": {
    "date": "2025-12-19",
    "title": "Meeting Title",
    "attendees": ["Person 1", "Person 2"]
  },
  "format": "korean"
}
```

## Key Features

1. **Korean Language Support**: Fully supports Korean names and content
2. **Automatic Date Formatting**: Converts ISO dates to YYMMDD format
3. **Grouped Action Items**: Actions are grouped by owner for clarity
4. **Comprehensive Coverage**: Ensures no critical details are missed
5. **Concise Output**: Maximum 1000 words for easy reference
6. **Structured Format**: Clear headings for all required sections

## Supported Name Formats

The Korean format supports:
- Korean names (e.g., 김철수, 이영희)
- English names (e.g., John Smith)
- Mixed format names
- @mentions (e.g., @김철수)

## Deadline Formats Recognized

- Relative dates: "next Friday", "next week"
- Specific dates: "December 25th", "12/25"
- Korean dates: "12월 25일"
