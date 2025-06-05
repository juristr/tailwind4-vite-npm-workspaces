import ProductCard from './ProductCard';
import { getProducts } from '@aishop/data-access-products';

export function ProductGrid() {
  const products = getProducts();

  return (
    <div
      data-testid="product-grid"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}

export default ProductGrid;
