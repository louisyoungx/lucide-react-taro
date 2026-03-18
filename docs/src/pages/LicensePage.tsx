export default function LicensePage() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight">License</h1>
        <p className="text-lg text-muted-foreground">
          MIT & ISC Licenses
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p>
          This project (lucide-react-taro) is a wrapper for Lucide icons to support Taro framework.
          The LICENSE below is copied from the original Lucide project (<a href="https://github.com/lucide-icons/lucide" target="_blank" rel="noreferrer" className="text-primary hover:underline">https://github.com/lucide-icons/lucide</a>).
          All copyrights belong to Lucide and its contributors.
        </p>

        <hr className="my-8 border-border" />

        <h3 className="text-2xl font-bold mt-8 mb-4">ISC License</h3>
        <p className="mb-4">
          Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
        </p>
        <p className="mb-4">
          Permission to use, copy, modify, and/or distribute this software for any
          purpose with or without fee is hereby granted, provided that the above
          copyright notice and this permission notice appear in all copies.
        </p>
        <p className="mb-4">
          THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
          WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
          MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
          ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
          WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
          ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
          OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
        </p>

        <hr className="my-8 border-border" />

        <h3 className="text-2xl font-bold mt-8 mb-4">The MIT License (MIT) (for portions derived from Feather)</h3>
        <p className="mb-4">
          Copyright (c) 2013-2026 Cole Bemis
        </p>
        <p className="mb-4">
          Permission is hereby granted, free of charge, to any person obtaining a copy
          of this software and associated documentation files (the "Software"), to deal
          in the Software without restriction, including without limitation the rights
          to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
          copies of the Software, and to permit persons to whom the Software is
          furnished to do so, subject to the following conditions:
        </p>
        <p className="mb-4">
          The above copyright notice and this permission notice shall be included in all
          copies or substantial portions of the Software.
        </p>
        <p className="mb-4">
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
          IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
          AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
          LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
          OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
          SOFTWARE.
        </p>
      </div>
    </div>
  );
}