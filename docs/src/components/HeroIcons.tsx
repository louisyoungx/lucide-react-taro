import React from "react";
import * as LucideIcons from "lucide-react-taro";

// Filter out non-icon exports (like createLucideIcon)
const RAW_ICONS = Object.values(LucideIcons).filter(
  (icon) => typeof icon === "function" || typeof icon === "object"
);

// Shuffle the icons array to make the grid look more random and interesting
const SHUFFLED_ICONS = [...RAW_ICONS].sort(() => Math.random() - 0.5);

// Adjusted grid columns for denser side-panel layout: 8, 10, 12, 14 columns
// LCM of 8, 10, 12, 14 is 840
const TOTAL_ICONS = 840; 
const DISPLAY_ICONS = Array.from({ length: TOTAL_ICONS }, (_, i) => SHUFFLED_ICONS[i % SHUFFLED_ICONS.length]);

export function HeroIcons() {
  return (
    <div className="relative h-[300px] w-full overflow-hidden">
      {/* Top fade mask */}
      <div className="absolute top-0 left-0 right-0 z-10 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      
      {/* Scrolling content container */}
      <div className="absolute inset-0 flex justify-center overflow-hidden">
        <div className="w-full px-4 opacity-50 hover:opacity-80 transition-opacity duration-500">
          <div 
            className="flex flex-col animate-scroll-up items-center" 
            style={{ animationDuration: '120s' }}
          >
            {/* First Block */}
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-3 pb-3 pt-3 justify-center">
              {DISPLAY_ICONS.map((IconComponent, i) => {
                if (!IconComponent || typeof IconComponent !== 'function' || !/^[A-Z]/.test(IconComponent.name)) return null;
                const Icon = IconComponent as React.FC<any>;
                return (
                  <div 
                    key={`icon-a-${i}`} 
                    className="flex aspect-square w-7 items-center justify-center text-foreground/60 hover:text-foreground hover:scale-125 transition-all cursor-pointer"
                  >
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                );
              })}
            </div>

            {/* Second Block (Duplicate for seamless scrolling) */}
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-3 pb-3 justify-center">
              {DISPLAY_ICONS.map((IconComponent, i) => {
                if (!IconComponent || typeof IconComponent !== 'function' || !/^[A-Z]/.test(IconComponent.name)) return null;
                const Icon = IconComponent as React.FC<any>;
                return (
                  <div 
                    key={`icon-b-${i}`} 
                    className="flex aspect-square w-7 items-center justify-center text-foreground/60 hover:text-foreground hover:scale-125 transition-all cursor-pointer"
                  >
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade mask */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none" />
    </div>
  );
}