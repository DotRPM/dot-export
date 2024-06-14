import { useState } from "react";
import { useSubmit } from "@remix-run/react";
import { AppliedFilter } from "~/lib/filters";
import { Page, Layout } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { productQuery } from "~/lib/productQuery";
import { createRequest } from "~/actions/export.server";
import { ColumnType, HeadingType } from "~/lib/columns";
import ColumnSection from "~/components/sections/ColumnSection";
import FilterSection from "~/components/sections/FilterSection";
import PreviewSection from "~/components/sections/PreviewSection";
import RequestSection from "~/components/sections/RequestSection";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, redirect } = await authenticate.admin(request);
  const { columns, filters, headings } = await request.json();

  // creating syntax from column names
  let syntax = "";
  for (const field in columns) {
    if (!columns[field].length) continue;
    if (field == "general") {
      syntax += `
        ${columns[field].join("\n        ")}
      `;
    } else {
      syntax += `
        ${field} {
          ${columns[field].join("\n          ")}
        }
      `;
    }
  }

  // creating search query from filters
  let query = "";
  const filterItems: any = {};
  for (const filter of filters) {
    const value = `${filter.value
      .split(",")
      .map((i: string) => `${i.trim()}`)
      .join(",")}`;
    const key = (filter.condition == "equals" ? "" : "-") + filter.key;
    if (filterItems[key]) filterItems[key].push(value);
    else filterItems[key] = [value];
  }
  for (const item in filterItems) {
    query += `${item}:${filterItems[item].join(",")} `;
  }

  await createRequest(
    session.shop,
    productQuery(syntax),
    query,
    headings as HeadingType[],
  );

  return redirect("/app?new=true");
};

export default function Request() {
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [tableHeadings, setTableHeadings] = useState<HeadingType[]>([]);
  const [items, setItems] = useState<ColumnType>({
    category: [],
    general: [],
    featuredImage: [],
    seo: [],
  });

  const submit = useSubmit();
  const handleSubmit = () =>
    submit(
      { filters: appliedFilters, columns: items, headings: tableHeadings },
      { method: "POST", encType: "application/json" },
    );

  return (
    <Page
      title="Export products"
      primaryAction={{ content: "Export", onAction: handleSubmit }}
      secondaryActions={[{ content: "Reset" }]}
    >
      <Layout>
        <ColumnSection
          items={items}
          setItems={setItems}
          setTableHeadings={setTableHeadings}
        />

        <FilterSection
          appliedFilters={appliedFilters}
          setAppliedFilters={setAppliedFilters}
        />

        <PreviewSection
          appliedFilters={appliedFilters}
          tableHeadings={tableHeadings}
          items={items}
        />

        <RequestSection />
      </Layout>
    </Page>
  );
}
