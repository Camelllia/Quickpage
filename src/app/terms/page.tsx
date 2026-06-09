import LegalPage from "@/components/LegalPage";
import { BRAND_NAME } from "@/lib/brand";
import { termsDocument } from "@/lib/legal/terms";

export const metadata = {
  title: `서비스 이용 약관 | ${BRAND_NAME}`,
  description: `${BRAND_NAME} 서비스 이용 약관`,
};

export default function TermsPage() {
  return <LegalPage document={termsDocument} />;
}
