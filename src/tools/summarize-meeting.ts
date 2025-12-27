/**
 * MCP tool: summarize_meeting
 * Generates a comprehensive meeting summary from a transcript
 */

import { z } from 'zod';
import { TranscriptParser } from '../parser/transcript-parser.js';
import { MeetingSummarizer } from '../summarizer/meeting-summarizer.js';
import { OutputFormatter } from '../formatter/output-formatter.js';
import { MeetingTranscript } from '../types/index.js';

// Input schema for the tool
export const SummarizeMeetingSchema = z.object({
  transcript: z.string().describe('The meeting transcript text to summarize'),
  metadata: z
    .object({
      date: z.string().optional().describe('Meeting date (ISO 8601 format)'),
      attendees: z.array(z.string()).optional().describe('List of meeting attendees'),
      duration: z.number().optional().describe('Meeting duration in minutes'),
      title: z.string().optional().describe('Meeting title'),
      location: z.string().optional().describe('Meeting location'),
    })
    .optional()
    .describe('Optional meeting metadata'),
  format: z
    .enum(['json', 'markdown', 'text'])
    .default('markdown')
    .describe('Output format (json, markdown, or text)'),
});

export type SummarizeMeetingInput = z.infer<typeof SummarizeMeetingSchema>;

export class SummarizeMeetingTool {
  private parser: TranscriptParser;
  private summarizer: MeetingSummarizer;
  private formatter: OutputFormatter;

  constructor() {
    this.parser = new TranscriptParser();
    this.summarizer = new MeetingSummarizer();
    this.formatter = new OutputFormatter();
  }

  /**
   * Execute the summarize_meeting tool
   */
  async execute(input: SummarizeMeetingInput): Promise<string> {
    try {
      // Validate input
      const validated = SummarizeMeetingSchema.parse(input);

      // Create meeting transcript object
      const meetingTranscript: MeetingTranscript = {
        transcript: validated.transcript,
        metadata: validated.metadata,
      };

      // Parse the transcript
      const parsed = this.parser.parse(meetingTranscript);

      // Generate summary
      const summary = this.summarizer.summarize(parsed);

      // Format output based on requested format
      switch (validated.format) {
        case 'json':
          return this.formatter.toJSON(summary, parsed.metadata);
        case 'text':
          return this.formatter.toPlainText(summary, parsed.metadata);
        case 'markdown':
        default:
          return this.formatter.toMarkdown(summary, parsed.metadata);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid input: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get tool definition for MCP
   */
  static getDefinition() {
    return {
      name: 'summarize_meeting',
      description:
        'Generates a comprehensive summary from a meeting transcript, including key points, decisions, action items, and next steps',
      inputSchema: {
        type: 'object',
        properties: {
          transcript: {
            type: 'string',
            description: 'The meeting transcript text to summarize',
          },
          metadata: {
            type: 'object',
            properties: {
              date: {
                type: 'string',
                description: 'Meeting date (ISO 8601 format)',
              },
              attendees: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of meeting attendees',
              },
              duration: {
                type: 'number',
                description: 'Meeting duration in minutes',
              },
              title: {
                type: 'string',
                description: 'Meeting title',
              },
              location: {
                type: 'string',
                description: 'Meeting location',
              },
            },
          },
          format: {
            type: 'string',
            enum: ['json', 'markdown', 'text'],
            default: 'markdown',
            description: 'Output format (json, markdown, or text)',
          },
        },
        required: ['transcript'],
      },
    };
  }
}
