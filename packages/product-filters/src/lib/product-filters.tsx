import React from 'react';
import styles from './product-filters.module.css';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  // Add more product properties as needed
}

export interface ProductFiltersProps {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  products,
  onFilterChange,
}) => {
  return (
    <div className={styles.productFilters}>
      {/* Filter components will be added here */}
    </div>
  );
};
