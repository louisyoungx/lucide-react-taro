import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as LucideIcons from "lucide-react-taro";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ArrowLeft } from "lucide-react";

export default function IconDetailPage() {
  const { iconName } = useParams();
  // @ts-ignore
  const Icon = iconName ? LucideIcons[iconName] : null;

  const [size, setSize] = useState(48);
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [filled, setFilled] = useState(false);

  const presetColors = [
    "#000000", // Black
    "#ef4444", // Red 500
    "#f97316", // Orange 500
    "#eab308", // Amber 500
    "#22c55e", // Yellow 500
    "#84cc16", // Lime 500
    "#10b981", // Emerald 500
    "#14b8a6", // Teal 500
    "#06b6d4", // Cyan 500
    "#0ea5e9", // Sky 500
    "#3b82f6", // Blue 500
    "#6366f1", // Indigo 500
    "#8b5cf6", // Violet 500
    "#a855f7", // Purple 500
    "#d946ef", // Fuchsia 500
  ];

  if (!Icon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-2xl font-bold">未找到图标</h2>
        <Link to="/icons">
          <Button>返回全部图标</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-6 max-w-5xl mx-auto">
      <div>
        <Link to="/icons">
          <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> 返回全部图标
          </Button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 flex items-center justify-center min-h-[400px] rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm">
          <Icon size={size} color={color} strokeWidth={strokeWidth} filled={filled} />
        </div>

        <div className="flex-1 flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">{iconName}</h1>
            <p className="text-muted-foreground">在下方自定义图标的外观。</p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">尺寸 (Size)</label>
                <span className="text-sm text-muted-foreground">{size}px</span>
              </div>
              <input 
                type="range" 
                min="16" 
                max="240" 
                value={size} 
                onChange={(e) => setSize(Number(e.target.value))}
                className="flex h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">线条粗细 (Stroke Width)</label>
                <span className="text-sm text-muted-foreground">{strokeWidth}px</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="3" 
                step="0.25"
                value={strokeWidth} 
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="flex h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">颜色 (Color)</label>
              <div className="flex gap-3">
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border shadow-sm aspect-square">
                  <input 
                    type="color" 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute -top-2 -left-2 h-16 w-16 cursor-pointer border-0 p-0"
                  />
                </div>
                <input 
                  type="text" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 uppercase"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {presetColors.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setColor(preset)}
                    className="h-6 w-6 rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-transform hover:scale-110"
                    style={{ backgroundColor: preset }}
                    title={preset}
                    aria-label={`Select color ${preset}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="filled"
                checked={filled}
                onCheckedChange={setFilled}
              />
              <label
                htmlFor="filled"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                填充 (Filled)
              </label>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 relative group min-h-[218px]">
            <div className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">代码示例</div>
            <CodeBlock
              language="tsx"
              code={`import { ${iconName} } from 'lucide-react-taro';

<${iconName} 
  size={${size}} 
  color="${color}" 
  strokeWidth={${strokeWidth}}${filled ? '\n  filled' : ''} 
/>`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
