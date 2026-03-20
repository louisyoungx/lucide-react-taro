import { CodeBlock } from "@/components/ui/CodeBlock";

export default function UsagePage() {
  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">基础用法</h1>
        <p className="text-muted-foreground">如何在你的代码中使用图标组件及相关配置项。</p>
      </div>

      <section className="flex flex-col gap-6">
        
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-green-500">✅</span> 正确示例
          </h3>
          <CodeBlock
            language="tsx"
            code={`import { House, Settings, Camera, Zap, Heart } from 'lucide-react-taro';

function MyComponent() {
  return (
    <View>
      {/* 默认尺寸和颜色 */}
      <House />
      
      {/* 自定义尺寸 */}
      <Settings size={32} />
      
      {/* 自定义颜色 */}
      <Camera color="#ff0000" />
      
      {/* 进阶配置 */}
      <Zap size={48} color="#1890ff" strokeWidth={1.5} absoluteStrokeWidth />
      
      {/* 实心图标 */}
      <Heart filled color="#ff3e98" />
      
      {/* 为外层 Image 设置样式 */}
      <House className="my-icon" style={{ marginRight: 8 }} />
    </View>
  );
}`}
          />
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-red-500">❌</span> 错误示例
          </h3>
          <p className="text-muted-foreground">使用文本颜色相关的 class 并不会改变图标的颜色。</p>
          <CodeBlock
            language="tsx"
            code={`import { House } from 'lucide-react-taro';

function MyComponent() {
  return (
    <View>
      <House className="text-red-500 w-8 h-8" />
    </View>
  );
}`}
          />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight border-b pb-2">LucideTaroProvider（全局默认配置）</h2>
        <p className="text-foreground/90">
          由于小程序端 SVG 通过 Data URL 渲染，图标无法从 CSS 继承父元素的文字颜色（<code className="text-sm bg-muted px-1.5 py-0.5 rounded">currentColor</code> 会回退为黑色）。使用 <code className="text-sm bg-muted px-1.5 py-0.5 rounded">LucideTaroProvider</code> 可以为所有子组件设置默认颜色和尺寸，避免在每个图标上重复传递 props。
        </p>
        <CodeBlock
          language="tsx"
          code={`import { LucideTaroProvider, House, Settings, Camera } from 'lucide-react-taro';

function App() {
  return (
    // 所有子组件默认使用 #666 颜色和 20px 尺寸
    <LucideTaroProvider defaultColor="#666" defaultSize={20}>
      <House />              {/* 使用 #666, 20px */}
      <Settings color="red" /> {/* color prop 优先，使用 red */}
      <Camera size={32} />    {/* size prop 优先，使用 32px */}
    </LucideTaroProvider>
  );
}`}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 font-semibold text-muted-foreground">属性</th>
                <th className="py-3 px-4 font-semibold text-muted-foreground">类型</th>
                <th className="py-3 px-4 font-semibold text-muted-foreground">说明</th>
              </tr>
            </thead>
            <tbody className="text-foreground/90">
              <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 font-mono text-sm">defaultColor</td>
                <td className="py-3 px-4 text-sm">string</td>
                <td className="py-3 px-4 text-sm">子组件默认图标颜色</td>
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 font-mono text-sm">defaultSize</td>
                <td className="py-3 px-4 text-sm">number | string</td>
                <td className="py-3 px-4 text-sm">子组件默认图标尺寸</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4 text-sm text-foreground/80">
          <strong>优先级：</strong><code className="bg-muted px-1.5 py-0.5 rounded">color</code> prop &gt; <code className="bg-muted px-1.5 py-0.5 rounded">LucideTaroProvider defaultColor</code> &gt; 回退为黑色（#000）
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Tree Shaking (按需引入)</h2>
        <p className="text-foreground/90">
          本库针对 tree shaking 进行了优化。你可以直接从主入口导入，构建时只会打包你实际使用的图标。
        </p>
        <CodeBlock
          language="tsx"
          code={`// ✅ 推荐：主入口导入（已优化打包速度，支持 tree-shaking）
import { House, Settings, User } from 'lucide-react-taro';

// 可选：子路径导入（适合只用少量图标的场景）
import { House } from 'lucide-react-taro/icons/house';`}
        />
      </section>
    </div>
  );
}