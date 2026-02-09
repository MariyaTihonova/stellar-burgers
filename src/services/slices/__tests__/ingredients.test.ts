import { describe, expect, test, jest } from '@jest/globals';
import { ingredientsReducer, getIngredients } from '../ingredientsSlice';

// Мокаем API перед тестами
jest.mock('@api', () => ({
  getIngredientsApi: jest.fn(() =>
    Promise.resolve([
      {
        _id: '60666c42cc7b410027a1a9b1',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0,
      },
    ])
  ),
}));

const initialState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

const mockIngredients = [
  {
    _id: '60666c42cc7b410027a1a9b1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0,
  },
];

describe('ingredients reducer', () => {
  test('должен устанавливать isLoading в true при запросе', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен записывать данные и устанавливать isLoading в false при успехе', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients,
    };
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      action
    );
    
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  test('должен записывать ошибку и устанавливать isLoading в false при ошибке', () => {
    const errorMessage = 'Ошибка загрузки';
    const action = {
      type: getIngredients.rejected.type,
      error: { message: errorMessage },
    };
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      action
    );
    
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.ingredients).toEqual([]);
  });
});
