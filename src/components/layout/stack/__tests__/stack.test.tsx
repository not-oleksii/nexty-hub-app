import { render, screen } from '@testing-library/react';
import { beforeAll,describe, expect, it } from 'vitest';

import { Stack } from '../stack';
import type { StackProps } from '../types';

describe('Stack', () => {
  let props: StackProps;

  beforeAll(() => {
    props = {
      'data-testid': 'nexty-stack',
      direction: 'row',
      space: 16,
      children: (
        <>
          <div>One</div>
          <div>Two</div>
        </>
      ),
    };
  });

  const getView = () => {
    render(<Stack {...props} />);

    const getStack = async () => {
      return screen.findByTestId('nexty-stack');
    };

    return {
      getStack,
    };
  };

  it('applies gap class based on space prop', async () => {
    const { getStack } = getView();

    const el = await getStack();

    expect(el.className).toContain('gap-16');
  });
});
