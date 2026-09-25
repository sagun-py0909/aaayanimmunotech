import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock, Eye } from "lucide-react";
import { Link, useLocation, useRoute, useSearch } from "wouter";
import { Html, PageShell, ProductCard, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { catalogue, contact } from "@/data/site";
import { fetchPost, fetchPosts, initialBlogData } from "@/lib/blog";
import { applySeoEntry } from "@/lib/seo";
import { blogCategories, categorySlug, formatPostDate, readingMinutes, type PostSummary, type PublicPost } from "@shared/blog";
import { blogIndexSeo, blogPostSeo, notFoundSeo } from "@shared/seo";
import NotFound from "./NotFound";

function usePosts() {
  const [posts, setPosts] = useState<PostSummary[] | null>(() => initialBlogData("/blog")?.posts ?? null);
  useEffect(() => {
    if (posts) return;
    fetchPosts().then(setPosts).catch(() => setPosts([]));
  }, [posts]);
  return posts;
}

function Cover({ post, className = "" }: { post: Pick<PostSummary, "coverImage" | "coverAlt">; className?: string }) {
  return <div className={`overflow-hidden bg-[#651B26] ${className}`}>
    {post.coverImage ? <img src={post.coverImage} alt={post.coverAlt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center font-serif text-5xl tracking-[0.2em] text-[#C5A059]/40">AA</div>}
  </div>;
}

const Meta = ({ post }: { post: PostSummary }) => <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.18em]">
  <span className="text-[#8C6D2F]">{post.category}</span>
  <span className="text-[#4E141D]/25">/</span>
  <time dateTime={post.publishAt} className="text-[#777067]">{formatPostDate(post.publishAt)}</time>
  <span className="inline-flex items-center gap-1 text-[#777067]"><Clock size={11} />{post.readingMinutes} min</span>
</div>;

function PostCard({ post }: { post: PostSummary }) {
  return <Link href={`/blog/${post.slug}`} className="group block">
    <Cover post={post} className="aspect-[1.35]" />
    <div className="pt-5">
      <Meta post={post} />
      <h3 className="mt-3 font-serif text-[28px] leading-[1.02] tracking-[-0.02em]">{post.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6f6a61]">{post.excerpt}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] transition group-hover:text-[#8C6D2F]">Read article <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span>
    </div>
  </Link>;
}

export function BlogIndex() {
  const posts = usePosts();
  const search = useSearch();
  const active = new URLSearchParams(search).get("category") || "";
  const used = useMemo(() => blogCategories.filter((category) => posts?.some((post) => post.category === category)), [posts]);
  const visible = (posts ?? []).filter((post) => !active || categorySlug(post.category) === active);
  const [featured, ...rest] = visible;

  useEffect(() => { if (posts) applySeoEntry(blogIndexSeo(posts)); }, [posts]);

  // The filter lives in the URL like the products filter; canonical stays /blog.
  const setCategory = (slug: string) => {
    const url = slug ? `/blog?category=${slug}` : "/blog";
    window.history.replaceState(null, "", url);
  };

  return <PageShell eyebrow="Blog / From the floor" title={<>The AAAyan<br /><em className="font-light text-[#C5A059]">blog.</em></>} intro="Practical writing from a wellness equipment supplier in India — specifying, installing and running hyperbaric, cryotherapy, red light, float and PEMF rooms." breadcrumb="Blog"
    headerSlot={used.length > 1 ? <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {[["", "All articles"] as const, ...used.map((category) => [categorySlug(category), category] as const)].map(([slug, label]) => <button key={slug} onClick={() => setCategory(slug)} aria-pressed={active === slug} className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.16em] transition ${active === slug ? "border-[#4E141D] bg-[#4E141D] text-white" : "border-[#4E141D]/20 hover:border-[#4E141D]"}`}>{label}</button>)}
    </div> : null}>
    {posts === null ? <div className="py-24 text-center text-sm text-[#8b857a]">Loading articles…</div>
      : !featured ? <div className="grid gap-8 border-t border-[#4E141D]/15 pt-10 lg:grid-cols-[1fr_1fr]">
        <div><h2 className="font-serif text-4xl leading-tight">The first articles are on their way.</h2><p className="mt-4 max-w-[460px] text-sm leading-7 text-[#5f5b53]">Until then, the buying guides cover cost, installation and how to plan a recovery or wellness facility.</p></div>
        <Link href="/guides" className="inline-flex items-center gap-3 self-start justify-self-start bg-[#4E141D] px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-white hover:bg-[#C5A059] hover:text-[#3D0F17] lg:justify-self-end">Read the buying guides <ArrowRight size={14} /></Link>
      </div>
      : <>
        <Link href={`/blog/${featured.slug}`} className="group grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <Cover post={featured} className="aspect-[1.5]" />
          <div>
            <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">Latest</div>
            <Meta post={featured} />
            <h2 className="mt-4 font-serif text-[clamp(2.2rem,3.8vw,3.8rem)] leading-[.95] tracking-[-0.03em]">{featured.title}</h2>
            <p className="mt-5 max-w-[480px] text-[15px] leading-7 text-[#5f5b53]">{featured.excerpt}</p>
            <span className="mt-7 inline-flex items-center gap-3 bg-[#4E141D] px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-white transition group-hover:bg-[#C5A059] group-hover:text-[#3D0F17]">Read article <ArrowRight size={14} /></span>
          </div>
        </Link>
        {rest.length > 0 && <div className="mt-20 grid gap-x-6 gap-y-14 border-t border-[#4E141D]/15 pt-12 md:grid-cols-2 xl:grid-cols-3">{rest.map((post) => <PostCard key={post.id} post={post} />)}</div>}
      </>}
  </PageShell>;
}

export function BlogPostPage() {
  const [, params] = useRoute<{ slug: string }>("/blog/:slug");
  const [location, navigate] = useLocation();
  const slug = params?.slug ?? "";
  const initial = initialBlogData(location);
  const [post, setPost] = useState<PublicPost | null | undefined>(() => (initial?.post?.slug === slug ? initial.post : undefined));
  const preview = Boolean(initial?.preview && post?.slug === slug);
  const posts = usePosts();

  useEffect(() => {
    if (post?.slug === slug) return;
    setPost(undefined);
    fetchPost(slug)
      .then((result) => {
        if (result?.redirect) navigate(result.redirect, { replace: true });
        else setPost(result?.post ?? null);
      })
      .catch(() => setPost(null));
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (post) applySeoEntry(blogPostSeo(post, { noindex: preview }));
    else if (post === null) applySeoEntry(notFoundSeo);
  }, [post, preview]);

  if (post === null) return <NotFound />;
  if (!post) return <div className="min-h-screen bg-[#f4f1ea]"><SiteHeader /></div>;

  const products = post.relatedProducts.map((id) => catalogue.find((product) => product.id === id)).filter((product) => product !== undefined);
  const more = (posts ?? []).filter((item) => item.slug !== post.slug).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0, 3);

  // One readable column: title, picture, article, then a plain way to get in touch.
  return <div className="min-h-screen bg-[#f4f1ea] text-[#4E141D]">
    <SiteHeader />
    {preview && <div className="fixed inset-x-0 top-[73px] z-30 flex items-center justify-center gap-2 bg-[#C5A059] px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#3D0F17]"><Eye size={13} /> Preview — this post is not live. Only signed-in desk users can see it.</div>}
    <main className="px-5 pb-20 pt-28 lg:px-10">
      <article className="mx-auto max-w-[760px]">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#8a7657]"><Link href="/">Home</Link><span>/</span><Link href="/blog">Blog</Link></nav>
        <h1 className="font-serif text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.05] tracking-[-0.02em]">{post.title}</h1>
        <p className="mt-5 text-lg leading-8 text-[#5f5b53]">{post.excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[#4E141D]/15 pb-6 text-sm text-[#777067]">
          <span className="text-[#4E141D]">{post.author}</span>
          <time dateTime={post.publishAt}>{formatPostDate(post.publishAt)}</time>
          <span className="inline-flex items-center gap-1"><Clock size={13} />{readingMinutes(post.bodyHtml)} min read</span>
        </div>
        {post.coverImage && <figure className="mt-10 overflow-hidden rounded-2xl bg-[#651B26]"><img src={post.coverImage} alt={post.coverAlt} className="max-h-[520px] w-full object-cover" /></figure>}
        <Html html={post.bodyHtml} className="blog-prose mt-10 min-w-0" />

        <aside className="mt-16 rounded-2xl bg-[#4E141D] p-8 text-white">
          <h2 className="font-serif text-3xl leading-tight">Planning a room?</h2>
          <p className="mt-3 text-base leading-7 text-white/75">Tell us about your space and we will suggest the right equipment and send a quotation.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#C5A059] px-5 py-3.5 text-sm font-medium text-[#3D0F17] transition hover:bg-[#f4e9cc]">Get a quotation <ArrowRight size={15} /></Link>
            <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white/40 px-5 py-3.5 text-sm font-medium transition hover:bg-white/10">WhatsApp us</a>
          </div>
        </aside>
      </article>

      {products.length > 0 && <section className="mx-auto mt-20 max-w-[1200px]">
        <h2 className="font-serif text-3xl">Products in this article</h2>
        <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>}

      {more.length > 0 && <section className="mx-auto mt-20 max-w-[1200px]">
        <div className="flex items-end justify-between gap-4"><h2 className="font-serif text-3xl">More from the blog</h2><Link href="/blog" className="inline-flex items-center gap-2 text-sm underline decoration-[#bca477] underline-offset-4">All articles <ArrowRight size={14} /></Link></div>
        <div className="mt-8 grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">{more.map((item) => <PostCard key={item.id} post={item} />)}</div>
      </section>}
    </main>
    <SiteFooter />
  </div>;
}
