// The blog editor inside the lead desk (/crm?tab=blog). The owner writes HTML; the server cleans it
// on save and on every preview, so the preview pane shows exactly what the public page will.
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type ClipboardEvent, type DragEvent, type KeyboardEvent, type ReactNode } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, Bold, CalendarClock, Check, Code2, Columns2, ExternalLink, Eye, FileText, Heading2, Heading3, ImagePlus, Images, Italic, Link2, List, ListOrdered, Loader2, Package, Pilcrow, Plus, Quote, Radio, Search, Table2, Trash2, Upload as UploadIcon, Video, X } from "lucide-react";
import { toast } from "sonner";
import { catalogue } from "@/data/site";
import { deskApi, uploadImage, type DeskPost, type Upload } from "@/lib/blog";
import { blogCategories, formatPostDate, postChecks, postState, slugify, slugPattern, wordCount, type BlogCategory, type PostState } from "@shared/blog";

type Form = {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  bodyHtml: string;
  coverImage: string;
  coverAlt: string;
  category: BlogCategory;
  tags: string[];
  relatedProducts: string[];
  author: string;
  status: "draft" | "published";
  publishAt: string | null;
};

const emptyForm: Form = { title: "", slug: "", metaTitle: "", metaDescription: "", excerpt: "", bodyHtml: "", coverImage: "", coverAlt: "", category: "Buying guides", tags: [], relatedProducts: [], author: "AAAyan Immunotech", status: "draft", publishAt: null };

const formOf = (post: DeskPost): Form => ({ title: post.title, slug: post.slug, metaTitle: post.metaTitle, metaDescription: post.metaDescription, excerpt: post.excerpt, bodyHtml: post.bodyHtml, coverImage: post.coverImage, coverAlt: post.coverAlt, category: post.category, tags: post.tags, relatedProducts: post.relatedProducts, author: post.author, status: post.status, publishAt: post.publishAt });

const stateStyles: Record<PostState, string> = {
  draft: "bg-[#e8e2d4] text-[#6f6a61]",
  scheduled: "bg-[#f4e9cc] text-[#7a6134]",
  live: "bg-[#e4e9e0] text-[#4d7547]",
};
const stateLabels: Record<PostState, string> = { draft: "Draft", scheduled: "Scheduled", live: "Live" };

const StateBadge = ({ state }: { state: PostState }) => <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] ${stateStyles[state]}`}>{state === "live" && <Radio size={10} />}{state === "scheduled" && <CalendarClock size={10} />}{stateLabels[state]}</span>;

// <input type="datetime-local"> works in the browser's local time; the store keeps ISO (UTC).
const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};
const fromLocalInput = (value: string) => (value ? new Date(value).toISOString() : null);
const formatDateTime = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const formatSize = (bytes: number) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`);
const escapeAttr = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const imageFigure = (upload: Pick<Upload, "url" | "width" | "height">, alt: string, caption: string) =>
  `<figure>\n  <img src="${upload.url}" alt="${escapeAttr(alt)}"${upload.width ? ` width="${upload.width}" height="${upload.height}"` : ""} />${caption ? `\n  <figcaption>${escapeAttr(caption)}</figcaption>` : ""}\n</figure>\n`;

export default function BlogDesk({ openId, onOpen }: { openId: string | null; onOpen: (id: string | null) => void }) {
  const [posts, setPosts] = useState<DeskPost[] | null>(null);

  const reload = useCallback(() => deskApi.posts().then(setPosts).catch((error: Error) => { toast.error(error.message); setPosts([]); }), []);
  useEffect(() => { void reload(); }, [reload]);

  if (!posts) return <div className="py-24 text-center text-sm text-[#8b857a]">Loading the blog…</div>;
  if (openId) {
    const post = openId === "new" ? null : posts.find((item) => String(item.id) === openId);
    if (openId !== "new" && !post) return <div className="py-24 text-center text-sm text-[#8b857a]">That post no longer exists. <button className="underline" onClick={() => onOpen(null)}>Back to posts</button></div>;
    return <Editor key={openId} post={post ?? null} posts={posts} onClose={() => onOpen(null)}
      onSaved={(saved) => { setPosts((current) => [saved, ...(current ?? []).filter((item) => item.id !== saved.id)]); if (openId === "new") onOpen(String(saved.id)); }}
      onDeleted={(id) => { setPosts((current) => (current ?? []).filter((item) => item.id !== id)); onOpen(null); }} />;
  }
  return <PostList posts={posts} onOpen={onOpen} />;
}

// ---- The list ---------------------------------------------------------------------------------

