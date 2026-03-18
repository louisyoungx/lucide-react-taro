export default function InstallationPage() {
  return (
    <section className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold tracking-tight border-b pb-2">安装 (Installation)</h2>
      <div className="rounded-lg border bg-card p-6 shadow-sm overflow-x-auto">
        <pre className="text-sm font-mono">
          <code className="text-foreground">
{`npm install lucide-react-taro
# 或者
yarn add lucide-react-taro
# 或者
pnpm add lucide-react-taro`}
          </code>
        </pre>
      </div>
    </section>
  );
}