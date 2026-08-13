# SEO implementation notes

## Official sources

1. Google Search Essentials — https://developers.google.com/search/docs/essentials
   Google emphasizes helpful, reliable, people-first content; using words users search for in prominent locations such as the title and main heading; crawlable links; descriptive alt text; and accurate structured data. Meeting the guidance does not guarantee crawling, indexing, rankings, or traffic.

2. Influencing title links in Google Search — https://developers.google.com/search/docs/appearance/title-link
   Use a descriptive, concise `<title>`, avoid vague or keyword-stuffed titles, make the main visual heading clear, keep title language aligned with the page’s primary language, and use a concise brand reference.

3. Google structured data introduction — https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
   Structured data can provide explicit clues about page meaning and may enable richer search appearances. JSON-LD is a maintainable format. Markup must accurately describe visible content; it should be validated with the Rich Results Test.

4. Bing Webmaster Guidelines — https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a
   Bing recommends XML sitemaps, IndexNow for URL changes, crawlable internal links, canonical URL consolidation, clear title/meta/heading structure, semantic HTML, accurate structured data, focused user-first content, and freshness signals. SEO does not guarantee rankings or traffic.

## Implementation decisions

- Use a concise bilingual title and description that reflect the actual astrology remedy-plan landing page rather than repeating keywords.
- Add canonical, Open Graph, and Twitter metadata plus JSON-LD for Organization, WebSite, WebPage, and Service/Offer information that is visible on the page.
- Add `robots.txt` and `sitemap.xml` for the canonical root URL. Replace the placeholder canonical host with the final production domain before launch if the domain changes.
- Keep objective-aware preview content as visible page text so search engines can understand the service without relying on image-only content.
- Do not add fabricated reviews, ratings, purchase events, or guaranteed-results claims.

## Current official guidance checked on 12 Aug 2026

- Google’s SEO Starter Guide says title links should be unique, clear, concise, and accurate; descriptions should be unique and relevant; visible content, descriptive URLs, crawlable internal links, useful headings, and descriptive image alt text help search engines understand pages. It also makes clear that SEO changes do not guarantee rankings.
- Google’s snippet guidance says snippets are primarily generated from visible page content, with the meta description used when it better describes the page. Meta descriptions should be page-specific, human-readable, and descriptive rather than keyword strings.
- Google’s structured-data guidance recommends JSON-LD when practical and requires markup to accurately describe visible content; validation with the Rich Results Test is recommended.
- Bing’s Webmaster Guidelines emphasize XML sitemaps, IndexNow for URL changes, crawlable internal links, canonical URL consolidation, semantic HTML, clear title/meta/heading structure, focused user-first content, accurate structured data, and freshness signals. Bing also states that SEO does not guarantee rankings or traffic.

### References

1. [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
2. [Google: Control your snippets in search results](https://developers.google.com/search/docs/appearance/snippet)
3. [Google: Introduction to structured data markup](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
4. [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