function PostList({ posts, onOpen }: { posts: DeskPost[]; onOpen: (id: string) => void }) {
  const [filter, setFilter] = useState<"all" | PostState>("all");
  const [query, setQuery] = useState("");
  const now = Date.now();
  const withState = posts.map((post) => ({ ...post, state: postState(post, now) }));
  const counts = { all: posts.length, draft: 0, scheduled: 0, live: 0 } as Record<"all" | PostState, number>;
  for (const post of withState) counts[post.state] += 1;
  const visible = withState
    .filter((post) => (filter === "all" || post.state === filter) && `${post.title} ${post.slug} ${post.category} ${post.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const upcoming = withState.filter((post) => post.state === "scheduled").sort((a, b) => a.publishAt!.localeCompare(b.publishAt!))[0];

  return <>
    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div>
        <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#8C6D2F]">Content / Blog</div>
        <h1 className="font-serif text-[clamp(3rem,5vw,5.8rem)] leading-[.88] tracking-[-0.04em]">The blog <em className="font-light">desk.</em></h1>
        <p className="mt-5 max-w-[560px] text-sm leading-6 text-[#706b61]">Write in HTML, check the search preview, and publish now or on a schedule. Everything lives at <span className="text-[#4E141D]">/blog</span>.</p>
      </div>
      <button onClick={() => onOpen("new")} className="inline-flex items-center justify-center gap-2 self-start bg-[#4E141D] px-5 py-3.5 text-[10px] uppercase tracking-[0.17em] text-white transition hover:bg-[#C5A059] hover:text-[#3D0F17] lg:self-end"><Plus size={15} /> New post</button>
    </div>

    <section className="mt-10 grid grid-cols-2 gap-3 xl:grid-cols-4">
      <Tile label="Live" value={counts.live} detail="Visible on /blog and in the sitemap" />
      <Tile label="Scheduled" value={counts.scheduled} detail={upcoming ? `Next: ${formatDateTime(upcoming.publishAt!)}` : "Nothing queued"} />
      <Tile label="Drafts" value={counts.draft} detail="Only visible here" />
      <Tile label="Words published" value={withState.filter((post) => post.state === "live").reduce((total, post) => total + wordCount(post.bodyHtml), 0).toLocaleString("en-IN")} detail="Across live articles" />
    </section>

    <div className="mt-10 flex flex-col gap-3 border-y border-[#4E141D]/12 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter posts">
        {(["all", "draft", "scheduled", "live"] as const).map((key) => <button key={key} onClick={() => setFilter(key)} aria-pressed={filter === key} className={`rounded-full border px-3.5 py-1.5 text-[10px] uppercase tracking-[0.14em] transition ${filter === key ? "border-[#4E141D] bg-[#4E141D] text-white" : "border-[#4E141D]/20 hover:border-[#4E141D]"}`}>{key === "all" ? "All" : key === "draft" ? "Drafts" : stateLabels[key]} <span className="opacity-60">{counts[key]}</span></button>)}
      </div>
      <div className="flex items-center gap-2 border-b border-[#4E141D]/20 pb-2 text-sm sm:w-[300px]">
        <Search size={15} className="text-[#C5A059]" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search posts…" aria-label="Search posts" className="w-full bg-transparent outline-none placeholder:text-[#aaa399]" />
      </div>
    </div>

    {!posts.length ? <div className="mt-10 grid place-items-center border border-dashed border-[#4E141D]/20 px-6 py-20 text-center">
      <FileText size={28} className="text-[#C5A059]" />
      <h2 className="mt-5 font-serif text-3xl">No posts yet.</h2>
      <p className="mt-3 max-w-[420px] text-sm leading-6 text-[#706b61]">Start with a question buyers ask you every week — that is usually the article people search for.</p>
      <button onClick={() => onOpen("new")} className="mt-7 inline-flex items-center gap-2 bg-[#4E141D] px-5 py-3.5 text-[10px] uppercase tracking-[0.17em] text-white hover:bg-[#C5A059] hover:text-[#3D0F17]"><Plus size={15} /> Write the first post</button>
    </div> : <div className="mt-4 divide-y divide-[#4E141D]/10">
      {visible.map((post) => <div key={post.id} className="grid gap-4 py-4 sm:grid-cols-[112px_1fr_auto] sm:items-center">
        <button onClick={() => onOpen(String(post.id))} className="hidden aspect-[1.4] overflow-hidden bg-[#651B26] sm:block" aria-label={`Edit ${post.title}`}>{post.coverImage ? <img src={post.coverImage} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-[10px] tracking-[0.2em] text-[#C5A059]/50">AA</span>}</button>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2"><StateBadge state={post.state} /><span className="text-[9px] uppercase tracking-[0.16em] text-[#8C6D2F]">{post.category}</span></div>
          <button onClick={() => onOpen(String(post.id))} className="mt-2 block max-w-full text-left font-serif text-2xl line-clamp-2 sm:truncate sm:line-clamp-none leading-tight hover:text-[#8C6D2F]">{post.title}</button>
          <div className="mt-1 truncate text-xs text-[#8b857a]">/blog/{post.slug} · {post.state === "live" ? `Live since ${formatPostDate(post.publishAt!)}` : post.state === "scheduled" ? `Goes live ${formatDateTime(post.publishAt!)}` : `Edited ${formatDateTime(post.updatedAt)}`} · {wordCount(post.bodyHtml).toLocaleString("en-IN")} words</div>
        </div>
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.15em]">
          <a href={`/blog/${post.slug}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-[#777067] hover:text-[#4E141D]">{post.state === "live" ? "View" : "Preview"} <ExternalLink size={12} /></a>
          <button onClick={() => onOpen(String(post.id))} className="inline-flex items-center gap-1.5 hover:text-[#8C6D2F]">Edit <ArrowRight size={13} /></button>
        </div>
      </div>)}
      {!visible.length && <div className="py-16 text-center text-sm text-[#8b857a]">No posts match.</div>}
    </div>}
  </>;
}

const Tile = ({ label, value, detail }: { label: string; value: number | string; detail: string }) => <div className="border-t border-[#4E141D]/15 bg-white/35 px-4 py-5">
  <div className="text-[10px] uppercase tracking-[0.18em] text-[#777167]">{label}</div>
  <div className="mt-5 font-serif text-3xl">{value}</div>
  <div className="mt-1 truncate text-[11px] text-[#8d877d]">{detail}</div>
