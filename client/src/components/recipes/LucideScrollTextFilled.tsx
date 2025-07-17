import { cn } from "@/lib/utils";

interface LucideScrollTextFilledProps {
    className?: string;
}

export const LucideScrollTextFilled = ({ className }: LucideScrollTextFilledProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("lucide lucide-scroll-text", className)}
            aria-hidden="true"
        >
            <path fill="currentColor" d="M 19 17 V 5 a 2 2 0 0 0 -2 -2 H 4"></path>
            <path stroke="none" fill="currentColor" d="M 19 17 H 6 L 5.998 4.333"></path>
            <path
                stroke="none"
                fill="currentColor"
                d="M 5.998 16.477 L 9.511 16.455 L 9.468 20.118 L 5.956 20.096"
            ></path>
            <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"></path>
            <path stroke="white" d="M15 12h-5"></path>
            <path stroke="white" d="M15 8h-5"></path>
        </svg>
    );
};
