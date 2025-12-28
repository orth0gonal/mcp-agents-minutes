/**
 * MCP tool: summarize_meeting_file
 * Generates a comprehensive meeting summary from a file
 */

import { z } from 'zod';
import { readFile } from 'fs/promises';
import { TranscriptParser } from '../parser/transcript-parser.js';
import { MeetingSummarizer } from '../summarizer/meeting-summarizer.js';
import { OutputFormatter } from '../formatter/output-formatter.js';
import { MeetingTranscript } from '../types/index.js';

// Input schema for the tool
export const SummarizeMeetingFileSchema = z.object({
  file_path: z.string().describe('Path to the meeting transcript file'),
  format: z
    .enum(['json', 'markdown', 'text', 'korean'])
    .default('korean')
    .describe('Output format (json, markdown, text, or korean)'),
});

export type SummarizeMeetingFileInput = z.infer<typeof SummarizeMeetingFileSchema>;

export class SummarizeMeetingFileTool {
  private parser: TranscriptParser;
  private summarizer: MeetingSummarizer;
  private formatter: OutputFormatter;

  constructor() {
    this.parser = new TranscriptParser();
    this.summarizer = new MeetingSummarizer();
    this.formatter = new OutputFormatter();
  }

  /**
   * Execute the summarize_meeting_file tool
   */
  async execute(input: SummarizeMeetingFileInput): Promise<string> {
    try {
      // Validate input
      const validated = SummarizeMeetingFileSchema.parse(input);

      // Read the file
      const fileContent = await readFile(validated.file_path, 'utf-8');

      // Create meeting transcript object
      const meetingTranscript: MeetingTranscript = {
        transcript: fileContent,
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
        case 'korean':
          return this.formatter.toKorean(summary, parsed.metadata);
        case 'markdown':
        default:
          return this.formatter.toMarkdown(summary, parsed.metadata);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid input: ${error.message}`);
      }
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`File not found: ${(error as any).path}`);
      }
      throw error;
    }
  }

  /**
   * Get tool definition for MCP
   */
  static getDefinition() {
    return {
      name: 'summarize_meeting_file',
      description:
        'Generates a comprehensive Korean summary from a meeting transcript file. Automatically extracts meeting details, attendees, key points, action items, and next steps.',
      inputSchema: {
        type: 'object',
        properties: {
          file_path: {
            type: 'string',
            description: 'Path to the meeting transcript file (txt, md, or any text file)',
          },
          format: {
            type: 'string',
            enum: ['json', 'markdown', 'text', 'korean'],
            default: 'korean',
            description:
              'Output format - korean (default) for structured Korean format, or json/markdown/text',
          },
        },
        required: ['file_path'],
      },
    };
  }
}
