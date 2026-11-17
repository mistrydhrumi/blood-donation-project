import type { Metadata } from "next";
import { Suspense } from "react";
import EmergencyRequestsPageContent from "@/components/emergency-requests/EmergencyRequestsPageContent";

export const metadata: Metadata = {
  title: "Emergency Blood Requests | BloodSetu",
  description:
    "Browse active, hospital-linked requests and share them with your trusted network. Respond when every minute matters.",
};

export default function EmergencyRequestsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full bg-red-50/40 min-h-72 flex items-center justify-center">
          <div className="flex items-center gap-2.5 text-red-700 text-sm font-medium">
            <span className="h-5 w-5 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
            <span>Loading emergency requests...</span>
          </div>
        </div>
      }
    >
      <EmergencyRequestsPageContent />
    </Suspense>
  );
}
