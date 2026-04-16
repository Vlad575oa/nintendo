import { InfoPage, generateInfoMetadata } from "@/components/InfoPage";

export const generateMetadata = () => generateInfoMetadata("contacts");

export default function ContactsPage() {
  return <InfoPage slug="contacts" />;
}
