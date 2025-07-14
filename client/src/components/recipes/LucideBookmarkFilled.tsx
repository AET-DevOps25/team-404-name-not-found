import { cn } from "@/lib/utils";

interface LucideBookmarkFilledProps {
    className?: string;
}

export const LucideBookmarkFilled = ({ className }: LucideBookmarkFilledProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className={cn("lucide lucide-bookmark", className)}
            aria-hidden="true"
        >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
        </svg>
    );
};
