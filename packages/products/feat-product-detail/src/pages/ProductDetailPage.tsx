import { useParams } from 'react-router-dom';
import { getProductById } from '@aishop/data-access-products';
import { ProductDetail } from '../lib/ProductDetail';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : null;
  
  if (!productId) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8" data-testid="invalid-product">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Invalid Product</h1>
          <p className="mt-2 text-gray-600">Please provide a valid product ID.</p>
        </div>
      </div>
    );
  }

  const product = getProductById(productId);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8" data-testid="product-not-found">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
          <p className="mt-2 text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Transform the product data to match ProductDetail component expectations
  const productDetailData = {
    id: product.id.toString(),
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    description: `Experience the excellence of ${product.name}. This premium ${product.category.toLowerCase()} product has been carefully crafted to meet your highest expectations.`,
    images: [product.image], // In a real app, you'd have multiple images
    rating: product.rating,
    reviewCount: Math.floor(Math.random() * 1000) + 100, // Mock review count
    features: [
      'Premium quality materials',
      'Satisfaction guaranteed',
      'Free shipping on orders over $50',
      '30-day return policy'
    ],
    inStock: true
  };

  return <ProductDetail product={productDetailData} />;
}

export default ProductDetailPage;