import React from "react";
import Image from "next/image";

export function LogoCloud() {
  const brandLogos = [
    { name: "Citizens Bank", src: "/sites/spade/citizens.png" },
    { name: "Cardless", src: "/sites/spade/cardless-logo.png" },
    { name: "Cash App Pay", src: "/sites/spade/cashapppay-black-e1772810522146.png" },
    { name: "Motive", src: "/sites/spade/Motive-logo.webp" },
    { name: "Bilt Rewards", src: "/sites/spade/bilt.png" },
    { name: "Coast", src: "/sites/spade/coast.png" },
    { name: "Mercury", src: "/sites/spade/mercury.svg" },
  ];

  return (
    <section className="py-14 border-y border-spade-sage-3/60 bg-spade-sage-1/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-center text-xs sm:text-sm font-semibold tracking-wider text-stone-500 uppercase max-w-2xl mx-auto mb-10 leading-relaxed">
          Enriching billions of transactions for category-defining fintechs &amp; Fortune 500 banks every month
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16 opacity-85">
          {brandLogos.map((brand, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200 h-9 px-2"
            >
              <Image
                src={brand.src}
                alt={brand.name}
                width={130}
                height={32}
                className="max-h-7 sm:max-h-8 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
