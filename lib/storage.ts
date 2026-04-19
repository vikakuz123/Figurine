import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function getStorageConfig() {
  const bucketName = process.env.RAILWAY_BUCKET_NAME?.trim() || process.env.BUCKET?.trim() || "";
  const endpoint = process.env.ENDPOINT?.trim() || process.env.ENDPOINT_URL?.trim() || "";
  const region = process.env.REGION?.trim() || "us-west-2";
  const accessKeyId = process.env.ACCESS_KEY_ID?.trim() || "";
  const secretAccessKey = process.env.SECRET_ACCESS_KEY?.trim() || "";

  return {
    bucketName,
    endpoint,
    region,
    accessKeyId,
    secretAccessKey
  };
}

function getClient() {
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

export function isStorageConfigured() {
  const config = getStorageConfig();

  return Boolean(
    config.bucketName && config.endpoint && config.accessKeyId && config.secretAccessKey
  );
}

export async function uploadObject(input: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  const client = getClient();
  const { bucketName } = getStorageConfig();

  if (!client || !bucketName) {
    throw new Error("Storage is not configured");
  }

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType
    })
  );
}
