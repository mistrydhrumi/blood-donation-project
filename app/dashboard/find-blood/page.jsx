import LocationMap from "@/components/common/map-box";
export default function FindNearstBloodBankPage() {
  return (
    <div className="p-4 w-full max-w-xxl  mx-auto">
      <h1 className=" text-lg md:text-2xl font-bold">Request New Blood</h1>
      <LocationMap />
    </div>
  );
}
