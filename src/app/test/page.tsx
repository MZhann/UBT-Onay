import { Suspense } from "react";
import UbtTestPage from "@/components/page-components/test-page/ubt-test-page"; 

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UbtTestPage />
    </Suspense>
  );
}
