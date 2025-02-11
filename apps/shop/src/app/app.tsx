// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { FeatCreateOrder } from '@aishop/feat-create-order';
import { FeatCurrentOrders } from '@aishop/feat-current-orders';

export function App() {
  return (
    <div>
      <h1>Shop App</h1>
      <div>
        <h2>Create Order</h2>
        <FeatCreateOrder />
      </div>
      <div>
        <h2>Current Orders</h2>
        <FeatCurrentOrders />
      </div>
    </div>
  );
}

export default App;
