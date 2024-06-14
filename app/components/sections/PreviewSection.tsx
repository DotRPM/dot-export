import { useEffect, useState } from "react";
import { AppliedFilter } from "~/lib/filters";
import { ColumnType, HeadingType } from "~/lib/columns";
import { useFetcher, useNavigation } from "@remix-run/react";
import { getNestedProperty, truncateString } from "~/lib/general";
import { Card, IndexTable, Layout, Text } from "@shopify/polaris";
import { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";

interface Props {
  items: ColumnType;
  tableHeadings: HeadingType[];
  appliedFilters: AppliedFilter[];
}

export default function PreviewSection({
  items,
  appliedFilters,
  tableHeadings,
}: Props) {
  const fetcher = useFetcher();
  const { state } = useNavigation();
  const [products, setProducts] = useState([]);

  const handlePreview = () =>
    fetcher.submit(
      { filters: appliedFilters, columns: items },
      { method: "POST", encType: "application/json", action: "/app/preview" },
    );

  useEffect(() => {
    if (fetcher.data) {
      setProducts((fetcher.data as any).products);
    }
  }, [fetcher.data]);

  useEffect(() => {
    let empty = true;
    for (const key in items) {
      if (items[key as keyof typeof items].length != 0) {
        empty = false;
      }
    }
    if (!empty) handlePreview();
  }, [items, appliedFilters]);

  return (
    <Layout.AnnotatedSection
      title="Result preview"
      description={
        <>
          <Text as="p">
            Here you can see the preview of the data to be exported.
          </Text>
          <Text as="p">
            It only shows the first five results and you can scroll to the right
            to see all columns.
          </Text>
        </>
      }
    >
      <Card padding="0">
        <IndexTable
          loading={state == "submitting"}
          itemCount={products.length}
          headings={
            tableHeadings.map((value) => {
              return { title: value.label };
            }) as NonEmptyArray<IndexTableHeading>
          }
          selectable={false}
          emptyState={
            <Text as="p" tone="subdued">
              No results found. Try changing the filter.
            </Text>
          }
        >
          {products.map((product: any, index) => (
            <IndexTable.Row position={index} id={index.toString()}>
              {tableHeadings.map((item, i) => (
                <IndexTable.Cell key={i}>
                  <Text as="p">
                    {truncateString(
                      getNestedProperty(product, item.key) || "",
                      30,
                    )}
                  </Text>
                </IndexTable.Cell>
              ))}
            </IndexTable.Row>
          ))}
        </IndexTable>
      </Card>
    </Layout.AnnotatedSection>
  );
}