</div>;

// ---- The editor -------------------------------------------------------------------------------

function Editor({ post, posts, onClose, onSaved, onDeleted }: { post: DeskPost | null; posts: DeskPost[]; onClose: () => void; onSaved: (post: DeskPost) => void; onDeleted: (id: number) => void }) {
  const [form, setForm] = useState<Form>(() => (post ? formOf(post) : emptyForm));
  const [saved, setSaved] = useState<Form>(() => (post ? formOf(post) : emptyForm));
  const [current, setCurrent] = useState<DeskPost | null>(post);
  // New posts follow the title until the slug is edited; once a post has been saved its URL is deliberate.
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"write" | "split" | "preview">("split");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewing, setPreviewing] = useState(false);
  const [library, setLibrary] = useState<null | "cover" | "body">(null);
  const [uploading, setUploading] = useState(0);
  const [when, setWhen] = useState<"now" | "later">(() => (post && postState(post) === "scheduled" ? "later" : "now"));
  const [scheduleAt, setScheduleAt] = useState(() => toLocalInput(post?.publishAt && Date.parse(post.publishAt) > Date.now() ? post.publishAt : new Date(Date.now() + 24 * 3600_000).toISOString()));
  const textarea = useRef<HTMLTextAreaElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);

  const state: PostState = current ? postState(current) : "draft";
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((value0) => ({ ...value0, [key]: value }));

  const setTitle = (title: string) => setForm((value) => ({ ...value, title, slug: slugTouched ? value.slug : slugify(title) }));

  // Warn before leaving with unsaved work.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Live preview, cleaned by the server exactly as a save would be.
  useEffect(() => {
    if (view === "write") return;
    setPreviewing(true);
    const timer = window.setTimeout(() => {
      deskApi.preview(form.bodyHtml).then(setPreviewHtml).catch(() => undefined).finally(() => setPreviewing(false));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [form.bodyHtml, view]);

  const save = async (intent: "draft" | "publish" | "keep" | "unpublish") => {
    if (!form.title.trim()) return toast.error("Give the post a title first.");
    const slug = form.slug || slugify(form.title);
    if (!slugPattern.test(slug)) return toast.error("The URL slug can only use lowercase letters, numbers and hyphens.");
    if (posts.some((item) => item.slug === slug && item.id !== current?.id)) return toast.error("Another post already uses that URL slug.");

    let status = form.status;
    let publishAt = form.publishAt;
    if (intent === "draft" || intent === "unpublish") status = "draft";
    if (intent === "publish") {
      status = "published";
      if (when === "later") {
        publishAt = fromLocalInput(scheduleAt);
        if (!publishAt || Date.parse(publishAt) <= Date.now()) return toast.error("Pick a publish time in the future, or choose Publish now.");
      } else if (state !== "live") publishAt = new Date().toISOString();
    }
    if (status === "published") {
      if (!form.excerpt.trim()) return toast.error("Add an excerpt before publishing — it shows on /blog and in Google.");
      if (!form.bodyHtml.trim()) return toast.error("The article body is empty.");
    }

    const payload = { ...form, slug, status, publishAt };
    setSaving(true);
    try {
      const result = current ? await deskApi.update(current.id, payload) : await deskApi.create(payload);
      const next = formOf(result);
      setCurrent(result);
      setForm(next);
      setSaved(next);
      setSlugTouched(true);
      onSaved(result);
      const nextState = postState(result);
      toast.success(intent === "unpublish" ? "Unpublished — the post is a draft again." : nextState === "live" ? (state === "live" ? "Live post updated." : "Published. It is live at /blog.") : nextState === "scheduled" ? `Scheduled for ${formatDateTime(result.publishAt!)}.` : "Draft saved.");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Ctrl/Cmd+S saves without changing whether the post is live.
  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") { event.preventDefault(); void saveRef.current(state === "draft" ? "draft" : "keep"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state]);

  const remove = async () => {
    if (!current) return onClose();
    if (!window.confirm(`Delete “${current.title}” permanently?${state === "live" ? " It is live — its URL will start returning 404." : ""}`)) return;
    try {
      await deskApi.remove(current.id);
      toast.success("Post deleted.");
      onDeleted(current.id);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const close = () => { if (!dirty || window.confirm("Leave without saving your changes?")) onClose(); };

  // ---- HTML editing helpers ----
  const insert = (before: string, after = "", placeholder = "") => {
    const element = textarea.current;
    if (!element) return setForm((value) => ({ ...value, bodyHtml: value.bodyHtml + before + placeholder + after }));
    const { selectionStart: start, selectionEnd: end, value } = element;
    const selected = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    set("bodyHtml", next);
    requestAnimationFrame(() => {
      element.focus();
      element.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  const tools: { icon: typeof Bold; label: string; run: () => void }[] = [
    { icon: Heading2, label: "Heading (h2)", run: () => insert("<h2>", "</h2>\n", "Section heading") },
    { icon: Heading3, label: "Subheading (h3)", run: () => insert("<h3>", "</h3>\n", "Subheading") },
    { icon: Pilcrow, label: "Paragraph", run: () => insert("<p>", "</p>\n", "Paragraph text") },
    { icon: Bold, label: "Bold", run: () => insert("<strong>", "</strong>", "bold text") },
    { icon: Italic, label: "Italic", run: () => insert("<em>", "</em>", "italic text") },
    { icon: Link2, label: "Link", run: () => { const href = window.prompt("Link to (a /page on this site, or https://…)", "/products/"); if (href) insert(`<a href="${escapeAttr(href)}">`, "</a>", "link text"); } },
    { icon: List, label: "Bulleted list", run: () => insert("<ul>\n  <li>", "</li>\n  <li>Second point</li>\n</ul>\n", "First point") },
    { icon: ListOrdered, label: "Numbered list", run: () => insert("<ol>\n  <li>", "</li>\n  <li>Second step</li>\n</ol>\n", "First step") },
    { icon: Quote, label: "Pull quote", run: () => insert("<blockquote>", "</blockquote>\n", "A line worth pulling out") },
    { icon: Table2, label: "Table", run: () => insert("<table>\n  <thead><tr><th>Item</th><th>Detail</th></tr></thead>\n  <tbody>\n    <tr><td>", "</td><td>…</td></tr>\n  </tbody>\n</table>\n", "Row") },
    { icon: ImagePlus, label: "Image", run: () => setLibrary("body") },
    { icon: Video, label: "YouTube video", run: () => {
      const url = window.prompt("YouTube link");
      const id = url?.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)?.[1];
      if (url && !id) return toast.error("That does not look like a YouTube link.");
      if (id) insert(`<iframe src="https://www.youtube-nocookie.com/embed/${id}" title="Video" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe>\n`);
    } },
  ];

  const onEditorKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Tab" && !event.shiftKey) { event.preventDefault(); insert("  "); }
  };

  const uploadFiles = async (files: File[], place: "cover" | "body") => {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (!images.length) return;
    setUploading((count) => count + images.length);
    for (const file of images) {
      try {
        const upload = await uploadImage(file);
        if (place === "cover") setForm((value) => ({ ...value, coverImage: upload.url }));
        else insert(imageFigure(upload, "", ""));
        toast.success(place === "cover" ? "Cover image uploaded." : "Image inserted — add its alt text.");
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setUploading((count) => count - 1);
      }
    }
  };

  const onPaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const files = Array.from(event.clipboardData.files);
    if (files.some((file) => file.type.startsWith("image/"))) { event.preventDefault(); void uploadFiles(files, "body"); }
  };
  const onDrop = (event: DragEvent<HTMLTextAreaElement>) => {
    const files = Array.from(event.dataTransfer.files);
    if (files.length) { event.preventDefault(); void uploadFiles(files, "body"); }
  };

  const checks = useMemo(() => postChecks({ ...form, slug: form.slug || slugify(form.title) }), [form]);
  const passed = checks.filter((check) => check.ok).length;
  const words = wordCount(form.bodyHtml);
  const displayTitle = form.metaTitle || `${form.title || "Post title"} | AAAyan Immunotech`;
  const displayDescription = form.metaDescription || form.excerpt || "Add an excerpt or meta description — this is the text Google shows under the title.";
  const slugChanged = current && current.status === "published" && form.slug !== current.slug;

  const primaryLabel = when === "later" ? (state === "scheduled" ? "Update schedule" : "Schedule") : state === "live" ? "Update live post" : "Publish now";

  return <>
    <div className="sticky top-0 z-20 -mx-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#4E141D]/12 bg-[#f4f1ea]/95 px-5 py-3 backdrop-blur lg:-mx-10 lg:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={close} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[#777067] hover:text-[#4E141D]"><ArrowLeft size={14} /> Posts</button>
        <span className="h-4 w-px bg-[#4E141D]/15" />
        <StateBadge state={state} />
        <span className="truncate text-xs text-[#8b857a]">{saving ? "Saving…" : dirty ? "Unsaved changes" : current ? `Saved ${formatDateTime(current.updatedAt)}` : "Not saved yet"}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {current && <a href={`/blog/${current.slug}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 px-3 py-2.5 text-[10px] uppercase tracking-[0.15em] text-[#777067] hover:text-[#4E141D]" title={dirty ? "Shows the last saved version" : undefined}>{state === "live" ? "View live" : "Preview on site"} <ExternalLink size={12} /></a>}
        {state === "draft" ? <button disabled={saving} onClick={() => save("draft")} className="border border-[#4E141D]/25 px-4 py-2.5 text-[10px] uppercase tracking-[0.15em] hover:border-[#4E141D] disabled:opacity-50">Save draft</button>
          : <button disabled={saving} onClick={() => save("unpublish")} className="border border-[#4E141D]/25 px-4 py-2.5 text-[10px] uppercase tracking-[0.15em] hover:border-[#4E141D] disabled:opacity-50">Unpublish</button>}
        <button disabled={saving} onClick={() => save("publish")} className="inline-flex items-center gap-2 bg-[#4E141D] px-4 py-2.5 text-[10px] uppercase tracking-[0.15em] text-white hover:bg-[#C5A059] hover:text-[#3D0F17] disabled:opacity-50">{saving ? <Loader2 size={13} className="animate-spin" /> : when === "later" ? <CalendarClock size={13} /> : <Radio size={13} />}{primaryLabel}</button>
      </div>
    </div>

    <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0">
        <textarea value={form.title} onChange={(event) => setTitle(event.target.value.replace(/\n/g, ""))} rows={1} placeholder="Post title" aria-label="Post title" className="field-sizing-content w-full resize-none bg-transparent font-serif text-[clamp(2.2rem,4vw,3.8rem)] leading-[1] tracking-[-0.03em] outline-none placeholder:text-[#4E141D]/25" />
        <div className="mt-3 flex flex-wrap items-center gap-1 text-sm text-[#8b857a]">
          <span>aaayanimmunotech.co.in/blog/</span>
          <input value={form.slug} onChange={(event) => { setSlugTouched(true); set("slug", slugify(event.target.value) + (event.target.value.endsWith("-") ? "-" : "")); }} onBlur={() => set("slug", slugify(form.slug))} placeholder="url-slug" aria-label="URL slug" className="min-w-[200px] flex-1 border-b border-dashed border-[#4E141D]/25 bg-transparent py-1 text-[#4E141D] outline-none focus:border-[#C5A059]" />
        </div>
        {slugChanged && <p className="mt-2 text-xs text-[#8C6D2F]">The old URL /blog/{current!.slug} will 301 to the new one, so links and rankings carry over.</p>}

        <label className="mt-7 block text-[9px] uppercase tracking-[0.16em] text-[#6f6a61]">Excerpt <span className="normal-case tracking-normal text-[#aaa399]">— the standfirst under the title, and the listing text on /blog</span>
          <textarea value={form.excerpt} onChange={(event) => set("excerpt", event.target.value)} maxLength={400} placeholder="One or two sentences that tell the reader what they will get." className="mt-2 min-h-[84px] w-full border border-[#4E141D]/15 bg-white/40 p-3 text-[15px] normal-case leading-6 tracking-normal outline-none focus:border-[#C5A059]" />
        </label>

        <div className="mt-7 border border-[#4E141D]/15 bg-white/40">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#4E141D]/12 px-2 py-1.5">
            <div className="flex flex-wrap items-center">{tools.map((tool) => <button key={tool.label} type="button" onClick={tool.run} title={tool.label} aria-label={tool.label} className="rounded p-2 text-[#5f5b53] hover:bg-[#4E141D]/5 hover:text-[#4E141D]"><tool.icon size={16} /></button>)}
              <ProductLinkMenu onPick={(product) => insert(`<a href="/products/${product.id}">`, "</a>", product.name)} />
              {uploading > 0 && <span className="ml-2 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-[#8C6D2F]"><Loader2 size={12} className="animate-spin" /> Uploading {uploading}</span>}
            </div>
            <div className="flex items-center rounded-full border border-[#4E141D]/15 p-0.5" role="group" aria-label="Editor view">
              {([["write", Code2, "HTML"], ["split", Columns2, "Split"], ["preview", Eye, "Preview"]] as const).map(([key, Icon, label]) => <button key={key} onClick={() => setView(key)} aria-pressed={view === key} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] ${view === key ? "bg-[#4E141D] text-white" : "text-[#6f6a61] hover:text-[#4E141D]"} ${key === "split" ? "hidden lg:inline-flex" : ""}`}><Icon size={12} />{label}</button>)}
            </div>
          </div>
          <div className={`grid ${view === "split" ? "lg:grid-cols-2" : ""}`}>
            {view !== "preview" && <textarea ref={textarea} value={form.bodyHtml} onChange={(event) => set("bodyHtml", event.target.value)} onKeyDown={onEditorKey} onPaste={onPaste} onDrop={onDrop} spellCheck={false} aria-label="Article HTML"
              placeholder={"<p>Start with the question the reader searched for, and answer it.</p>\n\n<h2>A section heading</h2>\n<p>…</p>\n\nPaste or drop images here to upload them."}
              className={`min-h-[640px] w-full resize-y bg-[#fbfaf7] p-5 font-mono text-[13px] leading-6 text-[#3D0F17] outline-none placeholder:text-[#aaa399] ${view === "split" ? "hidden lg:block lg:border-r lg:border-[#4E141D]/12" : ""}`} />}
            {view === "split" && <div className="p-5 text-xs text-[#8b857a] lg:hidden">Switch to HTML or Preview on smaller screens.</div>}
            {view !== "write" && <div className={`relative max-h-[900px] min-h-[640px] overflow-y-auto bg-[#f4f1ea] p-6 sm:p-8 ${view === "split" ? "hidden lg:block" : ""}`}>
              {previewing && <Loader2 size={14} className="absolute right-4 top-4 animate-spin text-[#C5A059]" />}
              <div className="mb-3 text-[9px] uppercase tracking-[0.2em] text-[#8C6D2F]">{form.category}</div>
              <h1 className="font-serif text-4xl leading-[1] tracking-[-0.03em]">{form.title || "Post title"}</h1>
              {form.excerpt && <p className="mt-4 text-[15px] leading-7 text-[#5f5b53]">{form.excerpt}</p>}
              {form.coverImage && <img src={form.coverImage} alt={form.coverAlt} className="mt-6 w-full bg-[#651B26] object-cover" />}
              <div className="blog-prose mt-8 [&_a]:pointer-events-none" dangerouslySetInnerHTML={{ __html: previewHtml || '<p style="opacity:.5">The preview appears here as you type.</p>' }} />
            </div>}
          </div>
          <div className="flex flex-wrap justify-between gap-2 border-t border-[#4E141D]/12 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-[#8b857a]">
            <span>{words.toLocaleString("en-IN")} words · {Math.max(1, Math.round(words / 220))} min read</span>
            <span>Ctrl+S saves · scripts and styles are removed on save</span>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <Card title="Publishing" icon={Radio}>
          <div className="grid grid-cols-2 gap-2">
            {(["now", "later"] as const).map((key) => <button key={key} onClick={() => setWhen(key)} aria-pressed={when === key} className={`border px-3 py-2.5 text-left text-xs ${when === key ? "border-[#4E141D] bg-[#4E141D] text-white" : "border-[#4E141D]/15 hover:border-[#4E141D]/40"}`}>{key === "now" ? (state === "live" ? "Keep live" : "Publish now") : "Schedule"}</button>)}
          </div>
          {when === "later" && <label className="mt-3 block text-[9px] uppercase tracking-[0.16em] text-[#6f6a61]">Goes live at <span className="normal-case tracking-normal text-[#aaa399]">(your local time)</span>
            <input type="datetime-local" value={scheduleAt} min={toLocalInput(new Date().toISOString())} onChange={(event) => setScheduleAt(event.target.value)} className="mt-2 w-full border border-[#4E141D]/15 bg-white/60 px-3 py-2.5 text-sm normal-case tracking-normal outline-none focus:border-[#C5A059]" />
          </label>}
          <p className="mt-3 text-xs leading-5 text-[#777067]">
            {state === "live" && current?.publishAt ? `Live since ${formatDateTime(current.publishAt)}.` : state === "scheduled" && current?.publishAt ? `Scheduled for ${formatDateTime(current.publishAt)}. It appears on /blog, in the sitemap and in the RSS feed at that time — nothing else to do.` : "Drafts are only visible here and to signed-in desk users on the preview link."}
          </p>
          {current && <button onClick={remove} className="mt-4 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-[#8d4550] hover:text-[#4E141D]"><Trash2 size={12} /> Delete post</button>}
        </Card>

        <Card title="Cover image" icon={Images}>
          <div className="relative aspect-[1.6] overflow-hidden bg-[#651B26]">
            {form.coverImage ? <img src={form.coverImage} alt={form.coverAlt} className="h-full w-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#f4e9cc]/60"><ImagePlus size={20} />No cover yet</div>}
            {form.coverImage && <button onClick={() => set("coverImage", "")} aria-label="Remove cover" className="absolute right-2 top-2 rounded-full bg-[#3D0F17]/70 p-1.5 text-white hover:bg-[#3D0F17]"><X size={13} /></button>}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={() => coverInput.current?.click()} className="inline-flex items-center justify-center gap-1.5 border border-[#4E141D]/20 px-3 py-2.5 text-[10px] uppercase tracking-[0.14em] hover:border-[#4E141D]"><UploadIcon size={12} /> Upload</button>
            <button onClick={() => setLibrary("cover")} className="inline-flex items-center justify-center gap-1.5 border border-[#4E141D]/20 px-3 py-2.5 text-[10px] uppercase tracking-[0.14em] hover:border-[#4E141D]"><Images size={12} /> Library</button>
          </div>
          <input ref={coverInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" hidden onChange={(event: ChangeEvent<HTMLInputElement>) => { void uploadFiles(Array.from(event.target.files ?? []), "cover"); event.target.value = ""; }} />
          <Field label="Alt text" value={form.coverAlt} onChange={(value) => set("coverAlt", value)} placeholder="What the image shows, for Google and screen readers" />
          <Field label="Or image URL" value={form.coverImage} onChange={(value) => set("coverImage", value)} placeholder="/images/… or https://…" />
        </Card>

        <Card title="Search appearance" icon={Search}>
          <div className="rounded border border-[#4E141D]/10 bg-white p-4">
            <div className="truncate text-[12px] text-[#4d5156]">aaayanimmunotech.co.in › blog › {form.slug || "url-slug"}</div>
            <div className="mt-1 line-clamp-2 text-[18px] leading-6 text-[#1a0dab]">{displayTitle}</div>
            <div className="mt-1 line-clamp-2 text-[13px] leading-5 text-[#4d5156]">{displayDescription}</div>
          </div>
          <Field label="Search title" value={form.metaTitle} onChange={(value) => set("metaTitle", value)} placeholder={`${form.title || "Post title"} | AAAyan Immunotech`} counter={[displayTitle.length, 60]} />
          <Field label="Meta description" value={form.metaDescription} onChange={(value) => set("metaDescription", value)} placeholder="Defaults to the excerpt" counter={[(form.metaDescription || form.excerpt).length, 160]} multiline />
        </Card>

        <Card title={`Checks · ${passed}/${checks.length}`} icon={Check}>
          <ul className="space-y-2.5">{checks.map((check) => <li key={check.label} className="flex gap-2.5 text-xs leading-5">
            {check.ok ? <Check size={14} className="mt-0.5 shrink-0 text-[#4d7547]" /> : <AlertTriangle size={14} className={`mt-0.5 shrink-0 ${check.severity === "rule" ? "text-[#8d4550]" : "text-[#C5A059]"}`} />}
            <span><span className={check.ok ? "text-[#5f5b53]" : check.severity === "rule" ? "font-medium text-[#8d4550]" : "text-[#4E141D]"}>{check.label}</span>{!check.ok && check.hint && <span className="block text-[#8b857a]">{check.hint}</span>}</span>
          </li>)}</ul>
        </Card>

        <Card title="Organise" icon={Package}>
          <label className="block text-[9px] uppercase tracking-[0.16em] text-[#6f6a61]">Category
            <select value={form.category} onChange={(event) => set("category", event.target.value as BlogCategory)} className="mt-2 w-full border border-[#4E141D]/15 bg-white/60 px-3 py-2.5 text-sm normal-case tracking-normal outline-none focus:border-[#C5A059]">{blogCategories.map((category) => <option key={category}>{category}</option>)}</select>
          </label>
          <TagInput tags={form.tags} onChange={(tags) => set("tags", tags)} />
          <Field label="Author" value={form.author} onChange={(value) => set("author", value)} placeholder="AAAyan Immunotech" />
          <div className="mt-4 text-[9px] uppercase tracking-[0.16em] text-[#6f6a61]">Related products <span className="normal-case tracking-normal text-[#aaa399]">— shown under the article (up to 4)</span></div>
          <div className="mt-2 space-y-1.5">{catalogue.map((product) => {
            const checked = form.relatedProducts.includes(product.id);
            return <label key={product.id} className={`flex cursor-pointer items-center gap-2.5 text-xs ${!checked && form.relatedProducts.length >= 4 ? "opacity-40" : ""}`}>
              <input type="checkbox" checked={checked} disabled={!checked && form.relatedProducts.length >= 4} onChange={() => set("relatedProducts", checked ? form.relatedProducts.filter((id) => id !== product.id) : [...form.relatedProducts, product.id])} className="accent-[#4E141D]" />
              {product.name}
            </label>;
          })}</div>
        </Card>
      </aside>
    </div>

    {library && <MediaLibrary mode={library} onClose={() => setLibrary(null)} onPick={(upload, alt, caption) => {
      if (library === "cover") setForm((value) => ({ ...value, coverImage: upload.url, coverAlt: value.coverAlt || alt }));
      else insert(imageFigure(upload, alt, caption));
      setLibrary(null);
    }} />}
  </>;
}

function Card({ title, icon: Icon, children }: { title: string; icon: typeof Bold; children: ReactNode }) {
  return <section className="border border-[#4E141D]/12 bg-white/45 p-5">
    <h2 className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8C6D2F]"><Icon size={13} />{title}</h2>
    {children}
  </section>;
}

function Field({ label, value, onChange, placeholder, counter, multiline = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; counter?: [number, number]; multiline?: boolean }) {
  const className = "mt-2 w-full border border-[#4E141D]/15 bg-white/60 px-3 py-2.5 text-sm normal-case tracking-normal outline-none placeholder:text-[#aaa399] focus:border-[#C5A059]";
  return <label className="mt-4 block text-[9px] uppercase tracking-[0.16em] text-[#6f6a61]">
    <span className="flex justify-between">{label}{counter && <span className={counter[0] > counter[1] ? "text-[#8d4550]" : "text-[#aaa399]"}>{counter[0]} / {counter[1]}</span>}</span>
    {multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={3} className={`${className} resize-y leading-5`} /> : <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={className} />}
  </label>;
}

function TagInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const next = draft.split(",").map((tag) => tag.trim()).filter(Boolean);
    if (next.length) onChange(Array.from(new Set([...tags, ...next])).slice(0, 12));
    setDraft("");
  };
  return <label className="mt-4 block text-[9px] uppercase tracking-[0.16em] text-[#6f6a61]">Tags
    <div className="mt-2 flex flex-wrap items-center gap-1.5 border border-[#4E141D]/15 bg-white/60 px-2 py-2 focus-within:border-[#C5A059]">
      {tags.map((tag) => <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[#e9e4da] px-2.5 py-1 text-[11px] normal-case tracking-normal">{tag}<button type="button" onClick={() => onChange(tags.filter((item) => item !== tag))} aria-label={`Remove ${tag}`}><X size={11} /></button></span>)}
      <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === ",") { event.preventDefault(); add(); } else if (event.key === "Backspace" && !draft && tags.length) onChange(tags.slice(0, -1)); }} onBlur={add} placeholder={tags.length ? "" : "hbot, installation…"} className="min-w-[90px] flex-1 bg-transparent px-1 py-0.5 text-sm normal-case tracking-normal outline-none placeholder:text-[#aaa399]" />
    </div>
  </label>;
}

function ProductLinkMenu({ onPick }: { onPick: (product: (typeof catalogue)[number]) => void }) {
  const [open, setOpen] = useState(false);
  return <div className="relative">
    <button type="button" onClick={() => setOpen((value) => !value)} title="Link to a product" aria-label="Link to a product" aria-expanded={open} className="rounded p-2 text-[#5f5b53] hover:bg-[#4E141D]/5 hover:text-[#4E141D]"><Package size={16} /></button>
    {open && <div className="absolute left-0 top-full z-30 mt-1 w-[280px] border border-[#4E141D]/15 bg-[#fbfaf7] p-1 shadow-xl shadow-[#2E0A10]/10">
      <div className="px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-[#8C6D2F]">Link to a product page</div>
      {catalogue.map((product) => <button key={product.id} type="button" onClick={() => { onPick(product); setOpen(false); }} className="block w-full px-3 py-2 text-left text-xs hover:bg-[#4E141D]/5">{product.name}</button>)}
    </div>}
  </div>;
}

// ---- Media library ----------------------------------------------------------------------------

function MediaLibrary({ mode, onClose, onPick }: { mode: "cover" | "body"; onClose: () => void; onPick: (upload: Upload, alt: string, caption: string) => void }) {
  const [uploads, setUploads] = useState<Upload[] | null>(null);
  const [selected, setSelected] = useState<Upload | null>(null);
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => { deskApi.uploads().then(setUploads).catch((error: Error) => { toast.error(error.message); setUploads([]); }); }, []);
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const upload = async (files: File[]) => {
    setBusy((count) => count + files.length);
    for (const file of files) {
      try {
        const created = await uploadImage(file);
        setUploads((current) => [created, ...(current ?? [])]);
        setSelected(created);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setBusy((count) => count - 1);
      }
    }
  };

  const remove = async (item: Upload) => {
    if (!window.confirm(`Delete ${item.name}? This cannot be undone.`)) return;
    try {
      await deskApi.removeUpload(item.name);
      setUploads((current) => (current ?? []).filter((entry) => entry.name !== item.name));
      if (selected?.name === item.name) setSelected(null);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  // Dimensions let the page reserve space for the image before it loads.
  const pick = () => {
    if (!selected) return;
    if (selected.width) return onPick(selected, alt.trim(), caption.trim());
    const image = new Image();
    image.onload = () => onPick({ ...selected, width: image.naturalWidth, height: image.naturalHeight }, alt.trim(), caption.trim());
    image.onerror = () => onPick(selected, alt.trim(), caption.trim());
    image.src = selected.url;
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2E0A10]/60 p-4 backdrop-blur-sm" onClick={onClose}>
    <div role="dialog" aria-modal="true" aria-label="Image library" onClick={(event) => event.stopPropagation()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void upload(Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith("image/"))); }}
      className="flex max-h-[90vh] w-full max-w-[1000px] flex-col bg-[#f4f1ea] shadow-2xl">
      <div className="flex items-start justify-between border-b border-[#4E141D]/15 px-6 py-5">
        <div><div className="text-[10px] uppercase tracking-[0.22em] text-[#8C6D2F]">{mode === "cover" ? "Choose a cover" : "Insert an image"}</div><h2 className="mt-1 font-serif text-3xl">Image library.</h2></div>
        <div className="flex items-center gap-3">
          <button onClick={() => input.current?.click()} className="inline-flex items-center gap-2 bg-[#4E141D] px-4 py-2.5 text-[10px] uppercase tracking-[0.15em] text-white hover:bg-[#C5A059] hover:text-[#3D0F17]">{busy ? <Loader2 size={13} className="animate-spin" /> : <UploadIcon size={13} />} Upload</button>
          <button onClick={onClose} aria-label="Close"><X size={19} /></button>
        </div>
        <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/avif" hidden onChange={(event) => { void upload(Array.from(event.target.files ?? [])); event.target.value = ""; }} />
      </div>
      <div className="grid min-h-0 flex-1 md:grid-cols-[1fr_300px]">
        <div className="overflow-y-auto p-6">
          {uploads === null ? <div className="py-16 text-center text-sm text-[#8b857a]">Loading…</div>
            : !uploads.length ? <button onClick={() => input.current?.click()} className="flex w-full flex-col items-center justify-center gap-3 border border-dashed border-[#4E141D]/25 py-20 text-sm text-[#706b61] hover:border-[#C5A059]"><UploadIcon size={22} className="text-[#C5A059]" />Drop images here or click to upload.<span className="text-xs text-[#aaa399]">JPEG, PNG, WebP or GIF. Large photos are resized to 2000px and converted to WebP.</span></button>
            : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{uploads.map((item) => <div key={item.name} className="group relative">
              <button onClick={() => setSelected(item)} className={`block aspect-square w-full overflow-hidden bg-[#e9e4da] ring-2 ring-offset-2 ring-offset-[#f4f1ea] ${selected?.name === item.name ? "ring-[#C5A059]" : "ring-transparent"}`}><img src={item.url} alt="" loading="lazy" className="h-full w-full object-cover" /></button>
              <button onClick={() => remove(item)} aria-label={`Delete ${item.name}`} className="absolute right-1.5 top-1.5 hidden rounded-full bg-[#3D0F17]/75 p-1.5 text-white group-hover:block"><Trash2 size={12} /></button>
              <div className="mt-1.5 truncate text-[10px] text-[#8b857a]">{formatSize(item.size)} · {new Date(item.uploadedAt).toLocaleDateString("en-IN")}</div>
            </div>)}</div>}
        </div>
        <div className="border-t border-[#4E141D]/12 p-6 md:border-l md:border-t-0">
          {selected ? <>
            <img src={selected.url} alt="" className="w-full bg-[#e9e4da] object-contain" />
            <div className="mt-2 break-all text-[10px] text-[#8b857a]">{selected.url}</div>
            <Field label="Alt text" value={alt} onChange={setAlt} placeholder="Describe the image" />
            {mode === "body" && <Field label="Caption (optional)" value={caption} onChange={setCaption} placeholder="Shown under the image" />}
            <button onClick={pick} className="mt-5 flex w-full items-center justify-center gap-2 bg-[#4E141D] px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white hover:bg-[#C5A059] hover:text-[#3D0F17]">{mode === "cover" ? "Use as cover" : "Insert into article"} <ArrowRight size={13} /></button>
            {!alt.trim() && <p className="mt-2 text-xs text-[#8C6D2F]">Add alt text — Google reads it, and so do screen readers.</p>}
          </> : <p className="text-sm leading-6 text-[#8b857a]">Select an image, or drop new ones anywhere in this window.</p>}
        </div>
      </div>
    </div>
  </div>;
}
