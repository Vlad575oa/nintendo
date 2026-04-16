import { InfoPage, generateInfoMetadata } from "@/components/InfoPage";

export const generateMetadata = () => generateInfoMetadata("warranty");

export default function WarrantyPage() {
  return <InfoPage slug="warranty" />;
}
