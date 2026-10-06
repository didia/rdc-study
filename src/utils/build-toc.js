const slugify = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const stripTags = (html) => html.replace(/<[^>]*>/g, '').trim();

/**
 * Adds ids to the top-level headings of an HTML string (h1 when the content has any, otherwise h2)
 * and returns them as a table of contents.
 */
export default function buildToc(html) {
  const level = /<h1[\s>]/i.test(html) ? 1 : 2;
  const pattern = new RegExp(`<h${level}([^>]*)>([\\s\\S]*?)</h${level}>`, 'gi');
  const toc = [];
  const used = new Set();

  const content = html.replace(pattern, (match, attributes, inner) => {
    const text = stripTags(inner);
    let id = slugify(text) || `section-${toc.length + 1}`;
    while (used.has(id)) id = `${id}-${toc.length + 1}`;
    used.add(id);
    toc.push({id, text});
    return `<h${level}${attributes} id="${id}">${inner}</h${level}>`;
  });

  return {content, toc};
}
