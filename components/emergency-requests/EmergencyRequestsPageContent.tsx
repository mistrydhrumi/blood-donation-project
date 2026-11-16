"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import EmergencyRequestsHero from "./EmergencyRequestsHero";
import EmergencyRequestsDirectory, {
  EmergencyRequestItem,
} from "./EmergencyRequestsDirectory";
import RequestDetailView from "./RequestDetailView";
import CreateRequestStepFlow from "./CreateRequestStepFlow";

const DEFAULT_REQUESTS: EmergencyRequestItem[] = [
  {
    id: "1",
    code: "BR-1048",
    urgency: "immediate",
    urgencyLabel: "IMMEDIATE",
    bloodGroup: "O-",
    hospital: "Civil Hospital Ahmedabad",
    city: "Ahmedabad",
    unitsNeeded: 2,
    requiredBy: "Today, 6:00 PM",
  },
  {
    id: "2",
    code: "BR-1047",
    urgency: "within_12_hours",
    urgencyLabel: "WITHIN 12 HOURS",
    bloodGroup: "B+",
    hospital: "Zydus Hospital",
    city: "Ahmedabad",
    unitsNeeded: 1,
    requiredBy: "Today, 10:30 PM",
  },
  {
    id: "3",
    code: "BR-1042",
    urgency: "within_24_hours",
    urgencyLabel: "WITHIN 24 HOURS",
    bloodGroup: "A+",
    hospital: "Apollo Hospital",
    city: "Gandhinagar",
    unitsNeeded: 3,
    requiredBy: "Tomorrow, 11:00 AM",
  },
  {
    id: "4",
    code: "BR-1039",
    urgency: "immediate",
    urgencyLabel: "IMMEDIATE",
    bloodGroup: "AB+",
    hospital: "Sterling Hospital",
    city: "Vadodara",
    unitsNeeded: 2,
    requiredBy: "Today, 8:00 PM",
  },
  {
    id: "5",
    code: "BR-1035",
    urgency: "within_12_hours",
    urgencyLabel: "WITHIN 12 HOURS",
    bloodGroup: "O+",
    hospital: "SVP Hospital",
    city: "Ahmedabad",
    unitsNeeded: 4,
    requiredBy: "Tomorrow, 9:00 AM",
  },
  {
    id: "6",
    code: "BR-1031",
    urgency: "within_24_hours",
    urgencyLabel: "WITHIN 24 HOURS",
    bloodGroup: "B-",
    hospital: "Kiran Hospital",
    city: "Surat",
    unitsNeeded: 1,
    requiredBy: "Tomorrow, 2:00 PM",
  },
];

export function EmergencyRequestsPageContent() {
  const searchParams = useSearchParams();
  const [customRequests, setCustomRequests] = useState<EmergencyRequestItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const allRequests = [...customRequests, ...DEFAULT_REQUESTS];

  // Determine selected request from query param or client state
  const queryId = searchParams.get("id");
  const queryCode = searchParams.get("code");
  const queryAction = searchParams.get("action");

  const effectiveSelectedRequest =
    !isCreating && queryAction !== "create"
      ? allRequests.find(
          (r) =>
            (selectedId && r.id === selectedId) ||
            (queryId && r.id === queryId) ||
            (queryCode && r.code.toLowerCase() === queryCode.toLowerCase())
        ) || null
      : null;

  const showCreateFlow = isCreating || queryAction === "create";

  const handlePublishRequest = (newRequest: EmergencyRequestItem) => {
    setCustomRequests((prev) => [newRequest, ...prev]);
    setIsCreating(false);
    setSelectedId(newRequest.id);
    window.history.pushState({}, "", `/emergency-requests?code=${newRequest.code}`);
  };

  return (
    <div className="w-full bg-white">
      {showCreateFlow ? (
        /* Multi-step Create Request Flow matching user Images 1 to 6 */
        <CreateRequestStepFlow
          onCancel={() => {
            setIsCreating(false);
            window.history.pushState({}, "", "/emergency-requests");
          }}
          onPublish={handlePublishRequest}
        />
      ) : effectiveSelectedRequest ? (
        /* Detailed View from User Reference Images */
        <RequestDetailView
          request={effectiveSelectedRequest}
          onBack={() => {
            setSelectedId(null);
            window.history.pushState({}, "", "/emergency-requests");
          }}
        />
      ) : (
        /* Main Emergency Requests Directory View */
        <>
          {/* 1. Exact Pixel-Accurate Hero Section */}
          <EmergencyRequestsHero
            onCreateClick={() => {
              setIsCreating(true);
              window.history.pushState({}, "", "/emergency-requests?action=create");
            }}
          />

          {/* 2. Interactive Directory of Verified Requests */}
          <EmergencyRequestsDirectory
            customRequests={customRequests}
            onSelectRequest={(req) => {
              setSelectedId(req.id);
              window.history.pushState(
                {},
                "",
                `/emergency-requests?code=${req.code}`
              );
            }}
          />
        </>
      )}
    </div>
  );
}

export default EmergencyRequestsPageContent;
