import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { createIcon } from '../create-icon';
import { LucideTaroProvider } from '../context';

vi.mock('@tarojs/components', () => ({
  Image: React.forwardRef(({ src, className, style, ...props }: any, ref) => (
    <img ref={ref} src={src} className={className} style={style} data-testid="icon-image" {...props} />
  )),
}));

const mockSvgTemplate = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;

describe('createIcon', () => {
  it('should create an icon component', () => {
    const TestIcon = createIcon(mockSvgTemplate, 'TestIcon');
    expect(TestIcon).toBeDefined();
    expect(typeof TestIcon).toBe('function');
  });

  it('should set displayName correctly', () => {
    const TestIcon = createIcon(mockSvgTemplate, 'TestIcon');
    expect(TestIcon.displayName).toBe('TestIcon');
  });

  it('should use default displayName when not provided', () => {
    const TestIcon = createIcon(mockSvgTemplate);
    expect(TestIcon.displayName).toBe('LucideIcon');
  });
});

describe('Icon Component', () => {
  const TestIcon = createIcon(mockSvgTemplate, 'TestIcon');

  it('should render with default size', () => {
    const { getByTestId } = render(<TestIcon />);
    const img = getByTestId('icon-image');
    expect(img).toBeInTheDocument();
    expect(img.style.width).toBe('24px');
    expect(img.style.height).toBe('24px');
  });

  it('should render with custom numeric size', () => {
    const { getByTestId } = render(<TestIcon size={32} />);
    const img = getByTestId('icon-image');
    expect(img.style.width).toBe('32px');
    expect(img.style.height).toBe('32px');
  });

  it('should render with custom string size', () => {
    const { getByTestId } = render(<TestIcon size="2rem" />);
    const img = getByTestId('icon-image');
    expect(img.style.width).toBe('2rem');
    expect(img.style.height).toBe('2rem');
  });

  it('should apply custom className', () => {
    const { getByTestId } = render(<TestIcon className="custom-class" />);
    const img = getByTestId('icon-image');
    expect(img.className).toBe('custom-class');
  });

  it('should apply custom style', () => {
    const { getByTestId } = render(<TestIcon style={{ margin: '10px' }} />);
    const img = getByTestId('icon-image');
    expect(img.style.margin).toBe('10px');
  });

  it('should generate data URL with color replacement', () => {
    const { getByTestId } = render(<TestIcon color="#ff0000" />);
    const img = getByTestId('icon-image');
    const src = img.getAttribute('src');
    expect(src).toContain('data:image/svg+xml,');
    expect(src).toContain(encodeURIComponent('stroke="#ff0000"'));
  });

  it('should replace stroke-width when strokeWidth is provided', () => {
    const { getByTestId } = render(<TestIcon strokeWidth={3} />);
    const img = getByTestId('icon-image');
    const src = img.getAttribute('src');
    expect(src).toContain(encodeURIComponent('stroke-width="3"'));
  });

  it('should calculate absolute stroke width correctly', () => {
    const { getByTestId } = render(<TestIcon size={48} strokeWidth={2} absoluteStrokeWidth />);
    const img = getByTestId('icon-image');
    const src = img.getAttribute('src');
    expect(src).toContain(encodeURIComponent('stroke-width="1"'));
  });

  it('should pass additional props to Image component', () => {
    const { getByTestId } = render(<TestIcon data-custom="test-value" />);
    const img = getByTestId('icon-image');
    expect(img.getAttribute('data-custom')).toBe('test-value');
  });
});

describe('SVG Caching', () => {
  it('should return same data URL for same parameters', () => {
    const TestIcon = createIcon(mockSvgTemplate, 'CacheTestIcon');
    
    const { getByTestId: getFirst } = render(<TestIcon color="#ff0000" size={24} />);
    const firstSrc = getFirst('icon-image').getAttribute('src');
    cleanup();
    
    const { getByTestId: getSecond } = render(<TestIcon color="#ff0000" size={24} />);
    const secondSrc = getSecond('icon-image').getAttribute('src');
    
    expect(firstSrc).toBe(secondSrc);
  });

  it('should return different data URL for different colors', () => {
    const TestIcon = createIcon(mockSvgTemplate, 'CacheTestIcon2');
    
    const { getByTestId: getFirst } = render(<TestIcon color="#ff0000" />);
    const firstSrc = getFirst('icon-image').getAttribute('src');
    cleanup();
    
    const { getByTestId: getSecond } = render(<TestIcon color="#00ff00" />);
    const secondSrc = getSecond('icon-image').getAttribute('src');
    
    expect(firstSrc).not.toBe(secondSrc);
  });
});

describe('svgToDataUrl', () => {
  it('should encode SVG to data URL format', () => {
    const TestIcon = createIcon(mockSvgTemplate, 'DataUrlTestIcon');
    const { getByTestId } = render(<TestIcon />);
    const img = getByTestId('icon-image');
    const src = img.getAttribute('src');
    expect(src).toMatch(/^data:image\/svg\+xml,/);
  });
});

