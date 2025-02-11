import styles from './feat-current-orders.module.css';
import { dataAccessOrder } from '@aishop/data-access-order';
import { UiOrderDetail } from '@aishop/ui-order-detail';

export function FeatCurrentOrders() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to FeatCurrentOrders!</h1>
      <p>Data access value: {dataAccessOrder()}</p>
      <UiOrderDetail />
    </div>
  );
}

export default FeatCurrentOrders;
