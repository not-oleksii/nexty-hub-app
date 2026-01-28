import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll,describe, expect, it } from 'vitest';

import { Input } from '../input';
import type { InputProps } from '../types';

describe('Input', () => {
  let props: InputProps;

  beforeAll(() => {
    props = {
      'data-testid': 'nexty-search-input',
      placeholder: 'Search…',
      defaultValue: '',
    };
  });

  const getView = () => {
    const user = userEvent.setup();

    render(<Input {...props} />);

    const getSearchInput = async () => {
      return screen.findByTestId('nexty-search-input') as Promise<HTMLInputElement>;
    };

    const typeSearch = async (text: string) => {
      const input = await getSearchInput();

      await user.clear(input);
      await user.type(input, text);

      return input;
    };

    return {
      getSearchInput,
      typeSearch,
    };
  };

  it('allows typing in the input', async () => {
    const { getSearchInput, typeSearch } = getView();

    const text = 'Lorem';

    await typeSearch(text);

    const input = await getSearchInput();

    expect(input.value).toBe(text);
  });
});
