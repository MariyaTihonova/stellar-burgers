import { describe, expect, test } from '@jest/globals';
import { rootReducer } from '../rootReducer';

describe('rootReducer', () => {
  test('должен возвращать корректное начальное состояние при неизвестном экшене', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, unknownAction);

    expect(state).toEqual({
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null,
      },
      burgerConstructor: {
        bun: null,
        ingredients: [],
      },
      order: {
        order: null,
        isLoading: false,
        error: null,
      },
      user: {
        user: null,
        isLoading: false,
        error: null,
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null,
      },
      profileOrders: {
        orders: [],
        isLoading: false,
        error: null,
      },
      currentIngredient: {
        ingredient: null,
      },
      currentOrder: {
        order: null,
        isLoading: false,
        error: null,
      },
    });
  });
});
