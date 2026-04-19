import { promises as fs } from "node:fs";
import path from "node:path";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { hasUserPurchasedSlug } from "@/lib/db";
import { getProductBySlug } from "@/lib/products";

const publicTypes = new Set(["preview", "glb"]);
const fileTypes = new Set(["preview", "glb", "obj", "stl"]);

function getStorageConfig() {
  return {
    bucketName: process.env.RAILWAY_BUCKET_NAME?.trim() || process.env.BUCKET?.trim() || "",
    endpoint: process.env.ENDPOINT?.trim() || process.env.ENDPOINT_URL?.trim() || "",
    region: process.env.REGION?.trim() || "us-west-2",
    accessKeyId: process.env.ACCESS_KEY_ID?.trim() || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY?.trim() || ""
  };
}

function getS3Client() {
  const config = getStorageConfig();

  if (!config.bucketName || !config.endpoint || !config.accessKeyId || !config.secretAccessKey) {
    return null;
  }

  return new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    }
  });
}

function getStaticAssetPath(fileBase: string, type: string) {
  if (type === "preview") {
    return path.join(process.cwd(), "public", "catalog", `${fileBase}-render.png`);
  }

  return path.join(process.cwd(), "public", "models", `${fileBase}.${type}`);
}

function getContentType(type: string) {
  switch (type) {
    case "preview":
      return "image/png";
    case "glb":
      return "model/gltf-binary";
    case "obj":
      return "text/plain; charset=utf-8";
    case "stl":
      return "model/stl";
    default:
      return "application/octet-stream";
  }
}

function getDownloadName(productName: string, type: string) {
  const safeName = productName.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, "-").replace(/^-+|-+$/g, "");
  return `${safeName || "model"}.${type}`;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "";

  if (!fileTypes.has(type)) {
    return NextResponse.json({ error: "Unknown asset type" }, { status: 400 });
  }

  const product = await getProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: "Model not found" }, { status: 404 });
  }

  if (!publicTypes.has(type)) {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Login required to download files" }, { status: 401 });
    }

    const canDownload =
      user.role === "seller" && product.sellerId === user.id
        ? true
        : await hasUserPurchasedSlug(user.id, slug);

    if (!canDownload) {
      return NextResponse.json({ error: "File is available only after purchase" }, { status: 403 });
    }
  }

  if (product.source === "catalog") {
    try {
      const assetPath = getStaticAssetPath(product.fileBase, type);
      const body = await fs.readFile(assetPath);

      return new NextResponse(body, {
        headers: {
          "Content-Type": getContentType(type),
          ...(publicTypes.has(type)
            ? {}
            : {
                "Content-Disposition": `attachment; filename="${getDownloadName(product.name, type)}"`
              })
        }
      });
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
  }

  const objectKey =
    type === "preview"
      ? product.previewImageKey
      : type === "glb"
        ? product.glbKey
        : type === "obj"
          ? product.objKey
          : product.stlKey;

  if (!objectKey) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const client = getS3Client();
  const { bucketName } = getStorageConfig();

  if (!client || !bucketName) {
    return NextResponse.json({ error: "Storage is not configured" }, { status: 503 });
  }

  try {
    const result = await client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey
      })
    );

    const bytes = result.Body ? Buffer.from(await result.Body.transformToByteArray()) : null;

    if (!bytes) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return new NextResponse(bytes, {
      headers: {
        "Content-Type": result.ContentType || getContentType(type),
        ...(publicTypes.has(type)
          ? {}
          : {
              "Content-Disposition": `attachment; filename="${getDownloadName(product.name, type)}"`
            })
      }
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
