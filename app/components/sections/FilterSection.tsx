import {
  ActionList,
  BlockStack,
  Box,
  Button,
  Card,
  FormLayout,
  InlineStack,
  Layout,
  Popover,
  ResourceItem,
  ResourceList,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import {
  AppliedFilter,
  SelectValueType,
  TextValueType,
  filters,
} from "~/lib/filters";
import { DeleteIcon } from "@shopify/polaris-icons";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  appliedFilters: AppliedFilter[];
  setAppliedFilters: Dispatch<SetStateAction<AppliedFilter[]>>;
}

export default function FilterSection({
  appliedFilters,
  setAppliedFilters,
}: Props) {
  const [filterPopover, setFilterPopover] = useState(false);

  const handleAddFilter = (key: keyof typeof filters) => {
    let item: AppliedFilter = {
      key,
      condition: filters[key].conditions[0].value,
      value: "",
    };

    if (filters[key].value.type == "select") {
      item.value = (filters[key].value as SelectValueType).options[0].value;
    }

    setAppliedFilters([...appliedFilters, item]);
  };

  const handleRemoveFilter = (index: number) => {
    let temp = appliedFilters;
    temp.splice(index, 1);
    setAppliedFilters([...temp]);
  };

  const handleFilterChange = (
    index: number,
    key: keyof (typeof appliedFilters)[number],
    value: string,
  ) => {
    let temp = appliedFilters;
    temp[index][key] = value;
    setAppliedFilters([...temp]);
  };

  return (
    <Layout.AnnotatedSection
      title="Export filters"
      description={
        <>
          <Text as="p">
            Add filters to customize and refine the data to be exported.
          </Text>
          <Text as="p">
            Please leave the columns blank if you don't need a filter to be
            applied.
          </Text>
        </>
      }
    >
      <Card padding="0">
        <Box padding="300">
          <InlineStack align="end" gap="200">
            <Button variant="tertiary" onClick={() => setAppliedFilters([])}>
              Clear all
            </Button>
            <Popover
              active={filterPopover}
              activator={
                <Button
                  variant="primary"
                  disclosure
                  onClick={() => setFilterPopover((state) => !state)}
                >
                  Add
                </Button>
              }
              autofocusTarget="first-node"
              onClose={() => setFilterPopover(false)}
            >
              <ActionList
                actionRole="menuitem"
                items={Object.keys(filters).map((key) => {
                  return {
                    content: filters[key as keyof typeof filters].label,
                    onAction: () =>
                      handleAddFilter(key as keyof typeof filters),
                  };
                })}
              />
            </Popover>
          </InlineStack>
        </Box>

        <Box borderColor="border" borderBlockStartWidth="025">
          <ResourceList
            emptyState={
              <div
                style={{
                  minHeight: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BlockStack align="center">
                  <Text as="p" alignment="center" tone="subdued">
                    No filters added.
                  </Text>
                </BlockStack>
              </div>
            }
            items={appliedFilters}
            renderItem={(item, id, index) => {
              return (
                <ResourceItem id={id} onClick={() => {}}>
                  <InlineStack
                    align="space-between"
                    blockAlign="center"
                    gap="400"
                  >
                    <div style={{ minWidth: "80px" }}>
                      <Text as="p">{filters[item.key].label}</Text>
                    </div>
                    <FormLayout.Group>
                      <Select
                        label="Condition"
                        labelHidden
                        value={item.condition}
                        onChange={(value) =>
                          handleFilterChange(index, "condition", value)
                        }
                        options={filters[item.key].conditions}
                      />
                      {filters[item.key].value.type == "select" ? (
                        <Select
                          label="Value"
                          labelHidden
                          options={
                            (filters[item.key].value as SelectValueType).options
                          }
                          value={item.value}
                          onChange={(value) =>
                            handleFilterChange(index, "value", value)
                          }
                        />
                      ) : (
                        <TextField
                          label="Value"
                          placeholder={
                            (filters[item.key].value as TextValueType)
                              .placeholder
                          }
                          autoComplete="off"
                          labelHidden
                          value={item.value}
                          onChange={(value) =>
                            handleFilterChange(index, "value", value)
                          }
                        />
                      )}
                    </FormLayout.Group>
                    <Button
                      tone="critical"
                      icon={DeleteIcon}
                      onClick={() => handleRemoveFilter(index)}
                    ></Button>
                  </InlineStack>
                </ResourceItem>
              );
            }}
          />
        </Box>
      </Card>
    </Layout.AnnotatedSection>
  );
}
