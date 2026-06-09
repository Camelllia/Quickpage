import LegalPage from "@/components/LegalPage";
import { BRAND_NAME } from "@/lib/brand";
import { guidelinesDocument } from "@/lib/legal/guidelines";

export const metadata = {
  title: `운영 정책 및 가이드라인 | ${BRAND_NAME}`,
  description: `${BRAND_NAME} 운영 정책 및 콘텐츠 가이드라인`,
};

export default function GuidelinesPage() {
  return <LegalPage document={guidelinesDocument} />;
}
