import { InfoPage, generateInfoMetadata } from "@/components/InfoPage";

export const generateMetadata = () => generateInfoMetadata("about");

export default function AboutPage() {
  return <InfoPage slug="about" />;
}
