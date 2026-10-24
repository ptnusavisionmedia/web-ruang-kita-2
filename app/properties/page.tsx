import { Suspense } from "react";
import Catalog from "./Catalog";
import CatalogHeading from "@/components/CatalogHeading";
import { PropertyGridSkeleton } from "@/components/Skeleton";

export const metadata = { title: "Cari Properti — RuangKita" };

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <>
          <section className="bg-paper">
            <div className="mx-auto max-w-6xl px-5 py-14">
              <CatalogHeading />
            </div>
          </section>
          <div className="mx-auto max-w-6xl px-5 py-10">
            <PropertyGridSkeleton />
          </div>
        </>
      }
    >
      <Catalog />
    </Suspense>
  );
}
