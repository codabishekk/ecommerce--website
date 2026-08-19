/**
 * Strip markdown formatting from AI reply text.
 * Removes images, links, bold, italic, code, headings, etc.
 */
const cleanMarkdown = (text) => {
    if (!text) return '';
    return text
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')          // ![alt](url)
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')       // [text](url) → text
        .replace(/`{1,3}[^`]*`{1,3}/g, '')             // code blocks
        .replace(/#{1,6}\s*/g, '')                      // headings
        .replace(/\*\*([^*]+)\*\*/g, '$1')              // **bold**
        .replace(/\*([^*]+)\*/g, '$1')                  // *italic*
        .replace(/__([^_]+)__/g, '$1')                  // __bold__
        .replace(/_([^_]+)_/g, '$1')                    // _italic_
        .replace(/~~([^~]+)~~/g, '$1')                  // ~~strikethrough~~
        .replace(/[-*+]\s+/g, '')                       // list bullets
        .replace(/\d+\.\s+/g, '')                       // numbered lists
        .replace(/^>\s*/gm, '')                         // blockquotes
        .replace(/---+/g, '')                           // horizontal rules
        .replace(/\n{2,}/g, '\n\n')                     // collapse extra newlines
        .trim();
};

export default cleanMarkdown;
