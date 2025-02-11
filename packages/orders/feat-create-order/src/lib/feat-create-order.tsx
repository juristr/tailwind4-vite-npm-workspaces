import styles from './feat-create-order.module.css';
import { dataAccessOrder } from '@aishop/data-access-order';
import { UiOrderDetail } from '@aishop/ui-order-detail';

export function FeatCreateOrder() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to FeatCreateOrder!</h1>
      <p>Data access value: {dataAccessOrder()}</p>
      <UiOrderDetail />
    </div>
  );
}

export default FeatCreateOrder;
