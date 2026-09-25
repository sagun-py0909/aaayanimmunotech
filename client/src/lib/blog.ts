import type { Post, PostState, PostSummary, PublicPost } from "@shared/blog";

type BlogData = { posts?: PostSummary[]; post?: PublicPost; preview?: boolean };

// The server puts the page's data next to #root (server/blog-render.ts). It belongs to the URL the
// page was loaded at, so it is only used for that path.
const initialPath = typeof window === "undefined" ? "" : window.location.pathname;
const initialData: BlogData | null = (() => {
  const element = typeof document === "undefined" ? null : document.getElementById("blog-data");
  try {
    return element ? (JSON.parse(element.textContent || "null") as BlogData) : null;
  } catch {
    return null;
  }
})();

export const initialBlogData = (pathname: string): BlogData | null => (pathname === initialPath ? initialData : null);

export async function fetchPosts(): Promise<PostSummary[]> {
  const response = await fetch("/api/blog");
  if (!response.ok) throw new Error("The blog could not be loaded");
  return ((await response.json()) as { posts: PostSummary[] }).posts;
}

export async function fetchPost(slug: string): Promise<{ post?: PublicPost; redirect?: string } | null> {
  const response = await fetch(`/api/blog/${encodeURIComponent(slug)}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("The article could not be loaded");
  return response.json();
}

// ---- Lead desk --------------------------------------------------------------------------------

export type DeskPost = Post & { state: PostState };
export type Upload = { name: string; url: string; size: number; uploadedAt: string; width?: number; height?: number };

async function desk<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/desk${path}`, init);
  if (response.status === 401) {
    window.location.replace("/login");
    throw new Error("Signed out");
  }
  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((body as { error?: string }).error || "That did not save");
  return body as T;
}

const json = (method: string, body: unknown): RequestInit => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export const deskApi = {
  posts: () => desk<{ posts: DeskPost[] }>("/posts").then((data) => data.posts),
  create: (post: unknown) => desk<DeskPost>("/posts", json("POST", post)),
  update: (id: number, post: unknown) => desk<DeskPost>(`/posts/${id}`, json("PUT", post)),
  remove: (id: number) => desk<void>(`/posts/${id}`, { method: "DELETE" }),
  preview: (html: string) => desk<{ html: string }>("/preview", json("POST", { html })).then((data) => data.html),
  uploads: () => desk<{ uploads: Upload[] }>("/uploads").then((data) => data.uploads),
  removeUpload: (name: string) => desk<void>(`/uploads/${encodeURIComponent(name)}`, { method: "DELETE" }),
};

const maxWidth = 2000;

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`${file.name} is not an image this browser can read`));
    image.src = url;
  });
}

// Photos from a phone or camera are often 5–10 MB. Resize to at most 2000px wide and re-encode as WebP
// in the browser, like the rest of the site's imagery. GIFs are left alone so animation survives.
async function prepareImage(file: File): Promise<{ blob: Blob; name: string; width: number; height: number }> {
  const image = await loadImage(file);
  const { naturalWidth: width, naturalHeight: height } = image;
  URL.revokeObjectURL(image.src);
  if (file.type === "image/gif") return { blob: file, name: file.name, width, height };
  const scale = Math.min(1, maxWidth / width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.84));
  // Keep the original if the browser cannot encode WebP or the original is already smaller.
  if (!blob || blob.type !== "image/webp" || (scale === 1 && blob.size >= file.size)) return { blob: file, name: file.name, width, height };
  return { blob, name: file.name.replace(/\.[a-z0-9]+$/i, "") + ".webp", width: canvas.width, height: canvas.height };
}

export async function uploadImage(file: File): Promise<Upload> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") throw new Error("Upload a JPEG, PNG, WebP or GIF image.");
  const prepared = await prepareImage(file);
  if (prepared.blob.size > 8 * 1024 * 1024) throw new Error("That image is over 8 MB even after compressing.");
  const response = await fetch("/api/desk/uploads", { method: "POST", headers: { "Content-Type": prepared.blob.type || file.type, "X-File-Name": encodeURIComponent(prepared.name) }, body: prepared.blob });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((body as { error?: string }).error || "The upload failed");
  return { ...(body as Upload), width: prepared.width, height: prepared.height };
}
