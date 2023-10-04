import { Link } from 'react-router-dom';

function EmptyCart() {
  return (
    <div>
      {/* <Link to="/menu">&larr; Back to menu</Link> */}

      <p className='font-semibold text-center mt-4'>Your cart is  empty. Start adding some pizzas :)</p>
    </div>
  );
}

export default EmptyCart;
