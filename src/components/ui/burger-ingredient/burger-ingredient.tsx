import React, { FC, memo } from 'react';
import styles from './burger-ingredient.module.css';

import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';

import { TBurgerIngredientUIProps } from './type';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, locationState, handleAdd, handleClick }) => {
    const { image, price, name } = ingredient;

    return (
      <li className={styles.container}>
        <div className={styles.article} onClick={handleClick}>
          {count && count > 0 && <Counter count={count} />}
          <img
            className={styles.img}
            src={image}
            alt={`Изображение ингредиента ${name}`}
          />
          <div className={`${styles.cost} mt-2 mb-2`}>
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <CurrencyIcon type='primary' />
          </div>
          <p className={`text text_type_main-default ${styles.text}`}>{name}</p>
        </div>
        <AddButton
          text='Добавить'
          onClick={(e) => {
            e.stopPropagation();
          }}
          extraClass={`${styles.addButton} mt-8`}
        />
      </li>
    );
  }
);
