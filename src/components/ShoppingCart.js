import React from 'react';
import './ShoppingCart.css';
import CartItemDetails from '../components/CartItemDetails';
import { Link } from 'react-router-dom';
import { SharedContext } from '../contexts/shared-context';

class ShoppingCart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  clickHandler = (event) => {
    event.stopPropagation();
  };

  render() {
    return (
      <div className='modal' onClick={this.context.cart.toggleCart}>
        <div
          className='shopping-cart-modal'
          style={{ width: '360px', height: '677px' }}
          onClick={this.clickHandler}
        >
          <div className="shopping-cart-position">
            <span className='my-bag'>
              My Bag,
            </span>
            <span
              className='my-bag'
              style={{ fontWeight: '500', marginLeft: '5px' }}
            >
              {this.context.cart.totalQuantity > 1
                ? this.context.cart.totalQuantity + ' items'
                : this.context.cart.totalQuantity + ' item'}
            </span>
          </div>
          <div>
            {this.context.cart.items.map((value) => {
              return (
                <div key={value.id + value.attributesID} className="shopping-cart-space-between-items">
                  <CartItemDetails
                    data={value}
                    componentSize='mini'
                    addItemHandler={this.context.cart.increaseItem}
                    removeItemHandler={this.context.cart.decreaseItem}
                  />
                </div>
              );
            })}
          </div>
          <div className='total-price'>
            <div
            >
              Total
            </div>
            <div
              className='total-price-amount'
            >
              {this.context.currency.symbol + ' ' + this.context.cart.total}
            </div>
          </div>
          <div className='bottom-buttons'>
            <Link to='/cart-details' onClick={this.context.cart.toggleCart}>
              <button className='view-bag-button'>VIEW BAG</button>
            </Link>
            <button className='check-out-button'>CHECK OUT</button>
          </div>
        </div>
      </div>
    );
  }
}

ShoppingCart.contextType = SharedContext;

export default ShoppingCart;