describe('Color replacement', () => {
  it('should replace stroke="currentColor"', () => {
    const svgWithStroke = `<svg stroke="currentColor"><path/></svg>`;
    const TestIcon = createIcon(svgWithStroke, 'StrokeIcon');
    const { getByTestId } = render(<TestIcon color="red" />);
    const src = getByTestId('icon-image').getAttribute('src');
    expect(src).toContain(encodeURIComponent('stroke="red"'));
    expect(src).not.toContain(encodeURIComponent('stroke="currentColor"'));
  });

  it('should replace fill="currentColor"', () => {
    const svgWithFill = `<svg fill="currentColor"><path/></svg>`;
    const TestIcon = createIcon(svgWithFill, 'FillIcon');
    const { getByTestId } = render(<TestIcon color="blue" />);
    const src = getByTestId('icon-image').getAttribute('src');
    expect(src).toContain(encodeURIComponent('fill="blue"'));
    expect(src).not.toContain(encodeURIComponent('fill="currentColor"'));
  });

  it('should not modify SVG when no color is provided', () => {
    const TestIcon = createIcon(mockSvgTemplate, 'NoColorIcon');
    const { getByTestId } = render(<TestIcon />);
    const src = getByTestId('icon-image').getAttribute('src');
    expect(src).toContain(encodeURIComponent('stroke="currentColor"'));
  });
});

describe('Filled rendering', () => {
  it('should render filled icon when filled is true', () => {
    const TestIcon = createIcon(mockSvgTemplate, 'FilledIcon');
    const { getByTestId } = render(<TestIcon filled />);
    const src = getByTestId('icon-image').getAttribute('src');
    expect(src).toContain(encodeURIComponent('fill="currentColor"'));
    expect(src).toContain(encodeURIComponent('stroke="none"'));
  });

  it('should fill with provided color when filled is true', () => {
    const TestIcon = createIcon(mockSvgTemplate, 'FilledColorIcon');
    const { getByTestId } = render(<TestIcon filled color="#ff0000" />);
    const src = getByTestId('icon-image').getAttribute('src');
    expect(src).toContain(encodeURIComponent('fill="#ff0000"'));
    expect(src).toContain(encodeURIComponent('stroke="none"'));
  });

  it('should generate different data URL between filled and outline', () => {
    const TestIcon = createIcon(mockSvgTemplate, 'FilledCacheIcon');
    const { getByTestId: getOutline } = render(<TestIcon color="#ff0000" />);
    const outlineSrc = getOutline('icon-image').getAttribute('src');
    cleanup();

    const { getByTestId: getFilled } = render(<TestIcon color="#ff0000" filled />);
    const filledSrc = getFilled('icon-image').getAttribute('src');

    expect(outlineSrc).not.toBe(filledSrc);
  });
});

describe('LucideTaroProvider', () => {
  const TestIcon = createIcon(mockSvgTemplate, 'ProviderTestIcon');

  it('should use defaultColor from provider', () => {
    const { getByTestId } = render(
      <LucideTaroProvider defaultColor="#00ff00">
        <TestIcon />
      </LucideTaroProvider>
    );
    const src = getByTestId('icon-image').getAttribute('src');
    expect(src).toContain(encodeURIComponent('stroke="#00ff00"'));
    expect(src).not.toContain(encodeURIComponent('stroke="currentColor"'));
  });

  it('should use defaultSize from provider', () => {
    const { getByTestId } = render(
      <LucideTaroProvider defaultSize={32}>
        <TestIcon />
      </LucideTaroProvider>
    );
    const img = getByTestId('icon-image');
    expect(img.style.width).toBe('32px');
    expect(img.style.height).toBe('32px');
  });

  it('should allow color prop to override defaultColor', () => {
    const { getByTestId } = render(
      <LucideTaroProvider defaultColor="#00ff00">
        <TestIcon color="#ff0000" />
      </LucideTaroProvider>
    );
    const src = getByTestId('icon-image').getAttribute('src');
    expect(src).toContain(encodeURIComponent('stroke="#ff0000"'));
    expect(src).not.toContain(encodeURIComponent('stroke="#00ff00"'));
  });

  it('should allow size prop to override defaultSize', () => {
    const { getByTestId } = render(
      <LucideTaroProvider defaultSize={32}>
        <TestIcon size={48} />
      </LucideTaroProvider>
    );
    const img = getByTestId('icon-image');
    expect(img.style.width).toBe('48px');
    expect(img.style.height).toBe('48px');
  });

  it('should fall back to default when no provider and no props', () => {
    const { getByTestId } = render(<TestIcon />);
    const img = getByTestId('icon-image');
    const src = img.getAttribute('src');
    expect(img.style.width).toBe('24px');
    expect(src).toContain(encodeURIComponent('stroke="currentColor"'));
  });
});
