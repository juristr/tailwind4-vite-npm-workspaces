import styles from './feat-product-detail.module.css';
import { dataAccessProducts } from '@aishop/data-access-products';
import { UiProductDetail } from '@aishop/ui-product-detail';

export function FeatProductDetail() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to FeatProductDetail!</h1>
      <p>Data access value: {dataAccessProducts()}</p>
      <UiProductDetail />
    </div>
  );
}

export default FeatProductDetail;
