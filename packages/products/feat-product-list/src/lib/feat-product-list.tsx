import styles from './feat-product-list.module.css';
import { ProductGrid } from './ProductGrid';

export function FeatProductList() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to FeatProductList!</h1>
      <ProductGrid />
    </div>
  );
}

export default FeatProductList;
