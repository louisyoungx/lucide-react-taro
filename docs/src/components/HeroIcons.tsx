import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react-taro";

// Filter out non-icon exports (like createIcon)
const RAW_ICONS = Object.entries(LucideIcons)
  .filter(
    ([name, icon]) =>
      (typeof icon === "function" || typeof icon === "object") &&
      /^[A-Z]/.test(name)
  )
  .map(([name, icon]) => ({ name, icon }));

// Shuffle the icons array to make the grid look more random and interesting
const SHUFFLED_ICONS = [...RAW_ICONS].sort(() => Math.random() - 0.5);

// Adjusted grid columns for denser side-panel layout: 8, 10, 12, 14 columns
// We don't actually need 840 icons. A smaller multiple of the LCM will suffice to fill the screen height.
// Let's use 280 (which is 840 / 3) to drastically reduce DOM nodes while still ensuring perfect grid alignment.
const TOTAL_ICONS = 280; 
const DISPLAY_ICONS = Array.from({ length: TOTAL_ICONS }, (_, i) => SHUFFLED_ICONS[i % SHUFFLED_ICONS.length]);

// Memoize the individual icon wrapper to prevent React from doing unnecessary diffing during any parent re-renders
const IconWrapper = memo(({ name, icon: IconComponent }: { name: string; icon: any }) => {
  const navigate = useNavigate();
  if (!IconComponent || typeof IconComponent !== 'function') return null;
  const Icon = IconComponent as React.FC<any>;
  return (
    <div 
      className="flex aspect-square w-7 items-center justify-center text-foreground/60 hover:text-foreground hover:scale-125 transition-all cursor-pointer"
      onClick={() => navigate(`/icons/${name}`)}
    >
      <Icon size={20} strokeWidth={1.5} />
    </div>
  );
});
IconWrapper.displayName = 'IconWrapper';

export function HeroIcons() {
  return (
    <div className="relative h-[300px] w-full overflow-hidden">
      {/* Top fade mask */}
      <div className="absolute top-0 left-0 right-0 z-10 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      
      {/* Scrolling content container */}
      <div className="absolute inset-0 flex justify-center overflow-hidden">
        <div className="w-full px-4 opacity-50 hover:opacity-80 transition-opacity duration-500">
          <div 
            className="flex flex-col animate-scroll-up items-center will-change-transform" 
            style={{ animationDuration: '60s' }}
          >
            {/* First Block */}
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-3 pb-3 pt-3 justify-center">
              {DISPLAY_ICONS.map((item, i) => (
                <IconWrapper key={`icon-a-${i}`} name={item.name} icon={item.icon} />
              ))}
            </div>

            {/* Second Block (Duplicate for seamless scrolling) */}
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-3 pb-3 justify-center">
              {DISPLAY_ICONS.map((item, i) => (
                <IconWrapper key={`icon-b-${i}`} name={item.name} icon={item.icon} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade mask */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none" />
    </div>
  );
}