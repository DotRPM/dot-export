import { $Enums } from "@prisma/client";
import { useNavigation, useSubmit } from "@remix-run/react";
import { capitalizeFirstLetter } from "~/lib/general";
import { ArrowDownIcon, DeleteIcon } from "@shopify/polaris-icons";
import { Badge, Button, ButtonGroup, IndexTable } from "@shopify/polaris";
import { Tone } from "@shopify/polaris/build/ts/src/components/Badge";

interface Props {
  index: number;
  request: {
    id: string;
    requestAt: string;
    status: $Enums.Status;
    url: string | null;
    shopId: string;
  };
}

export default function RequestRow({ index, request }: Props) {
  const submit = useSubmit();
  const { state } = useNavigation();

  const tone = (): Tone => {
    switch (request.status) {
      case "pending":
        return "attention";
      case "started":
        return "info";
      case "completed":
        return "success";
      case "failed":
        return "critical";
    }
  };

  const downloadFile = (url: string, date: string) => {
    const timestamp = new Date(date).toLocaleDateString("en", {
      dateStyle: "medium",
    });
    const filename = `${timestamp}.csv`;
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      })
      .catch((err) => console.error("Error downloading file:", err));
  };

  return (
    <IndexTable.Row id={index.toString()} position={index} key={index}>
      <IndexTable.Cell>{index}</IndexTable.Cell>
      <IndexTable.Cell>
        {new Date(request.requestAt).toLocaleDateString("en", {
          dateStyle: "medium",
        })}
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone={tone()}>{capitalizeFirstLetter(request.status)}</Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div onClick={(e) => e.stopPropagation()}>
          <ButtonGroup>
            <Button
              icon={ArrowDownIcon}
              variant="primary"
              size="micro"
              disabled={!request.url}
              onClick={() =>
                downloadFile(request.url || "", request.requestAt.toString())
              }
            >
              Download
            </Button>
            <Button
              tone="critical"
              size="micro"
              icon={DeleteIcon}
              loading={state == "loading"}
              onClick={() =>
                submit(
                  { url: request.url, id: request.id },
                  { method: "DELETE", encType: "application/json" },
                )
              }
            />
          </ButtonGroup>
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  );
}
