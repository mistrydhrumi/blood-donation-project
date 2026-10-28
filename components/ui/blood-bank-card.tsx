import { Checkbox } from "@/components/ui/checkbox";
import { Link2, MapPin } from "lucide-react";
import Link from "next/link";
interface BloodBank {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: string;
  distanceKm: number;
  mapsUrl: string;
}

interface BloodBankListProps {
  blood_bank: BloodBank;
  checked: boolean;
  onSelect: () => void;
}
export default function BloodBankCard({
  blood_bank,
  checked,
  onSelect,
}: BloodBankListProps) {
  return (
    <div
      className={`p-2 border-2  cursor-pointer border-gray-100 rounded-lg  flex gap-4 items-center ${checked ? " border border-red-400" : ""}`}
      onClick={onSelect}
    >
      <Checkbox
        checked={checked}
        onClick={(e) => e.stopPropagation()}
        onCheckedChange={() => onSelect()}
      />
      <div className="flex flex-col flex-1">
        <p className="font-semibold text-sm">{blood_bank?.name}</p>
        <p className="text-[10px] font-medium text-gray-400">
          {blood_bank?.address}
        </p>
        <div className="flex items-center gap-1 font-semibold py-0.5 mt-1 px-1 rounded-sm border border-gray-300  w-fit">
          <MapPin size={10} />
          <p className="text-[9px]">{blood_bank?.distanceKm} KM</p>
        </div>
      </div>
      <Link href={blood_bank.mapsUrl} target="_blank">
        <Link2 size={16} className="text-blue-600" />
      </Link>
    </div>
  );
}
