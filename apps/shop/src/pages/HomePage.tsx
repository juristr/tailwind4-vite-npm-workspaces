import { ProductGrid } from '@aishop/feat-product-list';

export function HomePage() {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Legit Products</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Latest
          </button>
          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Popular
          </button>
          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Sale
          </button>
        </div>
      </div>
      <ProductGrid />
    </section>
  );
}

export default HomePage;