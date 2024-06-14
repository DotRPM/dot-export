import {
  useActionData,
  useLoaderData,
  useNavigation,
  useRevalidator,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { useEffect } from "react";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { deleteRequest, getAllRequests } from "~/actions/export.server";
import RequestRow from "~/components/requests/RequestRow";
import { Page, Layout, Card, IndexTable } from "@shopify/polaris";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const requests = await getAllRequests(session.shop);
  return json({ requests });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { id, url } = await request.json();
  if (request.method == "DELETE") {
    await deleteRequest(id, url);
    return json({ deleted: true });
  }
};

export default function Index() {
  const { state } = useNavigation();
  const revalidator = useRevalidator();
  const [searchParams, setSearchParams] = useSearchParams();
  const { requests } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (searchParams.get("new")) {
      setSearchParams({});
      shopify.toast.show("New request created");
    }
  }, [searchParams]);

  useEffect(() => {
    if (actionData?.deleted) {
      shopify.toast.show("Request deleted");
    }
  }, [actionData]);

  return (
    <Page
      title="Requests"
      primaryAction={{ content: "New request", url: "/app/request" }}
      secondaryActions={[
        { content: "Refresh", onAction: () => revalidator.revalidate() },
      ]}
    >
      <Layout>
        <Layout.Section>
          <Card padding="0">
            <IndexTable
              itemCount={requests.length}
              headings={[
                { title: "#" },
                { title: "Date" },
                { title: "Status" },
                { title: "Action" },
              ]}
              resourceName={{ plural: "requests", singular: "request" }}
              loading={state == "loading"}
            >
              {requests.map((request, index) => (
                <RequestRow request={request} index={index} />
              ))}
            </IndexTable>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
