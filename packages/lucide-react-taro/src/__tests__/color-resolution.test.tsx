import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { createIcon, resolveIconColor } from '../create-icon';
import { LucideTaroProvider } from '../context';

vi.mock('@tarojs/components', () => ({
  Image: React.forwardRef(({ src, className, style, ...props }: any, ref) => (
    <img ref={ref} src={src} className={className} style={style} data-testid="icon-image" {...props} />
  )),
}));

describe('resolveIconColor', () => {
  it('passes a literal hex color through unchanged', () => {
    expect(resolveIconColor('#ff0000', {})).toBe('#ff0000');
  });

  it('passes rgb() and named colors through unchanged', () => {
    expect(resolveIconColor('rgb(1, 2, 3)', {})).toBe('rgb(1, 2, 3)');
    expect(resolveIconColor('red', {})).toBe('red');
  });

  it('returns falsy input unchanged', () => {
    expect(resolveIconColor(undefined, {})).toBeUndefined();
    expect(resolveIconColor('', {})).toBe('');
  });

  it('resolves a themeColors token to its literal color', () => {
    expect(resolveIconColor('primary', { themeColors: { primary: '#00b9ca' } })).toBe('#00b9ca');
  });

  it('resolves var(--color-primary) via cssVars keyed with leading --', () => {
    expect(
      resolveIconColor('var(--color-primary)', { cssVars: { '--color-primary': '#00b9ca' } })
    ).toBe('#00b9ca');
  });

  it('resolves var(--color-primary) via cssVars keyed without leading --', () => {
    expect(
      resolveIconColor('var(--color-primary)', { cssVars: { 'color-primary': '#00b9ca' } })
    ).toBe('#00b9ca');
  });

  it('uses the fallback when the css var is missing', () => {
    expect(resolveIconColor('var(--missing, #123456)', { cssVars: {} })).toBe('#123456');
    expect(resolveIconColor('var(--missing, #123456)', {})).toBe('#123456');
  });

  it('returns the input unchanged when a css var has no match and no fallback', () => {
    expect(resolveIconColor('var(--missing)', { cssVars: {} })).toBe('var(--missing)');
  });

  it('lets a custom resolveColor win over themeColors', () => {
    expect(
      resolveIconColor('primary', {
        resolveColor: () => '#abcdef',
        themeColors: { primary: '#00b9ca' },
      })
    ).toBe('#abcdef');
  });

  it('falls through to other rules when resolveColor returns undefined', () => {
    expect(
      resolveIconColor('primary', {
        resolveColor: () => undefined,
        themeColors: { primary: '#00b9ca' },
      })
    ).toBe('#00b9ca');
  });

  it('passes an unknown string through unchanged', () => {
    expect(resolveIconColor('not-a-token', { themeColors: { primary: '#00b9ca' } })).toBe('not-a-token');
  });
});

describe('createIcon color resolution (render)', () => {
  const svgTemplate = '<svg stroke="currentColor"></svg>';

  it('resolves a themeColors token and bakes the literal color into the data-URI src', () => {
    const TestIcon = createIcon(svgTemplate, 'ThemeColorIcon');
    const { getByTestId } = render(
      <LucideTaroProvider themeColors={{ primary: '#00b9ca' }}>
        <TestIcon color="primary" />
      </LucideTaroProvider>
    );
    const src = getByTestId('icon-image').getAttribute('src');
    expect(src).toContain('data:image/svg+xml,');
    expect(src).toContain('%2300b9ca');
    expect(decodeURIComponent(src!)).toContain('stroke="#00b9ca"');
    expect(decodeURIComponent(src!)).not.toContain('stroke="currentColor"');
  });

  it('resolves a var() token via cssVars at render time', () => {
    const TestIcon = createIcon(svgTemplate, 'CssVarIcon');
    const { getByTestId } = render(
      <LucideTaroProvider cssVars={{ '--color-primary': '#00b9ca' }}>
        <TestIcon color="var(--color-primary)" />
      </LucideTaroProvider>
    );
    const src = getByTestId('icon-image').getAttribute('src');
    expect(decodeURIComponent(src!)).toContain('stroke="#00b9ca"');
  });

  it('keeps a literal color working unchanged (backward compat)', () => {
    const TestIcon = createIcon(svgTemplate, 'LiteralColorIcon');
    const { getByTestId } = render(<TestIcon color="#ff0000" />);
    const src = getByTestId('icon-image').getAttribute('src');
    expect(decodeURIComponent(src!)).toContain('stroke="#ff0000"');
  });
});

describe('resolveIconColor hardening (adversarial)', () => {
  // Object.prototype member names must NOT resolve via the prototype chain.
  it.each(['toString', 'constructor', 'valueOf', 'hasOwnProperty', '__proto__'])(
    'does not resolve prototype member %s through themeColors',
    name => {
      const out = resolveIconColor(name, { themeColors: {} });
      expect(out).toBe(name);
      expect(typeof out).toBe('string');
    }
  );

  it.each(['var(--toString)', 'var(--constructor)', 'var(--valueOf)'])(
    'does not resolve prototype member via cssVars for %s',
    input => {
      const out = resolveIconColor(input, { cssVars: {} });
      expect(out).toBe(input);
      expect(typeof out).toBe('string');
    }
  );

  it('still resolves a real own-key named like a prototype member', () => {
    expect(resolveIconColor('toString', { themeColors: { toString: '#999999' } })).toBe('#999999');
  });

  it('captures a function-valued var() fallback containing parens', () => {
    expect(resolveIconColor('var(--x, rgb(1,2,3))', { cssVars: {} })).toBe('rgb(1,2,3)');
    expect(resolveIconColor('var(--x, hsl(200, 50%, 50%))', {})).toBe('hsl(200, 50%, 50%)');
  });

  it('prefers a present cssVar over the fallback', () => {
    expect(
      resolveIconColor('var(--x, rgb(1,2,3))', { cssVars: { '--x': '#abcdef' } })
    ).toBe('#abcdef');
  });

  it('matches uppercase VAR( and tolerates surrounding whitespace', () => {
    expect(resolveIconColor('VAR(--x)', { cssVars: { '--x': '#abcdef' } })).toBe('#abcdef');
    expect(resolveIconColor('  var(--x)  ', { cssVars: { '--x': '#abcdef' } })).toBe('#abcdef');
  });
});
