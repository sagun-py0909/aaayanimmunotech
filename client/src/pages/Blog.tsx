import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock, Eye } from "lucide-react";
import { Link, useLocation, useRoute, useSearch } from "wouter";
import { Html, PageShell, ProductCard, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { catalogue } from "@/data/site";
import { fetchPost, fetchPosts, initialBlogData } from "@/lib/blog";
import { applySeoEntry } from "@/lib/seo";
import { blogCategories, categorySlug, formatPostDate, postHeadings, readingMinutes, type PostSummary, type PublicPost } from "@shared/blog";
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

  const headings = postHeadings(post.bodyHtml);
  const products = post.relatedProducts.map((id) => catalogue.find((product) => product.id === id)).filter((product) => product !== undefined);
  const more = (posts ?? []).filter((item) => item.slug !== post.slug).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0, 3);

  return <div className="min-h-screen bg-[#f4f1ea] text-[#4E141D]">
    <SiteHeader />
    {preview && <div className="fixed inset-x-0 top-[73px] z-30 flex items-center justify-center gap-2 bg-[#C5A059] px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#3D0F17]"><Eye size={13} /> Preview — this post is not live. Only signed-in desk users can see it.</div>}
    <main>
      <article>
        <header className="px-5 pb-12 pt-28 lg:px-16">
          <div className="mx-auto max-w-[1440px]">
            <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#8a7657]"><Link href="/">Home</Link><span>/</span><Link href="/blog">Blog</Link><span>/</span><Link href={`/blog?category=${categorySlug(post.category)}`}>{post.category}</Link></nav>
            <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
              <div>
                <div className="mb-5 text-[10px] uppercase tracking-[0.28em] text-[#8C6D2F]">{post.category}</div>
                <h1 className="font-serif text-[clamp(2.6rem,5vw,5.2rem)] leading-[.93] tracking-[-0.04em]">{post.title}</h1>
              </div>
              <div className="lg:pb-2">
                <p className="max-w-[520px] text-[16px] leading-8 text-[#5f5b53]">{post.excerpt}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#4E141D]/15 pt-5 text-[10px] uppercase tracking-[0.18em] text-[#777067]">
                  <span className="text-[#4E141D]">{post.author}</span>
                  <time dateTime={post.publishAt}>{formatPostDate(post.publishAt)}</time>
                  <span className="inline-flex items-center gap-1"><Clock size={11} />{readingMinutes(post.bodyHtml)} min read</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {post.coverImage && <div className="px-5 lg:px-16"><figure className="mx-auto max-w-[1440px] overflow-hidden bg-[#651B26]"><img src={post.coverImage} alt={post.coverAlt} className="max-h-[680px] w-full object-cover" /></figure></div>}

        <div className="px-5 py-16 lg:px-16 lg:py-20">
          <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[260px_minmax(0,720px)] lg:justify-between xl:grid-cols-[300px_minmax(0,760px)_220px]">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              {headings.length > 1 && <nav aria-label="On this page" className="border-t border-[#4E141D]/15 pt-5">
                <div className="mb-4 text-[10px] uppercase tracking-[0.22em] text-[#8a7657]">On this page</div>
                <ol className="space-y-3 text-sm leading-5">{headings.map((heading) => <li key={heading.id}><a href={`#${heading.id}`} className="text-[#5f5b53] transition hover:text-[#8C6D2F]">{heading.text}</a></li>)}</ol>
              </nav>}
              <div className="mt-8 hidden bg-[#4E141D] p-6 text-white lg:block">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#C5A059]">Planning a room?</div>
                <p className="mt-3 font-serif text-2xl leading-tight">Get a site-specific quotation.</p>
                <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#f4e9cc] hover:text-white">Request a quote <ArrowRight size={13} /></Link>
              </div>
            </aside>
            <Html html={post.bodyHtml} className="blog-prose min-w-0" />
            {post.tags.length > 0 && <div className="hidden xl:block"><div className="border-t border-[#4E141D]/15 pt-5"><div className="mb-4 text-[10px] uppercase tracking-[0.22em] text-[#8a7657]">Topics</div><div className="flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="rounded-full border border-[#4E141D]/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[#5f5b53]">{tag}</span>)}</div></div></div>}
          </div>
        </div>
      </article>

      {products.length > 0 && <section className="bg-[#e9e4da] px-5 py-20 lg:px-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 flex flex-col justify-between gap-6 border-b border-[#4E141D]/15 pb-8 lg:flex-row lg:items-end"><div><div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">Mentioned in this article</div><h2 className="font-serif text-[clamp(2.2rem,3.6vw,3.8rem)] leading-[.95] tracking-[-0.03em]">The systems, <em className="font-light text-[#C5A059]">up close.</em></h2></div><Link href="/products" className="inline-flex w-fit items-center gap-2 border-b border-[#4E141D] pb-2 text-[10px] uppercase tracking-[0.18em]">Full product range <ArrowRight size={14} /></Link></div>
          <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 xl:grid-cols-3">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
        </div>
      </section>}

      <section className="relative overflow-hidden bg-[#3D0F17] px-5 py-20 text-white lg:px-16 lg:py-24">
        <div className="absolute right-[-8%] top-[-80%] h-[160%] w-[55%] rounded-full bg-[#a28457]/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <h2 className="font-serif text-[clamp(2.6rem,5vw,5rem)] leading-[.92] tracking-[-0.04em]">Specify it <em className="font-light text-[#C5A059]">properly.</em></h2>
          <div><p className="max-w-[520px] text-sm leading-7 text-white/60">Site survey, supply, installation, commissioning and operator training across India. Tell us about the space and we will quote for it.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link href="/contact" className="inline-flex items-center gap-3 bg-[#C5A059] px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-[#4E141D] transition hover:bg-[#f4e9cc]">Request a quotation <ArrowRight size={14} /></Link><Link href="/products" className="inline-flex items-center gap-3 border border-white/30 px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-white transition hover:border-white">View the range</Link></div>
          </div>
        </div>
      </section>

      {more.length > 0 && <section className="px-5 py-20 lg:px-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 flex items-end justify-between border-b border-[#4E141D]/15 pb-5"><h2 className="font-serif text-4xl">More from the blog</h2><Link href="/blog" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]">All articles <ArrowRight size={14} /></Link></div>
          <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 xl:grid-cols-3">{more.map((item) => <PostCard key={item.id} post={item} />)}</div>
        </div>
      </section>}
    </main>
    <SiteFooter />
  </div>;
}
