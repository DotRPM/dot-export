import Queue from "bull";
import prisma from "~/db.server";
import { format } from "@fast-csv/format";
import { HeadingType } from "~/lib/columns";
import { deleteCSV, uploadCSV } from "./cloudinary.server";
import { getNestedProperty } from "~/lib/general";
import { unauthenticated } from "~/shopify.server";

export const exportQueue = new Queue(
  "export-products",
  process.env.REDIS_URL || "",
);

interface RequestBody {
  syntax: string;
  query: string;
  headings: HeadingType[];
}

exportQueue.process(async function name(job, done) {
  console.log(job.data.requestId, "Stating products export...");
  await generateCSV(job.data.shop, job.data.body, job.data.requestId);
  done();
});

const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getAllRequests(shop: string) {
  const shopData = await prisma.shop.findUnique({
    where: { shop },
    select: {
      jobs: {
        orderBy: {
          requestAt: "desc",
        },
      },
    },
  });
  if (!shopData) return [];
  return shopData.jobs;
}

export async function deleteRequest(id: string, url: string) {
  await prisma.job.delete({ where: { id } });
  if (url) await deleteCSV(url);
}

export async function createRequest(
  shop: string,
  syntax: string,
  query: string,
  headings: HeadingType[],
) {
  const request = await prisma.job.create({
    data: {
      shop: {
        connect: {
          shop,
        },
      },
    },
  });
  exportQueue.add({
    shop,
    body: { query, syntax, headings },
    requestId: request.id,
  });
}

export async function generateCSV(
  shop: string,
  { query, syntax, headings }: RequestBody,
  requestId: string,
) {
  try {
    const { admin } = await unauthenticated.admin(shop);

    // fetch data
    await prisma.job.update({
      where: { id: requestId },
      data: { status: "started" },
    });
    let params = {
      limit: 50,
      cursor: null,
      query,
    };
    const allProducts = [];
    let hasNextPage = true;
    do {
      const res = await admin.graphql(syntax, { variables: params });
      const { data } = await res.json();
      const products = data.products.nodes.map((i: any) => i);
      allProducts.push(...products);
      params.cursor = data.products.pageInfo.endCursor;
      hasNextPage = data.products.pageInfo.hasNextPage;
    } while (hasNextPage);

    // write csv
    const csvStream = format({
      headers: headings.map((heading) => heading.label),
    });
    for await (const product of allProducts) {
      const csvLine: any = {};
      for (const heading of headings) {
        csvLine[heading.label] = getNestedProperty(product, heading.key);
      }
      csvStream.write(csvLine);
      await timer(50);
    }

    // uplad csv and get the url
    const csvFile = csvStream.read();
    const fileUrl = await uploadCSV(csvFile);
    await prisma.job.update({
      where: { id: requestId },
      data: { status: "completed", url: fileUrl },
    });
  } catch (_e) {
    await prisma.job.update({
      where: { id: requestId },
      data: { status: "failed" },
    });
  }
}
