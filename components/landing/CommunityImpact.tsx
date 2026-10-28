import React from "react";

export interface ImpactStat {
  value: string;
  label: string;
}

const IMPACT_STATS: ImpactStat[] = [
  {
    value: "18.4K",
    label: "Donor connections",
  },
  {
    value: "6.2K",
    label: "Requests fulfilled",
  },
  {
    value: "42",
    label: "Cities reached",
  },
];

export function CommunityImpact() {
  return (
    <section className="w-full bg-[#172033] py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Heading and Context */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#E05252] block mb-3">
              OUR COMMUNITY IMPACT
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-white tracking-tight leading-[1.15] mb-4">
              Small acts. Measurable <br className="hidden sm:inline" />
              hope.
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed max-w-sm">
              Illustrative platform metrics shown for design purposes.
            </p>
          </div>

          {/* Right Column: Key Statistics with Dividers */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 sm:gap-6 lg:gap-8 pt-4 lg:pt-0">
            {IMPACT_STATS.map((stat, index) => (
              <React.Fragment key={stat.label}>
                <div className="flex flex-col">
                  <span className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-none mb-2">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 font-normal">
                    {stat.label}
                  </span>
                </div>

                {/* Vertical Divider Line between stats */}
                {index < IMPACT_STATS.length - 1 && (
                  <div
                    className="hidden sm:block w-[1px] h-14 bg-white/10 shrink-0"
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CommunityImpact;
