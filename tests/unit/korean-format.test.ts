/**
 * Korean format output tests
 */

import { describe, it, expect } from 'vitest';
import { TranscriptParser } from '../../src/parser/transcript-parser.js';
import { MeetingSummarizer } from '../../src/summarizer/meeting-summarizer.js';
import { OutputFormatter } from '../../src/formatter/output-formatter.js';
import { MeetingTranscript } from '../../src/types/index.js';

describe('Korean Format Output', () => {
  const parser = new TranscriptParser();
  const summarizer = new MeetingSummarizer();
  const formatter = new OutputFormatter();

  it('should format meeting summary in Korean structure', () => {
    const input: MeetingTranscript = {
      transcript: `Title: Arbitrum 파트너십 논의
Date: 2025-12-19
Attendees: 김철수, 이영희, 박민준

김철수: 이번 Arbitrum과의 파트너십에 대해 논의하겠습니다.
이영희: 기술 통합 일정을 확정해야 합니다. 김철수님이 다음 주까지 제안서를 준비해주세요.
Decision: 2026년 1월부터 Arbitrum 메인넷 통합 시작하기로 결정
Action: 김철수 will prepare partnership proposal by next Friday
박민준: 마케팅 계획도 필요합니다. 이영희님께서 12월 25일까지 마케팅 전략을 작성해주세요.
Action: 이영희 to create marketing strategy by December 25th
Next meeting: 2026년 1월 5일 다음 회의 예정`,
      metadata: {
        title: 'Arbitrum 파트너십 논의',
        date: '2025-12-19',
        attendees: ['김철수', '이영희', '박민준'],
      },
    };

    const parsed = parser.parse(input);
    const summary = summarizer.summarize(parsed);
    const result = formatter.toKorean(summary, parsed.metadata);

    // Check Meeting Details section
    expect(result).toContain('## Meeting Details');
    expect(result).toContain('251219 Arbitrum 파트너십 논의');

    // Check Attendees section
    expect(result).toContain('## Attendees');
    expect(result).toContain('김철수');
    expect(result).toContain('이영희');
    expect(result).toContain('박민준');

    // Check Key Discussion Points section
    expect(result).toContain('## Key Discussion Points');

    // Check Action Items section
    expect(result).toContain('## Action Items');
    expect(result).toContain('**김철수:**');
    expect(result).toContain('**이영희:**');

    // Check Next Steps/Meeting section
    expect(result).toContain('## Next Steps/Meeting');
  });

  it('should group action items by owner in Korean format', () => {
    const input: MeetingTranscript = {
      transcript: `Action: 김철수 will complete task A by Friday
Action: 이영희 to finish task B by next week
Action: 김철수 should review task C`,
    };

    const parsed = parser.parse(input);
    const summary = summarizer.summarize(parsed);
    const result = formatter.toKorean(summary, parsed.metadata);

    // Check that items are grouped by owner
    expect(result).toContain('**김철수:**');
    expect(result).toContain('**이영희:**');

    // Check deadline format
    expect(result).toMatch(/마감:/);
  });

  it('should format date as YYMMDD', () => {
    const input: MeetingTranscript = {
      transcript: 'Meeting content',
      metadata: {
        title: 'Test Meeting',
        date: '2025-12-19',
      },
    };

    const parsed = parser.parse(input);
    const summary = summarizer.summarize(parsed);
    const result = formatter.toKorean(summary, parsed.metadata);

    expect(result).toContain('251219');
  });

  it('should handle meetings without specific sections', () => {
    const input: MeetingTranscript = {
      transcript: 'Simple meeting discussion without specific action items',
      metadata: {
        title: 'Simple Meeting',
        date: '2025-12-20',
      },
    };

    const parsed = parser.parse(input);
    const summary = summarizer.summarize(parsed);
    const result = formatter.toKorean(summary, parsed.metadata);

    // Should still have all required sections
    expect(result).toContain('## Meeting Details');
    expect(result).toContain('## Attendees');
    expect(result).toContain('## Key Discussion Points');
    expect(result).toContain('## Action Items');
    expect(result).toContain('## Next Steps/Meeting');
  });
});
