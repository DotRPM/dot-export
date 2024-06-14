import { v2 } from "cloudinary";

v2.config({
  secure: true,
});

export async function uploadCSV(file: Buffer) {
  const result = await new Promise((resolve) => {
    v2.uploader
      .upload_stream({ resource_type: "raw" }, (error, uploadResult) => {
        if (error) {
          console.log(error);
        }
        return resolve(uploadResult);
      })
      .end(file);
  });
  console.log(result);
  return (result as any).url;
}

export async function deleteCSV(url: string) {
  const parts = url.split("/");
  await v2.uploader.destroy(parts[parts.length - 1], { resource_type: "raw" });
}
