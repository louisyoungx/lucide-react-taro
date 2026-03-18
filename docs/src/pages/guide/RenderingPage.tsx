export default function RenderingPage() {
  return (
    <section className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold tracking-tight border-b pb-2">渲染原理 (微信小程序端)</h2>
      <div className="prose prose-slate dark:prose-invert max-w-none text-foreground/90">
        <p className="mb-4">
          在微信小程序端，icon 不是用原生的 <code>{`<svg />`}</code> 渲染，而是将 SVG 字符串编码成 <code>data:image/svg+xml,...</code>，再用 Taro 的 <code>{`<Image />`}</code> 组件渲染。
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><code>className</code> 只作用在 <code>{`<Image />`}</code> 本身（用于布局、外边距、对齐等），不会作用到内部 SVG 的 stroke 或 fill。</li>
          <li>不要指望 <code>text-red-500</code> 之类的 class 去改变 icon 颜色。请使用 <code>color</code> 属性。</li>
        </ul>
      </div>
    </section>
  );
}