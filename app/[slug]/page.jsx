import { HeartPulse } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-48 gap-2">
      <HeartPulse size={28} className="text-red-500" />
      <h1 className="text-xl text-red-500 font-semibold">Page not found</h1>
    </div>
  );
}
