import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ReactNode, FC } from "react";

type IconButtonWithTooltipProps = {
    onClick?: () => void;
    disabled?: boolean;
    tooltip: string;
    children: ReactNode;
    ariaLabel?: string;
    className?: string;
};

export const IconButtonWithTooltip: FC<IconButtonWithTooltipProps> = ({
    onClick,
    disabled = false,
    tooltip,
    children,
    ariaLabel = tooltip,
    className = "",
}) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                onClick={onClick}
                disabled={disabled}
                aria-label={ariaLabel}
                tabIndex={-1}
                className={`text-gray-600 hover:text-gray-900 ${className}`}
            >
                {children}
            </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{tooltip}</TooltipContent>
    </Tooltip>
);
