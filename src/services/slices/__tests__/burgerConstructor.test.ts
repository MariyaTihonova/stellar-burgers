import { describe, expect, test } from '@jest/globals';
import {
  burgerConstructorReducer,
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../burgerConstructorSlice';

const initialState = {
  bun: null,
  ingredients: [],
};

const mockBun = {
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
  __v: 0
};

const mockMain = {
  _id: '60666c42cc7b410027a1a9b5',
  name: 'Говяжий метеорит (отбивная)',
  type: 'main',
  proteins: 800,
  fat: 800,
  carbohydrates: 300,
  calories: 2674,
  price: 3000,
  image: 'https://code.s3.yandex.net/react/code/meat-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
  __v: 0
};

describe('burgerConstructor reducer', () => {
  test('должен обрабатывать добавление булки', () => {
    const action = addBun(mockBun);
    const state = burgerConstructorReducer(initialState, action);
    
    expect(state.bun).toEqual(mockBun);
    expect(state.ingredients).toHaveLength(0);
  });

  test('должен обрабатывать добавление ингредиента', () => {
    const action = addIngredient(mockMain);
    const state = burgerConstructorReducer(initialState, action);
    
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({
      ...mockMain,
      id: expect.any(String),
    });
  });

  test('должен обрабатывать удаление ингредиента', () => {
    const stateWithIngredient = burgerConstructorReducer(
      initialState,
      addIngredient(mockMain)
    );
    
    const ingredientId = stateWithIngredient.ingredients[0].id;
    const action = removeIngredient(ingredientId);
    const state = burgerConstructorReducer(stateWithIngredient, action);
    
    expect(state.ingredients).toHaveLength(0);
  });

  test('должен обрабатывать изменение порядка ингредиентов', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [
        { ...mockMain, id: 'unique-1' },
        { ...mockMain, id: 'unique-2' },
        { ...mockMain, id: 'unique-3' },
      ],
    };
    
    const action = moveIngredient({ fromIndex: 0, toIndex: 2 });
    const state = burgerConstructorReducer(stateWithIngredients, action);
    
    expect(state.ingredients[0].id).toBe('unique-2');
    expect(state.ingredients[1].id).toBe('unique-3');
    expect(state.ingredients[2].id).toBe('unique-1');
  });

  test('должен очищать конструктор', () => {
    const stateWithIngredients = burgerConstructorReducer(
      burgerConstructorReducer(initialState, addBun(mockBun)),
      addIngredient(mockMain)
    );
    
    const action = clearConstructor();
    const state = burgerConstructorReducer(stateWithIngredients, action);
    
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});
