/**
 * Meeting transcript parser
 * Parses raw meeting transcripts into structured data
 */

import { MeetingTranscript, ParsedMeeting, MeetingSection, MeetingMetadata } from '../types/index.js';

export class TranscriptParser {
  /**
   * Parse a meeting transcript into structured data
   */
  parse(input: MeetingTranscript): ParsedMeeting {
    const metadata = this.extractMetadata(input);
    const sections = this.extractSections(input.transcript);

    return {
      content: input.transcript,
      metadata,
      sections,
    };
  }

  /**
   * Extract metadata from the transcript
   */
  private extractMetadata(input: MeetingTranscript): MeetingMetadata {
    const metadata: MeetingMetadata = input.metadata || {};

    // Extract date if not provided
    if (!metadata.date) {
      const dateMatch = input.transcript.match(/Date:\s*([^\n]+)/i);
      if (dateMatch) {
        metadata.date = dateMatch[1].trim();
      }
    }

    // Extract attendees if not provided
    if (!metadata.attendees || metadata.attendees.length === 0) {
      const attendeesMatch = input.transcript.match(/Attendees:\s*([^\n]+)/i);
      if (attendeesMatch) {
        metadata.attendees = attendeesMatch[1]
          .split(/[,;]/)
          .map((name) => name.trim())
          .filter((name) => name.length > 0);
      }
    }

    // Extract duration if not provided
    if (!metadata.duration) {
      const durationMatch = input.transcript.match(/Duration:\s*(\d+)\s*(?:minutes?|mins?)/i);
      if (durationMatch) {
        metadata.duration = parseInt(durationMatch[1]);
      }
    }

    // Extract title if not provided
    if (!metadata.title) {
      const titleMatch = input.transcript.match(/(?:Title|Subject|Meeting):\s*([^\n]+)/i);
      if (titleMatch) {
        metadata.title = titleMatch[1].trim();
      }
    }

    return metadata;
  }

  /**
   * Extract sections from the transcript
   */
  private extractSections(transcript: string): MeetingSection[] {
    const sections: MeetingSection[] = [];
    const lines = transcript.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const section = this.classifyLine(trimmed);
      if (section) {
        sections.push(section);
      }
    }

    return sections;
  }

  /**
   * Classify a line into a section type
   */
  private classifyLine(line: string): MeetingSection | null {
    // Check for action items
    if (this.isActionItem(line)) {
      return {
        type: 'action',
        content: line,
      };
    }

    // Check for decisions
    if (this.isDecision(line)) {
      return {
        type: 'decision',
        content: line,
      };
    }

    // Check for speaker patterns (e.g., "John: ...")
    const speakerMatch = line.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*):\s*(.+)$/);
    if (speakerMatch) {
      return {
        type: 'discussion',
        content: speakerMatch[2],
        speaker: speakerMatch[1],
      };
    }

    // Default to discussion
    return {
      type: 'discussion',
      content: line,
    };
  }

  /**
   * Check if a line indicates an action item
   */
  private isActionItem(line: string): boolean {
    const actionPatterns = [
      /\b(?:will|should|needs? to|must|action|todo|task)\b/i,
      /\b(?:@\w+|assigned to|owner:)/i,
      /\b(?:by|due|deadline|before)\s+(?:friday|monday|tuesday|wednesday|thursday|saturday|sunday|next week|tomorrow)/i,
    ];

    return actionPatterns.some((pattern) => pattern.test(line));
  }

  /**
   * Check if a line indicates a decision
   */
  private isDecision(line: string): boolean {
    const decisionPatterns = [
      /\b(?:decided|agreed|concluded|resolved|approved)\b/i,
      /\b(?:decision|consensus|agreement|resolution)\b/i,
      /\b(?:we're going with|we'll move forward with|final decision)\b/i,
    ];

    return decisionPatterns.some((pattern) => pattern.test(line));
  }
}
