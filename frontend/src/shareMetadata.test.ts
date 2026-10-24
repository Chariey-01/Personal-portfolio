import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const rawHead = html.slice(html.indexOf("<head>"), html.indexOf("</head>"));
const head = rawHead.replace(/\s+/g, " ");
const site = "https://personal-portfolio-tefg.vercel.app/";
const image = `${site}portfolio-preview.png`;

function meta(attr: "property" | "name", key: string) {
  const pattern = new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`, "g");
  return [...head.matchAll(pattern)].map((match) => match[1]);
}

describe("share metadata in the initial HTML", () => {
  it("publishes one Open Graph and Twitter card before any script", () => {
    const beforeScript = rawHead.slice(0, rawHead.indexOf("<script"));

    expect(meta("property", "og:title")).toEqual(["Charity Jepkoech | Full-Stack Software Engineer"]);
    expect(meta("property", "og:description")[0]).toContain("Full-Stack Software Engineer");
    expect(meta("property", "og:description")).toHaveLength(1);
    expect(meta("property", "og:url")).toEqual([site]);
    expect(meta("property", "og:image")).toEqual([image]);
    expect(meta("property", "og:image:width")).toEqual(["1200"]);
    expect(meta("property", "og:image:height")).toEqual(["630"]);
    expect(meta("name", "twitter:card")).toEqual(["summary_large_image"]);
    expect(meta("name", "twitter:title")).toEqual(["Charity Jepkoech | Full-Stack Software Engineer"]);
    expect(meta("name", "twitter:image")).toEqual([image]);
    expect(meta("name", "description")).toHaveLength(1);
    expect(beforeScript).toContain(`<link rel="canonical" href="${site}" />`);
    expect(beforeScript).toContain("og:image");
    expect(beforeScript).not.toContain("Charity's Portfolio");
  });
});
