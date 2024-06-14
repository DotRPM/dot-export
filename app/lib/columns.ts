type ExtractKeys<T> = T extends { key: infer K } ? K : never;

export type ColumnType = {
  [K in keyof typeof columns]: ExtractKeys<(typeof columns)[K][number]>[];
};

export type HeadingType = {
  key: string;
  label: string;
};

export const columns = {
  general: [
    { label: "ID", key: "legacyResourceId", rank: 1 },
    { label: "Title", key: "title", rank: 2 },
    { label: "Vendor", key: "vendor", rank: 3 },
    { label: "Tags", key: "tags", rank: 4 },
    { label: "Created At", key: "createdAt", rank: 5 },
    { label: "Updated At", key: "updatedAt", rank: 6 },
    { label: "Published At", key: "publishedAt", rank: 7 },
    { label: "Handle", key: "handle", rank: 8 },
    { label: "Description", key: "descriptionHtml", rank: 9 },
    { label: "Type", key: "productType", rank: 10 },
    { label: "Status", key: "status", rank: 11 },
    { label: "URL", key: "onlineStoreUrl", rank: 12 },
    { label: "Gift Card", key: "isGiftCard", rank: 13 },
    { label: "Template Suffix", key: "templateSuffix", rank: 14 },
  ],
  category: [
    { label: "ID", key: "id", rank: 15 },
    { label: "Name", key: "name", rank: 16 },
  ],
  featuredImage: [
    { label: "URL", key: "url", rank: 17 },
    { label: "Alt Text", key: "altText", rank: 18 },
    { label: "Height", key: "height", rank: 19 },
    { label: "Width", key: "width", rank: 20 },
  ],
  seo: [
    { label: "Title", key: "title", rank: 21 },
    { label: "Description", key: "description", rank: 22 },
  ],
};
