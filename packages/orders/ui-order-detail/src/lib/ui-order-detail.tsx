import styles from './ui-order-detail.module.css';
import { Ui } from '@aishop/ui';

export function UiOrderDetail() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to UiOrderDetail!</h1>
      <Ui />
    </div>
  );
}

export default UiOrderDetail;
