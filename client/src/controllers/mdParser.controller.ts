import MarkdownIt from 'markdown-it';
import type {Token} from 'markdown-it';

const md: MarkdownIt = new MarkdownIt({
  html: true, // Enable HTML tags in source
});

/**
 * Extracts HTML tags embedded in a Markdown string.
 * @param mdContent - Raw markdown content string
 * @returns Array of HTML strings found within the markdown
 */
export function extractHtmlFromMarkdown(mdContent: string): string[] {
  const tokens: Token[] = md.parse(mdContent, {});
  const htmlSegments: string[] = [];

  for (const token of tokens) {
    if (token.type === 'html_block' || token.type === 'html_inline') {
      if (typeof token.content === 'string') {
        htmlSegments.push(token.content.trim());
      }
    }
  }

  return htmlSegments;
}
