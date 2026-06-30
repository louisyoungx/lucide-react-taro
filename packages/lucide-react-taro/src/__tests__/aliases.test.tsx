import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// index.ts pulls in create-icon, which imports @tarojs/components at module load.
vi.mock('@tarojs/components', () => ({
  Image: React.forwardRef((props: any, ref: any) =>
    React.createElement('img', { ref, ...props }),
  ),
}));

import * as Icons from '../index';
import {
  House,
  HouseIcon,
  X,
  XIcon,
  CircleX,
  CircleXIcon,
  Grid,
  Grid3x3,
  GridIcon,
  Grid3x3Icon,
} from '../index';

/** Exports that are not icons and therefore have no `Icon`-suffixed sibling. */
const NON_ICON = new Set([
  'createIcon',
  'LucideTaroProvider',
  'LUCIDE_VERSION',
  'LUCIDE_COMMIT',
]);

describe('Icon-suffix aliases (lucide-react parity)', () => {
  it('exports every canonical icon with an identical `Icon`-suffixed alias', () => {
    // `HouseIcon === House` — same component reference, not a copy.
    expect(HouseIcon).toBe(House);
    expect(XIcon).toBe(X);
    expect(CircleXIcon).toBe(CircleX);
    expect(Grid3x3Icon).toBe(Grid3x3);
  });

  it('suffixes semantic aliases too, pointing at the canonical component', () => {
    expect(Grid).toBe(Grid3x3); // existing semantic alias
    expect(GridIcon).toBe(Grid3x3); // its `Icon`-suffixed form resolves to the canonical
  });

  it('every base export has exactly one matching `Icon` suffix referencing the same value', () => {
    const all = Icons as Record<string, unknown>;
    const names = Object.keys(all);
    const bases = names.filter(n => !NON_ICON.has(n) && !n.endsWith('Icon'));
    const suffixed = names.filter(n => !NON_ICON.has(n) && n.endsWith('Icon'));

    // Sanity floor: keeps the equality below from passing vacuously — e.g. a
    // generator regression that dropped the whole icon set would satisfy 0 === 0.
    expect(bases.length).toBeGreaterThan(1700);
    // Completeness: one suffix per base (canonical icons + semantic aliases).
    expect(suffixed.length).toBe(bases.length);

    // Correctness: each suffixed name strips to an existing base with the same value.
    for (const s of suffixed) {
      const base = s.slice(0, -'Icon'.length);
      expect(all[base], `${s} should strip to an existing export "${base}"`).toBeDefined();
      expect(all[s], `${s} should be identical to ${base}`).toBe(all[base]);
    }
  });
});
