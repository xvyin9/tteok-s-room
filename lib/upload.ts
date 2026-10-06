"use client";

import { uploadLocalFile } from "@/lib/actions";

export async function uploadToBucket(bucket: string, file: File) {
  const formData = new FormData();
  formData.set("bucket", bucket);
  formData.set("file", file);
  const result = await uploadLocalFile(formData);
  if (result.error || !result.path || !result.publicUrl) {
    throw new Error(result.error ?? "上传失败");
  }
  return { path: result.path, publicUrl: result.publicUrl };
}
