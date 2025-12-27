/**
 * Meeting summarizer
 * Generates structured summaries from parsed meeting data
 */

import {
  ParsedMeeting,
  MeetingSummary,
  Decision,
  ActionItem,
  MeetingSection,
} from '../types/index.js';

export class MeetingSummarizer {
  /**
   * Generate a comprehensive summary from parsed meeting data
   */
  summarize(parsed: ParsedMeeting): MeetingSummary {
    const overview = this.generateOverview(parsed);
    const key_points = this.extractKeyPoints(parsed);
    const decisions = this.extractDecisions(parsed);
    const action_items = this.extractActionItems(parsed);
    const topics_discussed = this.extractTopics(parsed);
    const next_steps = this.extractNextSteps(parsed, action_items);

    return {
      overview,
      key_points,
      decisions,
      action_items,
      topics_discussed,
      next_steps,
    };
  }

  /**
   * Generate a high-level overview of the meeting
   */
  private generateOverview(parsed: ParsedMeeting): string {
    const { metadata, sections } = parsed;
    const title = metadata.title || 'Meeting';
    const attendeeCount = metadata.attendees?.length || 0;
    const decisionCount = sections.filter((s) => s.type === 'decision').length;
    const actionCount = sections.filter((s) => s.type === 'action').length;

    let overview = `${title}`;
    if (attendeeCount > 0) {
      overview += ` with ${attendeeCount} attendees`;
    }
    overview += `. `;

    if (decisionCount > 0 || actionCount > 0) {
      const parts: string[] = [];
      if (decisionCount > 0) parts.push(`${decisionCount} decision${decisionCount > 1 ? 's' : ''}`);
      if (actionCount > 0) parts.push(`${actionCount} action item${actionCount > 1 ? 's' : ''}`);
      overview += `The meeting resulted in ${parts.join(' and ')}.`;
    } else {
      overview += 'The meeting covered various discussion topics.';
    }

    return overview;
  }

  /**
   * Extract key discussion points
   */
  private extractKeyPoints(parsed: ParsedMeeting): string[] {
    const points = new Set<string>();
    const discussionSections = parsed.sections.filter((s) => s.type === 'discussion');

    // Extract sentences that appear significant (longer, have multiple speakers, etc.)
    for (const section of discussionSections) {
      if (section.content.length > 50) {
        // Significant length threshold
        points.add(this.cleanText(section.content));
      }
    }

    // Limit to most relevant points
    return Array.from(points).slice(0, 10);
  }

  /**
   * Extract decisions made during the meeting
   */
  private extractDecisions(parsed: ParsedMeeting): Decision[] {
    const decisions: Decision[] = [];
    const decisionSections = parsed.sections.filter((s) => s.type === 'decision');

    for (const section of decisionSections) {
      decisions.push({
        decision: this.cleanText(section.content),
        context: this.findContext(section, parsed.sections),
        timestamp: section.timestamp,
      });
    }

    return decisions;
  }

  /**
   * Extract action items with owners and deadlines
   */
  private extractActionItems(parsed: ParsedMeeting): ActionItem[] {
    const items: ActionItem[] = [];
    const actionSections = parsed.sections.filter((s) => s.type === 'action');

    for (const section of actionSections) {
      const task = this.cleanText(section.content);
      const owner = this.extractOwner(section.content);
      const deadline = this.extractDeadline(section.content);
      const priority = this.determinePriority(section.content);

      items.push({
        task,
        owner,
        deadline,
        priority,
        status: 'pending',
      });
    }

    return items;
  }

  /**
   * Extract main topics discussed
   */
  private extractTopics(parsed: ParsedMeeting): string[] {
    const topics = new Set<string>();

    // Look for section headers or topic indicators
    for (const section of parsed.sections) {
      const topicMatch = section.content.match(/^(?:Topic|Agenda|Discussion):\s*(.+)/i);
      if (topicMatch) {
        topics.add(topicMatch[1].trim());
      }
    }

    // If no explicit topics, derive from decisions and actions
    if (topics.size === 0) {
      const decisionsTopics = parsed.sections
        .filter((s) => s.type === 'decision')
        .map((s) => this.deriveTopicFromContent(s.content));
      decisionsTopics.forEach((t) => topics.add(t));
    }

    return Array.from(topics).slice(0, 8);
  }

