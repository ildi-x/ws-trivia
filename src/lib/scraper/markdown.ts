import TurndownService from "turndown";

let turndown: TurndownService | null = null;

function getTurndown(): TurndownService {
  if (!turndown) {
    turndown = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
    });

    turndown.remove(["script", "style", "noscript"]);
    turndown.addRule("removeCallout", {
      filter: (node) =>
        node.nodeName === "DIV" &&
        (node as HTMLElement).classList?.contains("callout"),
      replacement: () => "",
    });
  }

  return turndown;
}

export function htmlToMarkdown(html: string): string {
  const cleaned = html
    .replace(/<div class="callout[^"]*"[\s\S]*?<\/div>/gi, "")
    .replace(/<section class="article-votes[^"]*"[\s\S]*?<\/section>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .trim();

  return getTurndown().turndown(cleaned).trim();
}
