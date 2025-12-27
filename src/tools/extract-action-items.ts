/**
 * MCP tool: extract_action_items
 * Extracts action items from a meeting transcript
 */

import { z } from 'zod';
import { TranscriptParser } from '../parser/transcript-parser.js';
import { MeetingSummarizer } from '../summarizer/meeting-summarizer.js';
import { MeetingTranscript, ActionItem } from '../types/index.js';

// Input schema for the tool
export const ExtractActionItemsSchema = z.object({
  transcript: z.string().describe('The meeting transcript text to analyze'),
  format: z
    .enum(['json', 'markdown', 'text'])
    .default('json')
    .describe('Output format (json, markdown, or text)'),
});

export type ExtractActionItemsInput = z.infer<typeof ExtractActionItemsSchema>;

export class ExtractActionItemsTool {
  private parser: TranscriptParser;
  private summarizer: MeetingSummarizer;

  constructor() {
    this.parser = new TranscriptParser();
    this.summarizer = new MeetingSummarizer();
  }

  /**
   * Execute the extract_action_items tool
   */
  async execute(input: ExtractActionItemsInput): Promise<string> {
    try {
      // Validate input
      const validated = ExtractActionItemsSchema.parse(input);

      // Create meeting transcript object
      const meetingTranscript: MeetingTranscript = {
        transcript: validated.transcript,
      };

      // Parse the transcript
      const parsed = this.parser.parse(meetingTranscript);

      // Generate summary (to extract action items)
      const summary = this.summarizer.summarize(parsed);

      // Format output based on requested format
      switch (validated.format) {
        case 'json':
          return JSON.stringify({ action_items: summary.action_items }, null, 2);
        case 'markdown':
          return this.formatAsMarkdown(summary.action_items);
        case 'text':
          return this.formatAsText(summary.action_items);
        default:
          return JSON.stringify({ action_items: summary.action_items }, null, 2);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid input: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Format action items as Markdown
   */
  private formatAsMarkdown(items: ActionItem[]): string {
    if (items.length === 0) {
      return '# Action Items\n\nNo action items found.';
    }

    const lines: string[] = ['# Action Items\n'];

    for (const item of items) {
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

    return lines.join('\n');
  }

  /**
   * Format action items as plain text
   */
  private formatAsText(items: ActionItem[]): string {
    if (items.length === 0) {
      return 'ACTION ITEMS\n\nNo action items found.';
    }

    const lines: string[] = ['ACTION ITEMS', '='.repeat(60), ''];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let line = `${i + 1}. [${item.priority.toUpperCase()}] ${item.task}`;
      if (item.owner) line += ` (@${item.owner})`;
      if (item.deadline) line += ` - Due: ${item.deadline}`;
      lines.push(line);
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
   * Get tool definition for MCP
   */
  static getDefinition() {
    return {
      name: 'extract_action_items',
      description:
        'Extracts action items from a meeting transcript with owners, deadlines, and priorities',
      inputSchema: {
        type: 'object',
        properties: {
          transcript: {
            type: 'string',
            description: 'The meeting transcript text to analyze',
          },
          format: {
            type: 'string',
            enum: ['json', 'markdown', 'text'],
            default: 'json',
            description: 'Output format (json, markdown, or text)',
          },
        },
        required: ['transcript'],
      },
    };
  }
}
