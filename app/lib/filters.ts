export type SelectValueType = {
  type: "select";
  options: { label: string; value: string }[];
};

export type TextValueType = {
  type: "text";
  placeholder: string;
};

export type FiltersType = {
  [key: string]: {
    label: string;
    conditions: { label: string; value: string }[];
    value: SelectValueType | TextValueType;
  };
};

export type AppliedFilter = {
  key: keyof typeof filters;
  value: string;
  condition: string;
};

export const filters: FiltersType = {
  status: {
    label: "Status",
    conditions: [
      { label: "Equals", value: "equals" },
      { label: "Not equals", value: "notEquals" },
    ],
    value: {
      type: "select",
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Draft", value: "DRAFT" },
        { label: "Archived", value: "ARCHIVED" },
      ],
    },
  },
  vendor: {
    label: "Vendor",
    conditions: [
      { label: "Equals", value: "equals" },
      { label: "Not equals", value: "notEquals" },
    ],
    value: {
      type: "text",
      placeholder: "Vendor 1, Vendor 2",
    },
  },
  product_type: {
    label: "Type",
    conditions: [
      { label: "Equals", value: "equals" },
      { label: "Not equals", value: "notEquals" },
    ],
    value: {
      type: "text",
      placeholder: "Type 1, Type 2",
    },
  },
  tags: {
    label: "Tags",
    conditions: [
      { label: "Equals", value: "equals" },
      { label: "Not equals", value: "notEquals" },
    ],
    value: {
      type: "text",
      placeholder: "Tag 1, Tag 2",
    },
  },
};
