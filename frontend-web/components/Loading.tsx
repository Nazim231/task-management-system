import { LoaderCircleIcon } from "lucide-react"

export function Loading() {
    return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
            <LoaderCircleIcon />
        </div>
    </div>
}