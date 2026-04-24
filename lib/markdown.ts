import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: false
});

export async function renderMarkdown(markdown: string) {
  return md.render(markdown);
}
