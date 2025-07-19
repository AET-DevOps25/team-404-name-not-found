import { AvailabilityScore } from "@/types/availabilityScore";
import { Badge } from "@/components/ui/badge";

interface AvailabilityBadgeProps {
    score?: AvailabilityScore;
}

const AvailabilityBadge = ({ score }: AvailabilityBadgeProps) => {
    if (!score) return null;

    const colors = {
        good: "bg-green-100 text-green-800 border-green-200",
        medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
        bad: "bg-red-100 text-red-800 border-red-200",
    };

    const labels = {
        good: "All ingredients",
        medium: "Most ingredients",
        bad: "Missing ingredients",
    };

    return (
        <Badge variant="outline" className={colors[score as keyof typeof colors]}>
            {labels[score as keyof typeof labels]}
        </Badge>
    );
};

export default AvailabilityBadge;
