import styles from './feat-product-list.module.css';
import { dataAccessProducts } from '@aishop/data-access-products';
import { UiProductDetail } from '@aishop/ui-product-detail';
import { ProductListFilter } from '@aishop/product-list-filter';

export function FeatProductList() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to FeatProductList!</h1>
      <p>Data access value: {dataAccessProducts()}</p>
      <UiProductDetail />
      <ProductListFilter />
    </div>
  );
}

export default FeatProductList;
