export default function RenderingPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">渲染原理</h1>
        <p className="text-muted-foreground">了解在微信小程序端渲染 SVG 图标的底层机制与限制。</p>
      </div>
      
      <section className="flex flex-col gap-4">
      <div className="text-foreground/90 leading-relaxed">
        <p className="mb-4">
          在微信小程序环境中，图标并非通过原生的 <code className="relative rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">{`<svg />`}</code> 标签进行渲染。为了兼容小程序平台，底层会将 SVG 转换为 <code className="relative rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">data:image/svg+xml</code> 格式的字符串，并交由 Taro 的 <code className="relative rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">{`<Image />`}</code> 组件来展示。
        </p>
        <p className="mb-2 font-medium">基于上述实现原理，请注意以下几点：</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>传入的 <code className="relative rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">className</code> 仅会作用于外层的 <code className="relative rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">{`<Image />`}</code> 组件，通常只能用于控制外边距、对齐等布局样式，无法穿透修改内部 SVG 的线条 (<code className="relative rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">stroke</code>) 或填充 (<code className="relative rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">fill</code>)。</li>
          <li>因此，无法通过类似 <code className="relative rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">text-red-500</code> 这样的文本颜色类名来更改图标颜色。若需调整图标颜色，请直接使用组件提供的 <code className="relative rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">color</code> 属性。</li>
        </ul>
      </div>
      </section>
    </div>
  );
}