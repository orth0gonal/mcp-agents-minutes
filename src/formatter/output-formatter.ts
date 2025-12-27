/**
 * Output formatter
 * Formats meeting summaries into different output formats
 */

import { MeetingSummaryOutput, MeetingSummary, MeetingMetadata } from '../types/index.js';

export class OutputFormatter {
  /**
   * Format summary as JSON
   */
  toJSON(summary: MeetingSummary, metadata: MeetingMetadata): string {
    const output: MeetingSummaryOutput = {
      summary,
      metadata,
    };
    return JSON.stringify(output, null, 2);
  }

  /**
   * Format summary as Markdown
   */
  toMarkdown(summary: MeetingSummary, metadata: MeetingMetadata): string {
    const lines: string[] = [];

    // Header
    lines.push('# Meeting Summary\n');

    // Metadata
    if (metadata.title) {
      lines.push(`**Title:** ${metadata.title}\n`);
    }
    if (metadata.date) {
      lines.push(`**Date:** ${metadata.date}\n`);
    }
    if (metadata.attendees && metadata.attendees.length > 0) {
      lines.push(`**Attendees:** ${metadata.attendees.join(', ')}\n`);
    }
    if (metadata.duration) {
      lines.push(`**Duration:** ${metadata.duration} minutes\n`);
    }
    lines.push('');

    // Overview
    lines.push('## Overview\n');
    lines.push(`${summary.overview}\n`);
    lines.push('');

    // Key Points
    if (summary.key_points.length > 0) {
      lines.push('## Key Discussion Points\n');
      for (const point of summary.key_points) {
        lines.push(`- ${point}`);
      }
      lines.push('');
    }

    // Decisions
    if (summary.decisions.length > 0) {
      lines.push('## Decisions Made\n');
      for (const decision of summary.decisions) {
        lines.push(`### ${decision.decision}\n`);
        lines.push(`**Context:** ${decision.context}\n`);
        if (decision.timestamp) {
          lines.push(`**Time:** ${decision.timestamp}\n`);
        }
        lines.push('');
      }
    }

    // Action Items
    if (summary.action_items.length > 0) {
      lines.push('## Action Items\n');
      for (const item of summary.action_items) {
        const priority = this.getPriorityEmoji(item.priority);
        let line = `- ${priority} ${item.task}`;
        if (item.owner) {
          line += ` *(@${item.owner})*`;
        }
        if (item.deadline) {
          line += ` **Due:** ${item.deadline}`;
        }
        lines.push(line);
      }
      lines.push('');
    }

    // Topics Discussed
    if (summary.topics_discussed.length > 0) {
      lines.push('## Topics Discussed\n');
      for (const topic of summary.topics_discussed) {
        lines.push(`- ${topic}`);
      }
      lines.push('');
    }

    // Next Steps
    if (summary.next_steps.length > 0) {
      lines.push('## Next Steps\n');
      for (const step of summary.next_steps) {
        lines.push(`1. ${step}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Get emoji representation of priority
   */
  private getPriorityEmoji(priority: 'high' | 'medium' | 'low'): string {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
    }
  }

  /**
   * Format summary as plain text
   */
  toPlainText(summary: MeetingSummary, metadata: MeetingMetadata): string {
    const lines: string[] = [];

    // Header
    lines.push('MEETING SUMMARY');
    lines.push('='.repeat(60));
    lines.push('');

    // Metadata
    if (metadata.title) lines.push(`Title: ${metadata.title}`);
    if (metadata.date) lines.push(`Date: ${metadata.date}`);
    if (metadata.attendees && metadata.attendees.length > 0) {
      lines.push(`Attendees: ${metadata.attendees.join(', ')}`);
    }
    if (metadata.duration) lines.push(`Duration: ${metadata.duration} minutes`);
    lines.push('');

    // Overview
    lines.push('OVERVIEW');
    lines.push('-'.repeat(60));
    lines.push(summary.overview);
    lines.push('');

    // Key Points
    if (summary.key_points.length > 0) {
      lines.push('KEY DISCUSSION POINTS');
      lines.push('-'.repeat(60));
      for (const point of summary.key_points) {
        lines.push(`* ${point}`);
      }
      lines.push('');
    }

    // Decisions
    if (summary.decisions.length > 0) {
      lines.push('DECISIONS MADE');
      lines.push('-'.repeat(60));
      for (const decision of summary.decisions) {
        lines.push(`* ${decision.decision}`);
        lines.push(`  Context: ${decision.context}`);
        if (decision.timestamp) lines.push(`  Time: ${decision.timestamp}`);
      }
      lines.push('');
    }

    // Action Items
    if (summary.action_items.length > 0) {
      lines.push('ACTION ITEMS');
      lines.push('-'.repeat(60));
      for (const item of summary.action_items) {
        let line = `[${item.priority.toUpperCase()}] ${item.task}`;
        if (item.owner) line += ` (@${item.owner})`;
        if (item.deadline) line += ` - Due: ${item.deadline}`;
        lines.push(line);
      }
      lines.push('');
    }

    // Next Steps
    if (summary.next_steps.length > 0) {
      lines.push('NEXT STEPS');
      lines.push('-'.repeat(60));
      for (let i = 0; i < summary.next_steps.length; i++) {
        lines.push(`${i + 1}. ${summary.next_steps[i]}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Format summary in Korean with custom structure
   * Maximum 1000 words, comprehensive and concise
   */
  toKorean(summary: MeetingSummary, metadata: MeetingMetadata): string {
    const lines: string[] = [];

    // Meeting Details
    lines.push('## Meeting Details');
    if (metadata.date && metadata.title) {
      // Format: YYMMDD Title (e.g., 251219 Arbitrum 파트너십 논의)
      const dateStr = this.formatKoreanDate(metadata.date);
      lines.push(`${dateStr} ${metadata.title}`);
    } else if (metadata.date) {
      lines.push(this.formatKoreanDate(metadata.date));
    } else if (metadata.title) {
      lines.push(metadata.title);
    }
    lines.push('');

    // Attendees
    lines.push('## Attendees');
    if (metadata.attendees && metadata.attendees.length > 0) {
      for (const attendee of metadata.attendees) {
        lines.push(`- ${attendee}`);
      }
    }
    lines.push('');

    // Key Discussion Points
    lines.push('## Key Discussion Points');
    if (summary.key_points.length > 0) {
      for (const point of summary.key_points) {
        lines.push(`- ${point}`);
      }
    } else if (summary.topics_discussed.length > 0) {
      for (const topic of summary.topics_discussed) {
        lines.push(`- ${topic}`);
      }
    }

    // Include decisions in key points if available
    if (summary.decisions.length > 0) {
      for (const decision of summary.decisions) {
        lines.push(`- ${decision.decision}`);
      }
    }
    lines.push('');

    // Action Items - grouped by responsible person/organization
    lines.push('## Action Items');
    if (summary.action_items.length > 0) {
      // Group action items by owner
      const groupedItems = this.groupActionItemsByOwner(summary.action_items);

      for (const [owner, items] of Object.entries(groupedItems)) {
        if (owner !== 'unassigned') {
          lines.push(`\n**${owner}:**`);
        }
        for (const item of items) {
          let line = `- ${item.task}`;
          if (item.deadline) {
            line += ` (마감: ${item.deadline})`;
          }
          lines.push(line);
        }
      }
    }
    lines.push('');

    // Next Steps/Meeting
    lines.push('## Next Steps/Meeting');
    if (summary.next_steps.length > 0) {
      // Check if any next step mentions a follow-up meeting
      const followUpMeeting = summary.next_steps.find((step) =>
        /(?:next meeting|follow-up|reconvene|다음 회의|차기 회의)/i.test(step)
      );

      if (followUpMeeting) {
        lines.push(followUpMeeting);
      } else {
        for (const step of summary.next_steps) {
          lines.push(`- ${step}`);
        }
      }
    }

    return lines.join('\n');
  }

  /**
   * Format date in Korean format (YYMMDD)
   */
  private formatKoreanDate(dateStr: string): string {
    try {
      // Try to parse ISO format or other common formats
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const yy = String(date.getFullYear()).slice(-2);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yy}${mm}${dd}`;
      }
    } catch (e) {
      // If parsing fails, try to extract YYMMDD pattern from string
      const match = dateStr.match(/(\d{2})(\d{2})(\d{2})/);
      if (match) {
        return `${match[1]}${match[2]}${match[3]}`;
      }
    }
    // Return original if no formatting possible
    return dateStr;
  }

  /**
   * Group action items by owner/responsible person
   */
  private groupActionItemsByOwner(items: any[]): { [key: string]: any[] } {
    const grouped: { [key: string]: any[] } = {};

    for (const item of items) {
      const owner = item.owner || 'unassigned';
      if (!grouped[owner]) {
        grouped[owner] = [];
      }
      grouped[owner].push(item);
    }

    return grouped;
  }
}
