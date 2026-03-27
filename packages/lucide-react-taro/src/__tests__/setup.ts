import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('@tarojs/components', () => ({
  Image: ({ src, className, style, ...props }: any) => {
    return {
      type: 'Image',
      props: { src, className, style, ...props },
    };
  },
}));
