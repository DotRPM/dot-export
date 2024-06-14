import {
  Box,
  Card,
  Checkbox,
  Grid,
  InlineStack,
  Layout,
  Tabs,
  Text,
} from "@shopify/polaris";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ColumnType, HeadingType, columns } from "~/lib/columns";

interface Props {
  items: ColumnType;
  setItems: Dispatch<SetStateAction<ColumnType>>;
  setTableHeadings: Dispatch<SetStateAction<HeadingType[]>>;
}

export default function ColumnSection({
  items,
  setItems,
  setTableHeadings,
}: Props) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [allSelected, setAllSelected] = useState(false);
  const tabs = [
    { content: "General", id: "general" },
    { content: "Category", id: "category" },
    { content: "Image", id: "featuredImage" },
    { content: "SEO", id: "seo" },
  ];

  const handleChange = (
    value: boolean,
    key: string,
    category: keyof typeof columns,
  ) => {
    // get the index of the key
    const index = items[category].indexOf(key);
    let temp = items[category];

    // if it's in the array remove it
    if (index > -1 && !value) {
      temp.splice(index, 1);
      // else add it to the array
    } else if (index == -1 && value) {
      temp.push(key);
    }
    // set items according to the category
    setItems({ ...items, [category]: temp });
  };

  const handleAllSelect = (value: boolean) => {
    if (value) {
      const values = columns[tabs[selectedTab].id as keyof typeof columns].map(
        (item) => item.key,
      );
      setItems({
        ...items,
        [tabs[selectedTab].id]: values,
      });
      setAllSelected(true);
    } else {
      setItems({
        ...items,
        [tabs[selectedTab].id]: [],
      });
      setAllSelected(false);
    }
  };

  /* control all select check box
   - on tab change
   - on state change 
  */
  useEffect(() => {
    const values = columns[tabs[selectedTab].id as keyof typeof columns].map(
      (item) => item.key,
    );
    if (
      values.sort().toString() ==
      items[tabs[selectedTab].id as keyof typeof columns].sort().toString()
    ) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [items, selectedTab]);

  // handle headings
  useEffect(() => {
    let tempHeadings: HeadingType[] = [];
    for (const cat in items) {
      for (const item of items[cat as keyof typeof items]) {
        // get the field from columns
        const field = columns[cat as keyof typeof columns].find(
          (f) => f.key == item,
        );
        if (!field) return;

        // creating the new heading
        let prefix = "";
        let keyPrefix = "";
        if (cat != "general") {
          prefix = tabs.find((tab) => tab.id == cat)?.content || "";
          keyPrefix = cat + ".";
        }
        const newItem = {
          label: prefix + " " + field.label,
          key: keyPrefix + item,
        };

        const exist = tempHeadings.find((l) => l.key == keyPrefix + item);
        if (!exist) {
          // push the value according to rank
          if (field.rank > tempHeadings.length) tempHeadings.push(newItem);
          else
            tempHeadings = [
              ...tempHeadings.slice(0, field.rank - 1),
              newItem,
              ...tempHeadings.slice(field.rank - 1),
            ];
        }
      }
    }
    setTableHeadings(tempHeadings);
  }, [items]);

  return (
    <Layout.AnnotatedSection
      title="Product Columns"
      description={
        <>
          <Text as="p">
            Select the columns which need to be included in the exporting file.
          </Text>
          <Text as="p">
            Filter the columns according to the category and click on each
            checkbox.
          </Text>
        </>
      }
    >
      <Card padding="0">
        <Tabs
          tabs={tabs}
          selected={selectedTab}
          onSelect={(i) => setSelectedTab(i)}
        />
        <Box
          padding="300"
          paddingBlock="100"
          borderColor="border"
          borderBlockStartWidth="025"
          background="bg-fill-secondary"
        >
          <InlineStack align="space-between" blockAlign="center">
            <Checkbox
              label="Select all"
              checked={allSelected}
              onChange={handleAllSelect}
            />
            <Text as="p" tone="magic-subdued">
              {items[
                tabs[selectedTab].id as keyof typeof columns
              ].length.toString()}{" "}
              selected
            </Text>
          </InlineStack>
        </Box>
        <Box padding="300" borderColor="border" borderBlockStartWidth="025">
          <Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }}>
            {columns[tabs[selectedTab].id as keyof typeof columns].map(
              (field, index) => (
                <Checkbox
                  key={index}
                  label={field.label}
                  checked={items[
                    tabs[selectedTab].id as keyof typeof columns
                  ].includes(field.key)}
                  onChange={(value) =>
                    handleChange(
                      value,
                      field.key,
                      tabs[selectedTab].id as keyof typeof columns,
                    )
                  }
                />
              ),
            )}
          </Grid>
        </Box>
      </Card>
    </Layout.AnnotatedSection>
  );
}
