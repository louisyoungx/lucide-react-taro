export default function PropsPage() {
  return (
    <section className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold tracking-tight border-b pb-2">属性 (Props)</h2>
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
              <td className="py-4 px-4 font-mono text-sm">'currentColor'</td>
              <td className="py-4 px-4 text-sm">图标颜色</td>
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
  );
}