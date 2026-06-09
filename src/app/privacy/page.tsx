import LegalPage from "@/components/LegalPage";
import { BRAND_NAME } from "@/lib/brand";
import { privacyDocument } from "@/lib/legal/privacy";

export const metadata = {
  title: `개인정보처리방침 | ${BRAND_NAME}`,
  description: `${BRAND_NAME} 개인정보처리방침`,
};

export default function PrivacyPage() {
  return <LegalPage document={privacyDocument} />;
}
