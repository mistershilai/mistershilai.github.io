<?xml version="1.0" encoding="UTF-8"?>
<!--
  Makes /rss.xml render as a readable page in a browser instead of dumping
  raw XML. Feed readers ignore this entirely and parse the underlying XML.
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="/rss/channel/title"/> · Feed</title>
        <link rel="icon" type="image/png" sizes="64x64" href="/img-opt/favicon-64.png"/>
        <style>
          :root {
            --ink: #1a1a1a;
            --paper: #fbfaf7;
            --accent: #0077be;
            --rule: rgba(0,0,0,0.1);
            --muted: rgba(26,26,26,0.62);
            --card: #ffffff;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --ink: #f3f0e8;
              --paper: #0e1117;
              --accent: #4aa3d9;
              --rule: rgba(255,255,255,0.12);
              --muted: rgba(243,240,232,0.6);
              --card: rgba(255,255,255,0.03);
            }
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 3rem 1.5rem 5rem;
            background: var(--paper);
            color: var(--ink);
            font-family: "Source Serif 4", Georgia, "Times New Roman", serif;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
          }
          .wrap { max-width: 44rem; margin: 0 auto; }
          .eyebrow {
            font-family: Inter, system-ui, -apple-system, sans-serif;
            font-size: 0.7rem;
            font-weight: 600;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: var(--accent);
            margin: 0 0 0.6rem;
          }
          h1 { font-size: 2rem; margin: 0 0 0.5rem; line-height: 1.15; }
          .desc { color: var(--muted); margin: 0 0 1.75rem; }
          .note {
            border: 1px solid var(--rule);
            background: var(--card);
            border-radius: 12px;
            padding: 1rem 1.15rem;
            font-family: Inter, system-ui, -apple-system, sans-serif;
            font-size: 0.86rem;
            color: var(--muted);
            margin-bottom: 2.5rem;
          }
          .note code {
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 0.85em;
            background: rgba(0,0,0,0.06);
            padding: 2px 6px;
            border-radius: 5px;
            color: var(--ink);
            word-break: break-all;
          }
          @media (prefers-color-scheme: dark) {
            .note code { background: rgba(255,255,255,0.08); }
          }
          .note a { color: var(--accent); }
          ul { list-style: none; margin: 0; padding: 0; }
          li { padding: 1.35rem 0; border-top: 1px solid var(--rule); }
          .item-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin: 0 0 0.3rem;
          }
          .item-title a { color: var(--ink); text-decoration: none; }
          .item-title a:hover { color: var(--accent); }
          time {
            font-family: Inter, system-ui, -apple-system, sans-serif;
            font-size: 0.75rem;
            color: var(--muted);
          }
          .item-desc { margin: 0.45rem 0 0; color: var(--muted); }
          .home {
            display: inline-block;
            margin-top: 2.5rem;
            font-family: Inter, system-ui, -apple-system, sans-serif;
            font-size: 0.85rem;
            color: var(--accent);
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <p class="eyebrow">RSS Feed</p>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="desc"><xsl:value-of select="/rss/channel/description"/></p>

          <div class="note">
            This is a web feed. Paste the address below into a reader such as
            <a href="https://netnewswire.com/">NetNewsWire</a>,
            <a href="https://feedly.com/">Feedly</a>, or
            <a href="https://www.inoreader.com/">Inoreader</a> to get new posts
            automatically.
            <br/><br/>
            <code><xsl:value-of select="/rss/channel/link"/>rss.xml</code>
          </div>

          <ul>
            <xsl:for-each select="/rss/channel/item">
              <li>
                <p class="item-title">
                  <a href="{link}"><xsl:value-of select="title"/></a>
                </p>
                <time><xsl:value-of select="substring(pubDate, 1, 16)"/></time>
                <p class="item-desc"><xsl:value-of select="description"/></p>
              </li>
            </xsl:for-each>
          </ul>

          <a class="home" href="/blog">← Read on the site</a>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
