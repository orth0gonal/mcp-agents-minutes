#!/usr/bin/env node

/**
 * MCP Server for Meeting Minutes Summarization
 * Provides tools for processing and summarizing meeting transcripts
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { SummarizeMeetingTool } from './tools/summarize-meeting.js';
import { ExtractActionItemsTool } from './tools/extract-action-items.js';
import { SummarizeMeetingFileTool } from './tools/summarize-meeting-file.js';

// Initialize tools
const summarizeMeetingTool = new SummarizeMeetingTool();
const extractActionItemsTool = new ExtractActionItemsTool();
const summarizeMeetingFileTool = new SummarizeMeetingFileTool();

// Create MCP server
const server = new Server(
  {
    name: 'mcp-meeting-minutes',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler for listing available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      SummarizeMeetingTool.getDefinition(),
      SummarizeMeetingFileTool.getDefinition(),
      ExtractActionItemsTool.getDefinition(),
    ],
  };
});

/**
 * Handler for tool execution
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'summarize_meeting': {
        const result = await summarizeMeetingTool.execute(args as any);
        return {
          content: [
            {
              type: 'text',
              text: result,
            },
          ],
        };
      }

      case 'summarize_meeting_file': {
        const result = await summarizeMeetingFileTool.execute(args as any);
        return {
          content: [
            {
              type: 'text',
              text: result,
            },
          ],
        };
      }

      case 'extract_action_items': {
        const result = await extractActionItemsTool.execute(args as any);
        return {
          content: [
            {
              type: 'text',
              text: result,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Meeting Minutes Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
