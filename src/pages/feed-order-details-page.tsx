import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { OrderInfo } from '../components/order-info';
import styles from './common-page.module.css';

export const FeedOrderDetailsPage: FC = () => {
  const { number } = useParams<{ number: string }>();

  return (
    <div className={styles.detailPageWrap}>
      <h1
        className={`${styles.detailHeader} text text_type_digits-default mb-10`}
      >
        #{number}
      </h1>
      <OrderInfo />
    </div>
  );
};
