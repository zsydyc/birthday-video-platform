import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "order-assets";
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

// Allowed MIME types → mapped to a safe extension
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png":  "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
  "audio/mpeg": "mp3",
  "audio/mp4":  "m4a",
  "audio/wav":  "wav",
  "audio/ogg":  "ogg",
  "audio/aac":  "aac",
  "audio/webm": "webm",
  "video/mp4":  "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
};

// Magic-byte signatures for additional server-side verification
const MAGIC: Array<{ mime: string; offset: number; bytes: number[] }> = [
  { mime: "image/jpeg", offset: 0, bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png",  offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/webp", offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] },
  { mime: "audio/mpeg", offset: 0, bytes: [0x49, 0x44, 0x33] },      // ID3
  { mime: "audio/mpeg", offset: 0, bytes: [0xff, 0xfb] },            // MP3 frame
  { mime: "video/mp4",  offset: 4, bytes: [0x66, 0x74, 0x79, 0x70] }, // ftyp
];

function detectMagic(buf: Buffer): string | null {
  for (const sig of MAGIC) {
    const slice = [...buf.slice(sig.offset, sig.offset + sig.bytes.length)];
    if (sig.bytes.every((b, i) => b === slice[i])) return sig.mime;
  }
  return null;
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 20 MB)" }, { status: 413 });
  }

  // Check declared MIME type
  const declaredMime = file.type.toLowerCase();
  if (!ALLOWED[declaredMime]) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 415 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Verify magic bytes — reject if they contradict a known signature
  const detected = detectMagic(buffer);
  if (detected && detected !== declaredMime) {
    return NextResponse.json({ error: "File content does not match declared type" }, { status: 415 });
  }

  const ext = ALLOWED[declaredMime];
  const path = `${session.user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: declaredMime, upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl });
}
