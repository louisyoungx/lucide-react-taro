export default function UsagePage() {
  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold tracking-tight border-b pb-2">基础用法</h2>
        
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-green-500">✅</span> 正确示例
          </h3>
          <div className="rounded-lg border bg-card p-6 shadow-sm overflow-x-auto">
            <pre className="text-sm font-mono">
              <code className="text-foreground">
{`import { House, Settings, Camera, Zap, Heart } from 'lucide-react-taro';

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
              </code>
            </pre>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-red-500">❌</span> 错误示例
          </h3>
          <p className="text-muted-foreground">使用文本颜色相关的 class 并不会改变图标的颜色。</p>
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
        <h2 className="text-3xl font-bold tracking-tight border-b pb-2">Tree Shaking (按需引入)</h2>
        <p className="text-foreground/90">
          本库针对 tree shaking 进行了优化。你可以直接从主入口导入，构建时只会打包你实际使用的图标。
        </p>
        <div className="rounded-lg border bg-card p-6 shadow-sm overflow-x-auto">
          <pre className="text-sm font-mono">
            <code className="text-foreground">
{`// ✅ 推荐：主入口导入（已优化打包速度，支持 tree-shaking）
import { House, Settings, User } from 'lucide-react-taro';

// 可选：子路径导入（适合只用少量图标的场景）
import { House } from 'lucide-react-taro/icons/house';`}
            </code>
          </pre>
        </div>
      </section>
    </div>
  );
}