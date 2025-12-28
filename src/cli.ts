#!/usr/bin/env node

/**
 * CLI for meeting minutes summarization
 * Usage: meeting-summary <file-path> [options]
 */

import { readFile, writeFile } from 'fs/promises';
import { basename } from 'path';
import { TranscriptParser } from './parser/transcript-parser.js';
import { MeetingSummarizer } from './summarizer/meeting-summarizer.js';
import { OutputFormatter } from './formatter/output-formatter.js';
import { MeetingTranscript } from './types/index.js';

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const filePath = args[0];
  let format = 'korean';
  let outputPath: string | null = null;
  let note: string | null = null;

  // Parse options
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--format' || args[i] === '-f') {
      format = args[++i] || 'korean';
    } else if (args[i] === '--output' || args[i] === '-o') {
      outputPath = args[++i];
    } else if (args[i] === '--note' || args[i] === '-n') {
      note = args[++i];
    }
  }

  return { filePath, format, outputPath, note };
}

function printHelp() {
  console.log(`
Meeting Minutes Summarization CLI

USAGE:
  meeting-summary <file-path> [options]

ARGUMENTS:
  <file-path>           Path to the meeting record file

OPTIONS:
  -f, --format <type>   Output format: korean, json, markdown, text (default: korean)
  -o, --output <path>   Save output to file (default: print to console)
  -n, --note <text>     Additional note to append to the summary
  -h, --help            Show this help message

EXAMPLES:
  # Basic usage (Korean format to console)
  meeting-summary ./meetings/2025-12-19-meeting.txt

  # Specify output format
  meeting-summary ./meetings/meeting.txt --format json

  # Save to file
  meeting-summary ./meetings/meeting.txt --output ./summaries/summary.md

  # Add a note
  meeting-summary ./meetings/meeting.txt --note "Follow-up required"

  # Combine options
  meeting-summary ./meetings/meeting.txt -f korean -o ./summary.md -n "Important"

OUTPUT:
  The summary is printed to console or saved to the specified file.
  Default format is Korean structured format.
`);
}

async function main() {
  try {
    const { filePath, format, outputPath, note } = parseArgs();

    // Read the meeting record file
    const fileContent = await readFile(filePath, 'utf-8');

    // Create meeting transcript object
    const meetingTranscript: MeetingTranscript = {
      transcript: fileContent,
    };

    // Initialize components
    const parser = new TranscriptParser();
    const summarizer = new MeetingSummarizer();
    const formatter = new OutputFormatter();

    // Parse the transcript
    const parsed = parser.parse(meetingTranscript);

    // Generate summary
    const summary = summarizer.summarize(parsed);

    // Format output based on requested format
    let output: string;
    switch (format) {
      case 'json':
        output = formatter.toJSON(summary, parsed.metadata);
        break;
      case 'text':
        output = formatter.toPlainText(summary, parsed.metadata);
        break;
      case 'markdown':
        output = formatter.toMarkdown(summary, parsed.metadata);
        break;
      case 'korean':
      default:
        output = formatter.toKorean(summary, parsed.metadata);
        break;
    }

    // Append note if provided
    if (note) {
      output += `\n\n---\n\n**Note:** ${note}\n`;
    }

    // Output result
    if (outputPath) {
      await writeFile(outputPath, output, 'utf-8');
      console.log(`✅ Summary saved to: ${outputPath}`);
    } else {
      console.log(output);
    }

    // Print statistics
    const stats = {
      file: basename(filePath),
      attendees: parsed.metadata.attendees?.length || 0,
      keyPoints: summary.key_points.length,
      decisions: summary.decisions.length,
      actionItems: summary.action_items.length,
    };

    console.error(`\n📊 Summary Statistics:`);
    console.error(`   File: ${stats.file}`);
    console.error(`   Attendees: ${stats.attendees}`);
    console.error(`   Key Points: ${stats.keyPoints}`);
    console.error(`   Decisions: ${stats.decisions}`);
    console.error(`   Action Items: ${stats.actionItems}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.error(`❌ Error: File not found - ${(error as any).path}`);
      process.exit(1);
    }

    console.error(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

main();
