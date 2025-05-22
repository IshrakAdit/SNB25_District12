import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true, // Enable HTML tags in source
});

export function extractHtmlFromMarkdown(mdContent) {
  const tokens = md.parse(mdContent, {});
  const htmlSegments = [];

  tokens.forEach(token => {
    if (token.type === 'html_block' || token.type === 'html_inline') {
      htmlSegments.push(token.content.trim());
    }
  });

  return htmlSegments;
}
