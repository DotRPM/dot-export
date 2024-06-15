import { Crisp } from "crisp-sdk-web";
import { json } from "@remix-run/node";
import { NavMenu } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";

import { authenticate } from "../shopify.server";
import { initShop } from "~/actions/shop.server";
import { useEffect } from "react";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = await initShop(admin, session);

  return json({ apiKey: process.env.SHOPIFY_API_KEY || "", shop });
};

export default function App() {
  const { apiKey, shop } = useLoaderData<typeof loader>();

  useEffect(() => {
    Crisp.configure("aba5af21-dda8-446c-aa9b-ca48b58d1207");
    Crisp.user.setEmail(shop.email);
    Crisp.session.setData({
      App: "ExD",
      Store: shop.shop,
      Country: shop.country,
      Owner: shop.owner,
    });
  }, []);

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
