import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { productQuery } from "~/lib/productQuery";
import type { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const { columns, filters } = await request.json();

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
  console.debug("Search query:", query);
  const response = await admin.graphql(productQuery(syntax), {
    variables: {
      limit: 5,
      query,
    },
  });

  const { data } = await response.json();

  return json({ products: data.products.nodes });
};
