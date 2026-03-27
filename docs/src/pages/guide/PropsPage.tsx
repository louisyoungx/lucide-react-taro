import { GuidePager } from "@/components/guide/GuidePager";

export default function PropsPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">属性 (Props)</h1>
        <p className="text-muted-foreground">组件支持的配置属性及详细说明。</p>
      </div>
      
      <section className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-4 px-4 font-semibold text-muted-foreground">属性</th>
              <th className="py-4 px-4 font-semibold text-muted-foreground">类型</th>
              <th className="py-4 px-4 font-semibold text-muted-foreground">默认值</th>
              <th className="py-4 px-4 font-semibold text-muted-foreground">说明</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
              <td className="py-4 px-4 font-mono text-sm">size</td>
              <td className="py-4 px-4 text-sm">number | string</td>
              <td className="py-4 px-4 font-mono text-sm">24</td>
              <td className="py-4 px-4 text-sm">图标尺寸</td>
            </tr>
            <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
              <td className="py-4 px-4 font-mono text-sm">color</td>
              <td className="py-4 px-4 text-sm">string</td>
              <td className="py-4 px-4 font-mono text-sm">-</td>
              <td className="py-4 px-4 text-sm">图标颜色（未设置时回退为黑色）</td>
            </tr>
            <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
              <td className="py-4 px-4 font-mono text-sm">filled</td>
              <td className="py-4 px-4 text-sm">boolean</td>
              <td className="py-4 px-4 font-mono text-sm">false</td>
              <td className="py-4 px-4 text-sm">是否渲染为实心模式</td>
            </tr>
            <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
              <td className="py-4 px-4 font-mono text-sm">strokeWidth</td>
              <td className="py-4 px-4 text-sm">number | string</td>
              <td className="py-4 px-4 font-mono text-sm">2</td>
              <td className="py-4 px-4 text-sm">描边宽度</td>
            </tr>
            <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
              <td className="py-4 px-4 font-mono text-sm">absoluteStrokeWidth</td>
              <td className="py-4 px-4 text-sm">boolean</td>
              <td className="py-4 px-4 font-mono text-sm">false</td>
              <td className="py-4 px-4 text-sm">启用后，缩放尺寸时保持绝对的描边宽度不变</td>
            </tr>
            <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
              <td className="py-4 px-4 font-mono text-sm">className</td>
              <td className="py-4 px-4 text-sm">string</td>
              <td className="py-4 px-4 font-mono text-sm">-</td>
              <td className="py-4 px-4 text-sm">作用于外层 Image 组件的 CSS class</td>
            </tr>
            <tr className="hover:bg-muted/50 transition-colors">
              <td className="py-4 px-4 font-mono text-sm">style</td>
              <td className="py-4 px-4 text-sm">CSSProperties</td>
              <td className="py-4 px-4 font-mono text-sm">-</td>
              <td className="py-4 px-4 text-sm">作用于外层 Image 组件的内联样式</td>
            </tr>
          </tbody>
        </table>
      </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">强制要求 color 和 size（全局配置）</h2>
        <p className="text-muted-foreground">
          如果你希望在项目中强制要求每个图标都必须传递 <code className="text-sm bg-muted px-1.5 py-0.5 rounded">color</code> 和 <code className="text-sm bg-muted px-1.5 py-0.5 rounded">size</code> 属性（避免遗漏导致样式不一致），你可以通过 TypeScript 的 Module Augmentation（模块增强）来实现：
        </p>
        <div className="rounded-lg border bg-muted/30 p-4">
          <pre className="text-sm overflow-x-auto"><code>{`// 在你的项目类型声明文件（如 global.d.ts 或 taro-env.d.ts）中添加：
export {};
declare module 'lucide-react-taro' {
  interface LucideTaroConfig {
    strictProps: true;
  }
}`}</code></pre>
        </div>
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4 text-sm text-foreground/80">
          <strong>注意：</strong>文件中必须包含 <code className="bg-muted px-1.5 py-0.5 rounded">export {'{}'}</code> 使其成为模块文件，否则 TypeScript 会将 <code className="bg-muted px-1.5 py-0.5 rounded">declare module</code> 视为完整的模块声明而非模块增强，导致原有导出（如 <code className="bg-muted px-1.5 py-0.5 rounded">House</code>、<code className="bg-muted px-1.5 py-0.5 rounded">Settings</code> 等）丢失。
        </div>
        <p className="text-muted-foreground">
          配置后，如果使用图标时不传入 <code className="text-sm bg-muted px-1.5 py-0.5 rounded">color</code> 或 <code className="text-sm bg-muted px-1.5 py-0.5 rounded">size</code>，TypeScript 将会报错。
        </p>
      </section>

      <GuidePager
        previous={{ title: "基础用法", href: "/guide/usage" }}
        next={{ title: "CLI 工具", href: "/guide/cli" }}
      />
    </div>
  );
}
