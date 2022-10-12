import React from 'react';
import './CartDetails.css';
import CartItemDetails from './CartItemDetails';
import { SharedContext } from '../contexts/shared-context';

class CartDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="cart-details-content-position">
        <div
          className="cart-details-title"
        >
          <div>{this.props.title}</div>
        </div>
        <div>
          {this.context.cart.items.map((value) => {
            return (
              <div key={value.id + value.attributesID}>
                <hr className="hr"></hr>
                <CartItemDetails
                  data={value}
                  addItemHandler={this.context.cart.increaseItem}
                  removeItemHandler={this.context.cart.decreaseItem}
                />
              </div>
            );
          })}
        </div>
        <hr className="hr"></hr>
        <div
          className="cart-details-bottom-content"
        >
          <div>
            <div>Tax 21%:</div>
            <div>Quantity:</div>
            <div>Total:</div>
          </div>
          <div className="tax-quantity-amount-numbers">
            <div>
              {this.context.currency.symbol + ' ' + this.context.cart.totalTax}
            </div>
            <div>{this.context.cart.totalQuantity}</div>
            <div>
              {this.context.currency.symbol + ' ' + this.context.cart.total}
            </div>
          </div>
        </div>
        <button className='button-for-order'>ORDER</button>
      </div>
    );
  }
}

CartDetails.contextType = SharedContext;

export default CartDetails;
