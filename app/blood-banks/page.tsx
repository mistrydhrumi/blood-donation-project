import BloodBankMap from "@/components/common/blood-bank-map";

export default function FindNearstBloodBankPage() {
  return (
    <div className="p-4 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 ">
      <h1 className=" text-lg md:text-2xl font-bold">
        Find Nearest Blood Banks
      </h1>
      <BloodBankMap />
    </div>
  );
}
