import { InfoPage, generateInfoMetadata } from "@/components/InfoPage";

export const generateMetadata = () => generateInfoMetadata("delivery");

export default function DeliveryPage() {
  return <InfoPage slug="delivery" />;
}
