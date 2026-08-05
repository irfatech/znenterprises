import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

export interface ImageMeta {
  width: number;
  height: number;
  type: string;
}

const base = import.meta.env.BASE_URL;

export function getImageMeta(src: string): ImageMeta | null {
  if (!src || /^https?:\/\//.test(src)) return null;

  let rel = src.replace(/^\/+/, "");
  if (base && base !== "/") {
    const baseNoSlash = base.replace(/^\/+/, "").replace(/\/+$/, "");
    if (rel.startsWith(baseNoSlash + "/")) {
      rel = rel.slice(baseNoSlash.length + 1);
    }
  }

  const abs = path.join(process.cwd(), "public", rel);
  if (!existsSync(abs)) return null;

  let buf: Buffer;
  try {
    buf = readFileSync(abs);
  } catch {
    return null;
  }

  if (buf.length < 2) return null;

  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buf.length) {
      if (buf[offset] !== 0xff) {
        offset++;
        continue;
      }
      const marker = buf[offset + 1];
      if (marker === 0xd8 || marker === 0xd9) {
        offset += 2;
        continue;
      }
      const len = buf.readUInt16BE(offset + 2);
      const isSof =
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf);
      if (isSof) {
        const height = buf.readUInt16BE(offset + 5);
        const width = buf.readUInt16BE(offset + 7);
        return { width, height, type: "image/jpeg" };
      }
      offset += 2 + len;
    }
    return null;
  }

  if (buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return {
      width: buf.readUInt32BE(16),
      height: buf.readUInt32BE(20),
      type: "image/png",
    };
  }

  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") {
      const width = 1 + ((buf[24] ?? 0) | ((buf[25] ?? 0) << 8) | ((buf[26] ?? 0) << 16));
      const height = 1 + ((buf[27] ?? 0) | ((buf[28] ?? 0) << 8) | ((buf[29] ?? 0) << 16));
      return { width, height, type: "image/webp" };
    }
    if (chunk === "VP8 ") {
      const width = buf.readUInt16LE(26) & 0x3fff;
      const height = buf.readUInt16LE(28) & 0x3fff;
      return { width, height, type: "image/webp" };
    }
    if (chunk === "VP8L") {
      const bits = (buf[21] ?? 0) | ((buf[22] ?? 0) << 8) | ((buf[23] ?? 0) << 16);
      const width = (bits & 0x3fff) + 1;
      const height = ((bits >> 14) & 0x3fff) + 1;
      return { width, height, type: "image/webp" };
    }
    return null;
  }

  if (buf.length > 10 && (buf.toString("ascii", 0, 6) === "GIF87a" || buf.toString("ascii", 0, 6) === "GIF89a")) {
    return {
      width: buf.readUInt16LE(6),
      height: buf.readUInt16LE(8),
      type: "image/gif",
    };
  }

  return null;
}
