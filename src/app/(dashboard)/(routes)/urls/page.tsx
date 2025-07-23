import React from "react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { BrandLogoGrid } from "@/components/dashboard/brand-logo-grid";
import logo1 from "../../../../../public/companies/a (1).png";
import logo2 from "../../../../../public/companies/a (2).png";
import logo3 from "../../../../../public/companies/a (3).png";
import logo4 from "../../../../../public/companies/a (4).png";
import logo5 from "../../../../../public/companies/a (5).png";
import logo6 from "../../../../../public/companies/a (6).png";

export default function URLsPage() {
  const brands = [
    {
      name: "KB HOME",
      logoSrc: logo1,
      href: "#",
    },
    {
      name: "NVR",
      logoSrc: logo2,
      href: "#",
    },
    {
      name: "LENNAR",
      logoSrc: logo3,
      href: "#",
    },
    {
      name: "RICHMOND AMERICAN HOMES",
      logoSrc: logo4,
      href: "#",
    },
    {
      name: "TRI POINTE HOMES",
      logoSrc: logo5,
      href: "#",
    },
    {
      name: "SMITH DOUGLAS HOMES",
      logoSrc: logo6,
      href: "#",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Lorem ipsum</h1>
      <BrandLogoGrid brands={brands} />
    </div>
  );
}
