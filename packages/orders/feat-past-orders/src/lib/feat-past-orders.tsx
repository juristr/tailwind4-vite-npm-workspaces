import styles from './feat-past-orders.module.css';
import { dataAccessOrder } from '@aishop/data-access-order';
import { UiOrderDetail } from '@aishop/ui-order-detail';

export function FeatPastOrders() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Past Orders</h1>
      <p>View your order history and track past purchases</p>
      <p>Data access value: {dataAccessOrder()}</p>
      <UiOrderDetail />
    </div>
  );
}

export default FeatPastOrders;
