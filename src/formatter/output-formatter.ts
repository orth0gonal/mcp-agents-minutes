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
}
