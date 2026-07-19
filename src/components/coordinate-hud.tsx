import { useEffect, useState } from "react";
import { formatCoordinates, formatBearing, bearingToCardinal } from "@/lib/map-utils";

interface CoordinateHUDProps {
  latitude?: number;
  longitude?: number;
  bearing?: number;
  altitude?: number;
  accuracy?: number;
}

export function CoordinateHUD({
  latitude = -0.3869,
  longitude = 37.6869,
  bearing = 340,
  altitude = 1673,
  accuracy = 5,
}: CoordinateHUDProps) {
  const [displayBearing, setDisplayBearing] = useState(bearing);
  const [isPulsing, setIsPulsing] = useState(false);

  // Simulate GPS updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayBearing((prev) => (prev + 0.5) % 360);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const cardinal = bearingToCardinal(displayBearing);
  const formattedCoords = formatCoordinates(latitude, longitude);
  const formattedBearing = formatBearing(displayBearing);

  return (
    <div className="pointer-events-auto absolute bottom-6 left-6 z-10 space-y-2">
      {/* GPS Coordinates Display */}
      <div className="flex flex-col gap-2">
        {/* Main coordinate box */}
        <div
          className="rounded-lg border border-[#4ade80]/40 bg-black/70 px-4 py-3 font-mono text-xs backdrop-blur-sm"
          style={{
            boxShadow: "0 0 20px rgba(74, 222, 128, 0.15), inset 0 0 10px rgba(74, 222, 128, 0.05)",
          }}
        >
          <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#4ade80]/70">GPS Position</div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-[#4ade80]">LAT</span>
              <span className="text-[#00ff00] tracking-wide">{latitude.toFixed(4)}°</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[#4ade80]">LON</span>
              <span className="text-[#00ff00] tracking-wide">{longitude.toFixed(4)}°</span>
            </div>
          </div>

          {/* Accuracy indicator */}
          <div className="mt-2 border-t border-[#4ade80]/20 pt-2">
            <div className="flex items-baseline justify-between text-[10px]">
              <span className="text-[#4ade80]/70">ACCURACY</span>
              <span className="text-[#00ff00]">{accuracy}m</span>
            </div>
          </div>
        </div>

        {/* Compass/Bearing Box */}
        <div
          className="rounded-lg border border-[#ff8c42]/40 bg-black/70 px-4 py-3 font-mono text-xs backdrop-blur-sm"
          style={{
            boxShadow: "0 0 20px rgba(255, 140, 66, 0.15), inset 0 0 10px rgba(255, 140, 66, 0.05)",
          }}
        >
          <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#ff8c42]/70">Bearing</div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-lg font-bold text-[#ff8c42] tracking-wide">{Math.round(displayBearing)}°</div>
              <div className="mt-1 text-[11px] text-[#ff8c42]/80">{cardinal}</div>
            </div>

            {/* Mini compass rose */}
            <div
              className="relative ml-3 h-10 w-10 rounded-full border border-[#ff8c42]/30 bg-black/50"
              style={{
                background: "radial-gradient(circle, rgba(255, 140, 66, 0.1) 0%, rgba(0, 0, 0, 0.5) 100%)",
              }}
            >
              {/* N indicator */}
              <div className="absolute inset-x-0 top-1 text-center text-[8px] font-bold text-[#ff8c42]">N</div>

              {/* Rotating needle */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `rotate(${displayBearing}deg)`,
                }}
              >
                <div className="h-3 w-0.5 bg-[#ff8c42]" />
              </div>
            </div>
          </div>
        </div>

        {/* Altitude Box */}
        <div
          className="rounded-lg border border-[#60a5fa]/40 bg-black/70 px-4 py-2 font-mono text-xs backdrop-blur-sm"
          style={{
            boxShadow: "0 0 15px rgba(96, 165, 250, 0.1), inset 0 0 8px rgba(96, 165, 250, 0.03)",
          }}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-[#60a5fa]/70">ALTITUDE</span>
            <span className="text-[#00ff00]">{altitude}m</span>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex gap-1">
        {/* GPS Lock indicator */}
        <div
          className="rounded border border-[#4ade80]/30 bg-black/50 px-2 py-1 text-[9px] font-mono uppercase tracking-wider text-[#4ade80]"
          style={{
            boxShadow: "0 0 8px rgba(74, 222, 128, 0.2)",
          }}
        >
          <span
            className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#4ade80]"
            style={{
              animation: "pulse 1s infinite",
            }}
          />
          GPS LOCK
        </div>

        {/* Network status */}
        <div className="rounded border border-[#9333ea]/30 bg-black/50 px-2 py-1 text-[9px] font-mono uppercase tracking-wider text-[#c084fc]">
          OFFLINE
        </div>

        {/* Data integrity */}
        <div className="rounded border border-[#fbbf24]/30 bg-black/50 px-2 py-1 text-[9px] font-mono uppercase tracking-wider text-[#fcd34d]">
          OK
        </div>
      </div>

      {/* Scan lines effect (CSS-only animation) */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(2px); }
        }
        
        .coordinate-hud-scanlines::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 2px,
            transparent 2px,
            transparent 4px
          );
          pointer-events: none;
          animation: scanlines 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
