// Temple Ledger: journal pages use the same ink-black, saffron-signal, bilingual editorial system as the landing page.

import { useEffect } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Mail, MessageCircle, Share2 } from "lucide-react";
import { getJournalPost } from "@/lib/journal";
import { trackEvent } from "@/lib/analytics";
import NotFound from "@/pages/NotFound";

const SITE_URL = "https://bhavishyashakti.manus.space";
const HERO_IMAGE = `${SITE_URL}/manus-storage/bhavishyashakti-hero_ee601a20.png`;

function upsertMeta(selector: string, attributes: Record<string, string>, content: string) {
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => node?.setAttribute(key, value));
    document.head.appendChild(node);
  }
  node.setAttribute("content", content);
}

function upsertCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
  link.href = url;
}

export default function Journal() {
  const [, params] = useRoute("/journal/:slug");
  const post = params?.slug ? getJournalPost(params.slug) : undefined;
  const lang = typeof document !== "undefined" && document.documentElement.lang.startsWith("hi") ? "hi" : "en";

  useEffect(() => {
    if (!post) return;
    const title = `${lang === "en" ? post.titleEn : post.titleHi} | BhavishyaShakti`;
    const description = lang === "en" ? post.excerptEn : post.excerptHi;
    const url = `${SITE_URL}/journal/${post.slug}`;
    document.documentElement.lang = lang === "hi" ? "hi-IN" : "en-IN";
    document.title = title;
    upsertMeta('meta[name="description"]', { name: "description" }, description);
    upsertMeta('meta[name="keywords"]', { name: "keywords" }, post.keywords.join(", "));
    upsertMeta('meta[property="og:type"]', { property: "og:type" }, "article");
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, title);
    upsertMeta('meta[property="og:description"]', { property: "og:description" }, description);
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, url);
    upsertMeta('meta[property="og:image"]', { property: "og:image" }, HERO_IMAGE);
    upsertMeta('meta[property="og:image:alt"]', { property: "og:image:alt" }, "BhavishyaShakti astrology journal");
    upsertMeta('meta[property="article:section"]', { property: "article:section" }, post.labelEn);
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, title);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, HERO_IMAGE);
    upsertCanonical(url);
    let schema = document.head.querySelector<HTMLScriptElement>("#journal-jsonld");
    if (!schema) { schema = document.createElement("script"); schema.id = "journal-jsonld"; schema.type = "application/ld+json"; document.head.appendChild(schema); }
    schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "BlogPosting", headline: lang === "en" ? post.titleEn : post.titleHi, description, image: HERO_IMAGE, url, datePublished: "2026-08-12", dateModified: "2026-08-12", inLanguage: lang === "en" ? "en-IN" : "hi-IN", author: { "@type": "Organization", name: "BhavishyaShakti", url: SITE_URL }, publisher: { "@type": "Organization", name: "BhavishyaShakti", url: SITE_URL } });
    return () => { document.head.querySelector("#journal-jsonld")?.remove(); };
  }, [lang, post]);

  if (!post) return <NotFound />;
  const title = lang === "en" ? post.titleEn : post.titleHi;
  const label = lang === "en" ? post.labelEn : post.labelHi;
  const excerpt = lang === "en" ? post.excerptEn : post.excerptHi;
  const body = lang === "en" ? post.bodyEn : post.bodyHi;
  const url = `${SITE_URL}/journal/${post.slug}`;

  return <main className="min-h-screen bg-[#0a0908] text-[#f7ede0]"><header className="border-b border-[#f28c28]/15 bg-[#0a0908]/90"><div className="bs-shell flex h-[76px] items-center justify-between"><Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full border border-[#f28c28]/45 bg-[#15110f]"><img src="/manus-storage/bhavishyashakti-mark_ff149554.png" alt="BhavishyaShakti" className="h-7 w-7 object-contain" /></span><span><span className="bs-serif block text-[21px] font-semibold leading-none">BhavishyaShakti</span><span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.24em] text-[#b97832]">JOURNAL · जर्नल</span></span></Link><Link href="/" className="inline-flex items-center gap-2 border border-[#f28c28]/35 px-3 py-2 text-xs font-semibold text-[#f2a85d]"><ArrowLeft className="h-3.5 w-3.5" /> {lang === "en" ? "Back to reading" : "रीडिंग पर लौटें"}</Link></div></header><article><section className="border-b border-[#f28c28]/15 bg-[radial-gradient(circle_at_75%_20%,rgba(242,140,40,0.14),transparent_28%),#110e0c] py-24 lg:py-32"><div className="bs-shell max-w-[840px]"><div className="eyebrow"><span /> {label}</div><h1 className="bs-serif max-w-[820px] text-6xl font-semibold leading-[0.92] sm:text-8xl">{title}</h1><p className="mt-8 max-w-[680px] text-lg leading-8 text-[#c8b6a5]">{excerpt}</p><div className="mt-8 flex flex-wrap gap-3 text-xs text-[#8f8174]"><span>BhavishyaShakti Journal</span><span>·</span><span>{lang === "en" ? "2 min read" : "2 मिनट"}</span><span>·</span><span>12 Aug 2026</span></div></div></section><section className="bs-shell grid max-w-[980px] gap-12 py-20 lg:grid-cols-[1fr_250px] lg:py-28"><div className="space-y-7 text-base leading-8 text-[#cbbbab]">{body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<p className="border-l-2 border-[#f28c28] pl-5 text-sm leading-6 text-[#f2a85d]">{lang === "en" ? "Astrology is belief-based guidance. Outcomes vary; use practical judgment and professional advice where appropriate." : "ज्योतिष विश्वास-आधारित मार्गदर्शन है। परिणाम अलग हो सकते हैं; जहां जरूरी हो वहां व्यावहारिक समझ और विशेषज्ञ सलाह लें।"}</p></div><aside className="h-fit border border-[#f28c28]/20 bg-[#15110f] p-5"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f28c28]">{lang === "en" ? "Share this note" : "यह नोट साझा करें"}</p><div className="mt-5 grid gap-2"><a onClick={() => trackEvent("share_click", { channel: "whatsapp", surface: "article", article: post.slug })} href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-[#f28c28]/30 px-3 py-2 text-xs text-[#f2a85d]"><MessageCircle className="h-3.5 w-3.5" /> WhatsApp</a><a onClick={() => trackEvent("share_click", { channel: "email", surface: "article", article: post.slug })} href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${excerpt}\n\n${url}`)}`} className="inline-flex items-center gap-2 border border-[#f28c28]/30 px-3 py-2 text-xs text-[#f2a85d]"><Mail className="h-3.5 w-3.5" /> {lang === "en" ? "Email" : "ईमेल"}</a><button type="button" onClick={async () => { trackEvent("share_click", { channel: "native", surface: "article", article: post.slug }); if (navigator.share) await navigator.share({ title, text: excerpt, url }).catch(() => undefined); }} className="inline-flex items-center gap-2 border border-[#f28c28]/30 px-3 py-2 text-xs text-[#f2a85d]"><Share2 className="h-3.5 w-3.5" /> {lang === "en" ? "Share" : "शेयर"}</button></div></aside></section></article></main>;
}
