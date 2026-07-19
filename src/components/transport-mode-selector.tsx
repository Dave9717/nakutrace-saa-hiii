import { useState } from "react";
import { Footprints, Car, Bike, Truck, Navigation, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export type TransportMode = "walk" | "car" | "bike" | "heavy-4x4" | "enduro" | "safari";

interface TransportModeSelectorProps {
  onModeChange?: (mode: TransportMode) => void;
  defaultMode?: TransportMode;
}

const modes: Array<{
  id: TransportMode;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}> = [
  {
    id: "walk",
    icon: <Footprints className="h-4 w-4" />,
    label: "Walk",
    description: "On foot",
    color: "text-blue-400",
  },
  {
    id: "car",
    icon: <Car className="h-4 w-4" />,
    label: "Car",
    description: "Standard vehicle",
    color: "text-green-400",
  },
  {
    id: "bike",
    icon: <Bike className="h-4 w-4" />,
    label: "Bike",
    description: "Two-wheeler",
    color: "text-yellow-400",
  },
  {
    id: "heavy-4x4",
    icon: <Truck className="h-4 w-4" />,
    label: "Heavy 4x4",
    description: "Off-road capable",
    color: "text-orange-400",
  },
  {
    id: "enduro",
    icon: <Zap className="h-4 w-4" />,
    label: "Enduro",
    description: "Rugged trail",
    color: "text-red-400",
  },
  {
    id: "safari",
    icon: <Navigation className="h-4 w-4" />,
    label: "Safari",
    description: "Expedition mode",
    color: "text-purple-400",
  },
];

export function TransportModeSelector({
  onModeChange,
  defaultMode = "car",
}: TransportModeSelectorProps) {
  const [activeMode, setActiveMode] = useState<TransportMode>(defaultMode);

  const handleModeSelect = (mode: TransportMode) => {
    setActiveMode(mode);
    onModeChange?.(mode);
  };

  return (
    <div className="pointer-events-auto flex gap-1 rounded-full border border-border bg-card/90 p-1 shadow-lg backdrop-blur">
      {modes.map((mode) => {
        const isActive = activeMode === mode.id;
        return (
          <Button
            key={mode.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => handleModeSelect(mode.id)}
            className={`gap-1.5 rounded-full transition-all ${
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title={mode.description}
          >
            {mode.icon}
            <span className="hidden sm:inline">{mode.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

/**
 * Standalone transport mode bar component for use in floating UI
 */
export function TransportModeBar({ onModeChange }: { onModeChange?: (mode: TransportMode) => void }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
      <TransportModeSelector onModeChange={onModeChange} />
    </div>
  );
}
