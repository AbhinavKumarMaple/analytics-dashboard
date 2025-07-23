import React from "react";
import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps {
  name: string;
  logoSrc: string;
  href: string;
}

const BrandLogoCard: React.FC<BrandLogoProps> = ({ name, logoSrc, href }) => {
  return (
    <Link href={href} className="flex flex-col items-start justify-center rounded-lg ">
      <div className="relative  transition-transform  duration-200 hover:-translate-y-1 hover:shadow-lg">
        <Image
          src={logoSrc}
          alt={`${name} Logo`}
          width={0}
          height={0}
          sizes="100vw"
          className="h-auto  w-auto object-contain shadow-md"
          priority
        />
      </div>
    </Link>
  );
};

interface BrandLogoGridProps {
  brands: {
    name: string;
    logoSrc: any;
    href: string;
  }[];
}

export const BrandLogoGrid: React.FC<BrandLogoGridProps> = ({ brands }) => {
  return (
    <div className="grid w-[70%] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {brands.map((brand, index) => (
        <BrandLogoCard key={index} name={brand.name} logoSrc={brand.logoSrc} href={brand.href} />
      ))}
    </div>
  );
};
