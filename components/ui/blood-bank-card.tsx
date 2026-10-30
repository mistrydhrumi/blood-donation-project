import { Checkbox } from "@/components/ui/checkbox";
import { Link2, MapPin, SquareArrowOutUpRight } from "lucide-react";
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
      className={`p-2 border  cursor-pointer border-gray-300   flex flex-col md:flex-row gap-4 rounded-lg ${checked ? " border border-red-400" : ""}`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-4 flex-1">
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
      </div>
      <div className="self-end md:self-start">
        <Link
          href={blood_bank.mapsUrl}
          target="_blank"
          className="flex items-center gap-1"
        >
          <span className="text-[10px] font-semibold text-blue-600">
            Open in Google map
          </span>
          <SquareArrowOutUpRight size={12} className="text-blue-600" />
        </Link>
      </div>
    </div>
  );
}
