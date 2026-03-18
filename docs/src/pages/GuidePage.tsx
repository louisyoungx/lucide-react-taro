import { Code } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Guide
        </h1>
        <p className="text-xl text-muted-foreground">
          Learn how to install, use, and optimize lucide-react-taro in your projects.
        </p>
      </div>

      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold tracking-tight border-b pb-2">Installation</h2>
        <div className="rounded-lg border bg-card p-6 shadow-sm overflow-x-auto">
          <pre className="text-sm font-mono">
            <code className="text-foreground">
{`npm install lucide-react-taro
# or
yarn add lucide-react-taro
# or
pnpm add lucide-react-taro`}
            </code>
          </pre>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold tracking-tight border-b pb-2">Rendering Mechanism</h2>
        <div className="prose prose-slate dark:prose-invert max-w-none text-foreground/90">
          <p className="mb-4">
            In Taro mini-programs, icons are not rendered using native <code>{`<svg />`}</code> elements. Instead, the SVG string is encoded into <code>data:image/svg+xml,...</code> and rendered using Taro's <code>{`<Image />`}</code> component.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><code>className</code> only applies to the <code>{`<Image />`}</code> wrapper (useful for layout, margins, etc.) and will not affect the inner SVG's stroke or fill.</li>
            <li>Do not use classes like <code>text-red-500</code> to change the icon color. Use the <code>color</code> prop instead.</li>
          </ul>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold tracking-tight border-b pb-2">Basic Usage</h2>
        
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-green-500">✅</span> Correct Examples
          </h3>
          <div className="rounded-lg border bg-card p-6 shadow-sm overflow-x-auto">
            <pre className="text-sm font-mono">
              <code className="text-foreground">
{`import { House, Settings, Camera, Zap, Heart } from 'lucide-react-taro';

function MyComponent() {
  return (
    <View>
      {/* Default size and color */}
      <House />
      
      {/* Custom size */}
      <Settings size={32} />
      
      {/* Custom color */}
      <Camera color="#ff0000" />
      
      {/* Advanced configuration */}
      <Zap size={48} color="#1890ff" strokeWidth={1.5} absoluteStrokeWidth />
      
      {/* Filled icon */}
      <Heart filled color="#ff3e98" />
      
      {/* Styling the wrapper Image */}
      <House className="my-icon" style={{ marginRight: 8 }} />
    </View>
  );
}`}
              </code>
            </pre>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-red-500">❌</span> Incorrect Example
          </h3>
          <p className="text-muted-foreground">Using text color classes will not affect the icon color.</p>
          <div className="rounded-lg border bg-card p-6 shadow-sm overflow-x-auto">
            <pre className="text-sm font-mono">
              <code className="text-foreground">
{`import { House } from 'lucide-react-taro';

function MyComponent() {
  return (
    <View>
      <House className="text-red-500 w-8 h-8" />
    </View>
  );
}`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold tracking-tight border-b pb-2">Tree Shaking</h2>
        <p className="text-foreground/90">
          The library is optimized for tree shaking. You can import from the main entry, and only the used icons will be bundled.
        </p>
        <div className="rounded-lg border bg-card p-6 shadow-sm overflow-x-auto">
          <pre className="text-sm font-mono">
            <code className="text-foreground">
{`// ✅ Recommended: Main entry import (Tree-shaking supported)
import { House, Settings, User } from 'lucide-react-taro';

// Optional: Direct import
import { House } from 'lucide-react-taro/icons/house';`}
            </code>
          </pre>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold tracking-tight border-b pb-2">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-4 px-4 font-semibold text-muted-foreground">Prop</th>
                <th className="py-4 px-4 font-semibold text-muted-foreground">Type</th>
                <th className="py-4 px-4 font-semibold text-muted-foreground">Default</th>
                <th className="py-4 px-4 font-semibold text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="text-foreground/90">
              <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 font-mono text-sm">size</td>
                <td className="py-4 px-4 text-sm">number | string</td>
                <td className="py-4 px-4 font-mono text-sm">24</td>
                <td className="py-4 px-4 text-sm">Icon size</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 font-mono text-sm">color</td>
                <td className="py-4 px-4 text-sm">string</td>
                <td className="py-4 px-4 font-mono text-sm">'currentColor'</td>
                <td className="py-4 px-4 text-sm">Icon color</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 font-mono text-sm">filled</td>
                <td className="py-4 px-4 text-sm">boolean</td>
                <td className="py-4 px-4 font-mono text-sm">false</td>
                <td className="py-4 px-4 text-sm">Render icon as filled</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 font-mono text-sm">strokeWidth</td>
                <td className="py-4 px-4 text-sm">number | string</td>
                <td className="py-4 px-4 font-mono text-sm">2</td>
                <td className="py-4 px-4 text-sm">Stroke width</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 font-mono text-sm">absoluteStrokeWidth</td>
                <td className="py-4 px-4 text-sm">boolean</td>
                <td className="py-4 px-4 font-mono text-sm">false</td>
                <td className="py-4 px-4 text-sm">Keep stroke width consistent when resizing</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 font-mono text-sm">className</td>
                <td className="py-4 px-4 text-sm">string</td>
                <td className="py-4 px-4 font-mono text-sm">-</td>
                <td className="py-4 px-4 text-sm">CSS class for the Image wrapper</td>
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 font-mono text-sm">style</td>
                <td className="py-4 px-4 text-sm">CSSProperties</td>
                <td className="py-4 px-4 font-mono text-sm">-</td>
                <td className="py-4 px-4 text-sm">Inline styles for the Image wrapper</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold tracking-tight border-b pb-2">CLI Tools</h2>
        
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-4">Generate TabBar Icons</h3>
            <p className="mb-4 text-foreground/90">
              WeChat Mini-Program TabBars do not support base64 or SVG images. You must use local PNG files. 
              We provide a CLI tool to generate these PNG icons automatically.
            </p>
            <div className="rounded-lg border bg-card p-6 shadow-sm overflow-x-auto">
              <pre className="text-sm font-mono">
                <code className="text-foreground">
{`# Generate a single icon
npx taro-lucide-tabbar House -c "#999999"

# Generate with active state color (Recommended)
npx taro-lucide-tabbar House -c "#999999" -a "#1890ff"

# Generate multiple icons
npx taro-lucide-tabbar House Settings User -c "#999999" -a "#1890ff"

# Specify output directory and size
npx taro-lucide-tabbar House -c "#999999" -o ./src/assets/tabbar -s 81`}
                </code>
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Find & Validate Icons</h3>
            <p className="mb-4 text-foreground/90">
              Useful tools for finding icons directly in your terminal, or validating them programmatically.
            </p>
            <div className="rounded-lg border bg-card p-6 shadow-sm overflow-x-auto">
              <pre className="text-sm font-mono">
                <code className="text-foreground">
{`# Fuzzy search
npx taro-lucide-find arrow

# Exact search
npx taro-lucide-find arrow-up --exact

# JSON output (Great for AI tools)
npx taro-lucide-find arrow-up user settings arw --json`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}