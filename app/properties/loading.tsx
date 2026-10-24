import { PropertyGridSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <PropertyGridSkeleton />
    </div>
  );
}
