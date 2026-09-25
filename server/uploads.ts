// Images uploaded from the blog editor, served at /uploads/<file>. Like the JSON store, this is a
// directory on disk: on Vercel it is ephemeral, so point AAAYAN_UPLOAD_DIR at a persistent volume
// (or swap these functions for object storage) before relying on it there.
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { slugify } from "../shared/blog";

export const uploadDirectory = process.env.AAAYAN_UPLOAD_DIR || path.resolve(process.cwd(), "server/data/uploads");
export const uploadLimitBytes = 8 * 1024 * 1024;

export type Upload = { name: string; url: string; size: number; uploadedAt: string };

// Identify the file by its bytes, not by what the browser claims. SVG is deliberately absent: it can carry script.
function detectImage(buffer: Buffer): "jpg" | "png" | "webp" | "gif" | "avif" | null {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpg";
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (buffer.toString("ascii", 0, 6) === "GIF87a" || buffer.toString("ascii", 0, 6) === "GIF89a") return "gif";
  if (buffer.toString("ascii", 4, 8) === "ftyp" && /^avi[fs]$/.test(buffer.toString("ascii", 8, 12))) return "avif";
  return null;
}

export class UploadRejectedError extends Error {}

export function saveUpload(buffer: Buffer, originalName: string): Upload {
  const extension = detectImage(buffer);
  if (!extension) throw new UploadRejectedError("Only JPEG, PNG, WebP, GIF or AVIF images can be uploaded.");
  const base = slugify(originalName.replace(/\.[a-z0-9]+$/i, "")).slice(0, 50) || "image";
  const name = `${base}-${crypto.randomBytes(4).toString("hex")}.${extension}`;
  fs.mkdirSync(uploadDirectory, { recursive: true });
  const target = path.join(uploadDirectory, name);
  fs.writeFileSync(target, buffer);
  return { name, url: `/uploads/${name}`, size: buffer.length, uploadedAt: new Date().toISOString() };
}

export function listUploads(): Upload[] {
  if (!fs.existsSync(uploadDirectory)) return [];
  return fs
    .readdirSync(uploadDirectory)
    .filter((name) => /^[a-z0-9-]+\.(jpg|png|webp|gif|avif)$/.test(name))
    .map((name) => {
      const stats = fs.statSync(path.join(uploadDirectory, name));
      return { name, url: `/uploads/${name}`, size: stats.size, uploadedAt: stats.mtime.toISOString() };
    })
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

/** Only names this module produced; anything else (../, subfolders) is refused. */
export function deleteUpload(name: string) {
  if (!/^[a-z0-9-]+\.(jpg|png|webp|gif|avif)$/.test(name)) return false;
  const target = path.join(uploadDirectory, name);
  if (!fs.existsSync(target)) return false;
  fs.unlinkSync(target);
  return true;
}
