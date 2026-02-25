import { FC, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { setCurrentIngredient } from '../../services/slices/currentIngredientSlice';
import {
  addIngredient,
  addBun
} from '../../services/slices/burgerConstructorSlice';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
        console.log('Добавлена булка:', ingredient.name);
      } else {
        dispatch(addIngredient(ingredient));
        console.log('Добавлен ингредиент:', ingredient.name);
      }
    };

    const handleClick = () => {
      // Устанавливаем текущий ингредиент в хранилище
      dispatch(setCurrentIngredient(ingredient));

      // Переходим на страницу ингредиента
      navigate(`/ingredients/${ingredient._id}`, {
        state: { background: location }
      });
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
        handleClick={handleClick}
      />
    );
  }
);
