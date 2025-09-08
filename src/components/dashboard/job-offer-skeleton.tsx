import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

export function JobOfferCardSkeleton() {
    return (
        <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-32" /> {/* job title */}
                    <Skeleton className="h-5 w-16 rounded-full" /> {/* archived badge */}
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <Icons.briefcase className="h-4 w-4 text-muted-foreground" />
                        <Skeleton className="h-3 w-24" /> {/* company */}
                    </div>
                    <div className="flex items-center space-x-1">
                        <Icons.calendar className="h-4 w-4 text-muted-foreground" />
                        <Skeleton className="h-3 w-16" /> {/* date */}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8" /> {/* archive button */}
                <Skeleton className="h-8 w-8" /> {/* delete button */}
            </div>
        </div>
    )
}

export function JobOffersDisplaySkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <JobOfferCardSkeleton key={i} />
            ))}
        </div>
    )
}