  /**
   * Extract next steps based on action items
   */
  private extractNextSteps(parsed: ParsedMeeting, actionItems: ActionItem[]): string[] {
    const steps: string[] = [];

    // Prioritize high-priority action items
    const highPriority = actionItems.filter((item) => item.priority === 'high');
    steps.push(...highPriority.map((item) => item.task));

    // Add other immediate action items
    const immediate = actionItems
      .filter((item) => item.priority === 'medium' && item.deadline)
      .slice(0, 3);
    steps.push(...immediate.map((item) => item.task));

    // Look for follow-up meeting mentions
    const followUpPattern = /(?:next meeting|follow-up|reconvene)/i;
    for (const section of parsed.sections) {
      if (followUpPattern.test(section.content)) {
        steps.push(this.cleanText(section.content));
      }
    }

    return steps.slice(0, 5);
  }

  /**
   * Extract owner from action item text
   * Supports English, Korean, and other Unicode names
   */
  private extractOwner(text: string): string | undefined {
    // Look for @mentions (alphanumeric including Unicode)
    const mentionMatch = text.match(/@([\p{L}\p{N}_]+)/u);
    if (mentionMatch) return mentionMatch[1];

    // Look for "assigned to" or "owner:" with Unicode name support
    const assignedMatch = text.match(/(?:assigned to|owner:)\s*([\p{L}][\p{L}\s]*)/iu);
    if (assignedMatch) return assignedMatch[1].trim();

    // Look for "Name will..." with Unicode support
    const willMatch = text.match(/^([\p{L}][\p{L}\s]{0,20}?)\s+(?:will|to)\s+/iu);
    if (willMatch) return willMatch[1].trim();

    // Look for Korean/Unicode name patterns before action verbs
    const koreanMatch = text.match(/([\p{L}]{2,10})\s+(?:will|to|should|needs?|must)/iu);
    if (koreanMatch) return koreanMatch[1].trim();

    return undefined;
  }

  /**
   * Extract deadline from action item text
   */
  private extractDeadline(text: string): string | undefined {
    const deadlinePatterns = [
      /(?:by|due|deadline|before)\s+((?:next\s+)?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month))/i,
      /(?:by|due|deadline|before)\s+(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)/,
      /(?:by|due|deadline|before)\s+([A-Z][a-z]+\s+\d{1,2}(?:,?\s+\d{4})?)/,
    ];

    for (const pattern of deadlinePatterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }

    return undefined;
  }

  /**
   * Determine priority from action item text
   */
  private determinePriority(text: string): 'high' | 'medium' | 'low' {
    const highPriorityWords = /\b(?:urgent|critical|asap|immediately|high priority)\b/i;
    const lowPriorityWords = /\b(?:when possible|nice to have|optional|low priority)\b/i;

    if (highPriorityWords.test(text)) return 'high';
    if (lowPriorityWords.test(text)) return 'low';
    return 'medium';
  }

  /**
   * Find context for a decision by looking at surrounding sections
   */
  private findContext(section: MeetingSection, allSections: MeetingSection[]): string {
    const index = allSections.indexOf(section);
    const contextBefore = allSections.slice(Math.max(0, index - 2), index);
    const contextText = contextBefore.map((s) => s.content).join(' ');
    return this.cleanText(contextText).slice(0, 200) || 'General discussion';
  }

  /**
   * Derive topic from content
   */
  private deriveTopicFromContent(content: string): string {
    // Extract first few words as topic
    const words = content.split(/\s+/).slice(0, 5).join(' ');
    return this.cleanText(words);
  }

  /**
   * Clean and normalize text
   */
  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?@-]/g, '')
      .trim();
  }
}
