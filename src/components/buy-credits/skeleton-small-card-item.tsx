import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonSmallPaymentCard() {
  return (
    <div className="px-5 py-3 bg-container_light rounded-lg flex">
      <div className="flex gap-4 items-center">
        <Skeleton className="w-6 h-6 rounded-full" /> {/* Placeholder for the checkbox */}
        <div className="flex gap-3">
          <Skeleton className="rounded-lg w-[41px] h-6" /> {/* Placeholder for the card icon */}
          <Skeleton className="h-4 w-[100px]" /> {/* Placeholder for the card ending text */}
        </div>
      </div>
      <div className="ml-auto flex space-x-1 items-center">
        <Skeleton className="h-4 w-[80px]" /> {/* Placeholder for "Billing Zip Code:" text */}
        <Skeleton className="h-4 w-[40px]" /> {/* Placeholder for the zip code */}
      </div>
    </div>
  );
}
