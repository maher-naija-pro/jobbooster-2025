import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

export function CVCardSkeleton() {
    return (
        <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
                <Icons.fileText className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                    <Skeleton className="h-4 w-32" /> {/* filename */}
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-3 w-20" /> {/* date */}
                        <Skeleton className="h-3 w-16" /> {/* status */}
                        <Skeleton className="h-3 w-12" /> {/* view count */}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-16" /> {/* view button */}
                <Skeleton className="h-8 w-8" /> {/* delete button */}
            </div>
        </div>
    )
}

export function CVDisplaySkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <CVCardSkeleton key={i} />
            ))}
        </div>
    )
}
