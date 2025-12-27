/**
 * Basic functionality tests for MCP Meeting Minutes Server
 */

import { describe, it, expect } from 'vitest';
import { TranscriptParser } from '../../src/parser/transcript-parser.js';
import { MeetingSummarizer } from '../../src/summarizer/meeting-summarizer.js';
import { OutputFormatter } from '../../src/formatter/output-formatter.js';
import { MeetingTranscript } from '../../src/types/index.js';

describe('TranscriptParser', () => {
  const parser = new TranscriptParser();

  it('should parse basic meeting transcript', () => {
    const input: MeetingTranscript = {
      transcript: 'Sarah: We need to launch next week. Decision: Launch confirmed for Friday.',
    };

    const result = parser.parse(input);
    expect(result.content).toBe(input.transcript);
    expect(result.sections.length).toBeGreaterThan(0);
  });

  it('should extract metadata from transcript', () => {
    const input: MeetingTranscript = {
      transcript: `Date: 2025-12-15
Attendees: Alice, Bob, Charlie
Duration: 30 minutes

Discussion content here.`,
    };

    const result = parser.parse(input);
    expect(result.metadata.date).toBe('2025-12-15');
    expect(result.metadata.attendees).toContain('Alice');
    expect(result.metadata.attendees).toContain('Bob');
    expect(result.metadata.duration).toBe(30);
  });

  it('should use provided metadata', () => {
    const input: MeetingTranscript = {
      transcript: 'Meeting content',
      metadata: {
        title: 'Test Meeting',
        date: '2025-12-20',
        attendees: ['John', 'Jane'],
      },
    };

    const result = parser.parse(input);
    expect(result.metadata.title).toBe('Test Meeting');
    expect(result.metadata.date).toBe('2025-12-20');
    expect(result.metadata.attendees).toEqual(['John', 'Jane']);
  });
});

describe('MeetingSummarizer', () => {
  const parser = new TranscriptParser();
  const summarizer = new MeetingSummarizer();

  it('should generate meeting summary', () => {
    const input: MeetingTranscript = {
      transcript: `Title: Planning Meeting
Mike: We decided to launch next Friday.
Action: Sarah will prepare the checklist by Thursday.`,
      metadata: {
        attendees: ['Mike', 'Sarah'],
      },
    };

    const parsed = parser.parse(input);
    const summary = summarizer.summarize(parsed);

    expect(summary.overview).toBeTruthy();
    expect(summary.key_points).toBeDefined();
    expect(summary.decisions).toBeDefined();
    expect(summary.action_items).toBeDefined();
  });

  it('should extract action items', () => {
    const input: MeetingTranscript = {
      transcript: 'Action: Mike will complete the task by Friday.',
    };

    const parsed = parser.parse(input);
    const summary = summarizer.summarize(parsed);

    expect(summary.action_items.length).toBeGreaterThan(0);
    const actionItem = summary.action_items[0];
    expect(actionItem.task).toBeTruthy();
    expect(actionItem.priority).toMatch(/high|medium|low/);
  });

  it('should extract decisions', () => {
    const input: MeetingTranscript = {
      transcript: 'After discussion, we decided to postpone the launch.',
    };

    const parsed = parser.parse(input);
    const summary = summarizer.summarize(parsed);

    expect(summary.decisions.length).toBeGreaterThan(0);
    const decision = summary.decisions[0];
    expect(decision.decision).toBeTruthy();
    expect(decision.context).toBeTruthy();
  });
});

describe('OutputFormatter', () => {
  const formatter = new OutputFormatter();

  const mockSummary = {
    overview: 'Test meeting overview',
    key_points: ['Point 1', 'Point 2'],
    decisions: [
      {
        decision: 'Launch postponed',
        context: 'Due to technical issues',
      },
    ],
    action_items: [
      {
        task: 'Fix bugs',
        owner: 'John',
        deadline: 'Friday',
        priority: 'high' as const,
      },
    ],
    topics_discussed: ['Feature X', 'Bug fixes'],
    next_steps: ['Review code', 'Deploy'],
  };

  const mockMetadata = {
    title: 'Test Meeting',
    date: '2025-12-15',
    attendees: ['Alice', 'Bob'],
    duration: 30,
  };

  it('should format as JSON', () => {
    const result = formatter.toJSON(mockSummary, mockMetadata);
    expect(result).toBeTruthy();
    const parsed = JSON.parse(result);
    expect(parsed.summary).toBeDefined();
    expect(parsed.metadata).toBeDefined();
  });

  it('should format as Markdown', () => {
    const result = formatter.toMarkdown(mockSummary, mockMetadata);
    expect(result).toContain('# Meeting Summary');
    expect(result).toContain('Test Meeting');
    expect(result).toContain('Alice, Bob');
    expect(result).toContain('Launch postponed');
    expect(result).toContain('Fix bugs');
  });

  it('should format as plain text', () => {
    const result = formatter.toPlainText(mockSummary, mockMetadata);
    expect(result).toContain('MEETING SUMMARY');
    expect(result).toContain('Test Meeting');
    expect(result).toContain('DECISIONS MADE');
    expect(result).toContain('ACTION ITEMS');
  });
});
