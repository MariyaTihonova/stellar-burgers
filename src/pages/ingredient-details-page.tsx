import { FC } from 'react';
import { IngredientDetails } from '../components/ingredient-details';
import styles from './common-page.module.css';

export const IngredientDetailsPage: FC = () => (
  <div className={styles.detailPageWrap}>
    <h1 className={`${styles.detailHeader} text text_type_main-large`}>
      Детали ингредиента
    </h1>
    <IngredientDetails />
  </div>
);
