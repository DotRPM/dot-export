import { Crisp } from "crisp-sdk-web";
import { BlockStack, Button, Card, Layout, List, Text } from "@shopify/polaris";

export default function RequestSection() {
  const openChatBox = () => Crisp.chat.open();

  return (
    <Layout.AnnotatedSection
      title="Request a feature"
      description={
        <>
          <Text as="p">Feels like not enough options to export your data?</Text>
          <Text as="p">
            Reach out to us for a feature request and we can implement it.
          </Text>
        </>
      }
    >
      <Card>
        <BlockStack gap="200">
          <Text as="p" variant="bodyMd">
            You can use the floating chat icon in the bottom right corner and
            we'll get back to you soon.
          </Text>
          <List gap="loose">
            <List.Item>Missing product columns</List.Item>
            <List.Item>Missing product filters</List.Item>
            <List.Item>Missing export options</List.Item>
          </List>
          <div>
            <Button variant="primary" onClick={openChatBox}>
              Chat with us
            </Button>
          </div>
        </BlockStack>
      </Card>
    </Layout.AnnotatedSection>
  );
}
