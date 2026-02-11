import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it } from 'vitest';

import { Input } from '../input';

describe('Input', () => {
  let testId: string;

  beforeAll(() => {
    testId = 'nexty-search-input';
  });

  const getView = () => {
    const user = userEvent.setup();

    render(
      <Input data-testid={testId} placeholder="Search…" defaultValue="" />,
    );

    const getSearchInput = async () => {
      return screen.findByTestId(testId) as Promise<HTMLInputElement>;
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
