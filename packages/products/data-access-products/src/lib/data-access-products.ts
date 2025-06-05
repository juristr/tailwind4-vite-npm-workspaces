import { utils } from '@aishop/utils';

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  category: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones',
    price: 249.99,
    originalPrice: 299.99,
    rating: 5,
    image:
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    category: 'Electronics',
  },
  {
    id: 2,
    name: 'Ultra HD Smart TV 55"',
    price: 699.99,
    rating: 4,
    image:
      'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    category: 'Electronics',
  },
  {
    id: 3,
    name: 'Leather Crossbody Bag',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4,
    image:
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    category: 'Fashion',
  },
  {
    id: 4,
    name: "Men's Running Shoes",
    price: 129.99,
    rating: 5,
    image:
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    category: 'Footwear',
  },
  {
    id: 5,
    name: 'Stainless Steel Water Bottle',
    price: 24.99,
    originalPrice: 29.99,
    rating: 4,
    image:
      'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    category: 'Lifestyle',
  },
  {
    id: 6,
    name: 'Scented Soy Candle Set',
    price: 34.99,
    rating: 4,
    image:
      'https://images.pexels.com/photos/3066868/pexels-photo-3066868.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    category: 'Home',
  },
  {
    id: 7,
    name: 'Fitness Smartwatch',
    price: 199.99,
    originalPrice: 249.99,
    rating: 5,
    image:
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    category: 'Electronics',
  },
  {
    id: 8,
    name: 'Organic Face Moisturizer',
    price: 29.99,
    rating: 4,
    image:
      'https://images.pexels.com/photos/725998/pexels-photo-725998.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    category: 'Beauty',
  },
];

export function getProducts(): Product[] {
  return products;
}

export function getProductById(id: number): Product | undefined {
  return products.find(product => product.id === id);
}

export function dataAccessProducts(): string {
  return `data-access-products: ${utils()}`;
}
