/**
 * Type definitions for meeting minutes summarization
 */

export interface MeetingMetadata {
  date?: string;
  attendees?: string[];
  duration?: number; // in minutes
  title?: string;
  location?: string;
}

export interface MeetingTranscript {
  transcript: string;
  metadata?: MeetingMetadata;
}

export interface Decision {
  decision: string;
  context: string;
  timestamp?: string;
}

export interface ActionItem {
  task: string;
  owner?: string;
  deadline?: string;
  priority: 'high' | 'medium' | 'low';
  status?: 'pending' | 'in_progress' | 'completed';
}

export interface MeetingSummary {
  overview: string;
  key_points: string[];
  decisions: Decision[];
  action_items: ActionItem[];
  topics_discussed: string[];
  next_steps: string[];
}

export interface MeetingSummaryOutput {
  summary: MeetingSummary;
  metadata: MeetingMetadata;
}

export interface ParsedMeeting {
  content: string;
  metadata: MeetingMetadata;
  sections: MeetingSection[];
}

export interface MeetingSection {
  type: 'discussion' | 'decision' | 'action' | 'other';
  content: string;
  speaker?: string;
  timestamp?: string;
}
