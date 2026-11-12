import { Fragment, type ReactNode } from "react";

/**
 * Renders a small, safe subset of inline formatting in data strings:
 *
 *   _text_ or *text*     → italic        <i>, <em>          → italic
 *   **text**             → bold          <b>, <strong>      → bold
 *   `text`               → code
 *   [label](https://…)   → link (opens in a new tab)
 *
 * Output is built as React elements, never injected as HTML, so anything else
 * (unknown tags, stray symbols) just shows as plain text. Underscores inside
 * words (snake_case, file_names) are left alone.
 */

const TOKEN = new RegExp(
  [
    String.raw`\*\*(?<bold>.+?)\*\*`,
    "`(?<code>[^`]+)`",
    String.raw`\[(?<label>[^\]]+)\]\((?<href>[^)\s]+)\)`,
    String.raw`(?<![\w*])\*(?!\s)(?<starEm>[^*]+?)\*(?![\w*])`,
    String.raw`(?<!\w)_(?!\s)(?<underEm>[^_]+?)_(?!\w)`,
    String.raw`<(?<tag>i|em|b|strong)>(?<tagBody>[\s\S]*?)</\k<tag>>`,
  ].join("|"),
  "i",
);

const SAFE_HREF = /^(https?:|mailto:|\/|#)/i;

export function richText(text: string): ReactNode {
  const out: ReactNode[] = [];
  let rest = text;
  let key = 0;

  while (rest) {
    const m = TOKEN.exec(rest);
    if (!m || !m.groups) {
      out.push(rest);
      break;
    }
    if (m.index > 0) out.push(rest.slice(0, m.index));
    const g = m.groups;
    const k = key++;

    if (g.bold !== undefined) out.push(<strong key={k}>{richText(g.bold)}</strong>);
    else if (g.code !== undefined) out.push(<code key={k}>{g.code}</code>);
    else if (g.label !== undefined && !SAFE_HREF.test(g.href)) out.push(m[0]);
    else if (g.label !== undefined)
      out.push(
        <a key={k} href={g.href} target="_blank" rel="noreferrer">
          {richText(g.label)}
        </a>,
      );
    else if (g.starEm !== undefined) out.push(<em key={k}>{richText(g.starEm)}</em>);
    else if (g.underEm !== undefined) out.push(<em key={k}>{richText(g.underEm)}</em>);
    else if (g.tag !== undefined) {
      const body = richText(g.tagBody);
      const tag = g.tag.toLowerCase();
      out.push(tag === "b" || tag === "strong" ? <strong key={k}>{body}</strong> : <em key={k}>{body}</em>);
    }

    rest = rest.slice(m.index + m[0].length);
  }

  return out.length === 1 && typeof out[0] === "string" ? out[0] : <Fragment>{out}</Fragment>;
}
