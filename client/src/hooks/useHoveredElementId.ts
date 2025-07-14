import { useEffect, useRef, useState, useCallback } from "react";

type UseHoveredElementIdResult = {
    hoveredId: string | null;
    setHoveredId: (id: string | null) => void;
    reevaluateHoveredId: () => void;
};

export function useHoveredElementId(dataAttribute: string): UseHoveredElementIdResult {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const mousePosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePosition.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const reevaluateHoveredId = useCallback(() => {
        const el = document.elementFromPoint(mousePosition.current.x, mousePosition.current.y);
        const container = el?.closest(`[${dataAttribute}]`) as HTMLElement | null;
        const id = container?.getAttribute(dataAttribute) || null;
        setHoveredId(id);
    }, [dataAttribute]);

    return { hoveredId, setHoveredId, reevaluateHoveredId };
}
