import React from 'react';
import './CartItemDetails.css';
import Attribute from './Attribute';
import { SharedContext } from './../contexts/shared-context';

class CartItemDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      price: 0,
      currency: undefined,
      selectedPicture: 0,
    };
  }

  componentDidMount = () => {
    this.calculatePrice();
  };

  componentDidUpdate = () => {
    if (this.state.currency !== this.context.currency.symbol) {
      this.calculatePrice();
    }
  };

  calculatePrice = () => {
    const price = this.props.data.prices.find(
      (price) => price.currency.label === this.context.currency.label
    );

    this.setState({
      price: price.amount,
      currency: this.context.currency.symbol,
    });
  };

  showNextPicture = (i) => {
    const length = this.props.data.gallery.length;
    let selectedPicture = this.state.selectedPicture + i;
    if (selectedPicture < 0) {
      selectedPicture = length - 1;
    }
    if (selectedPicture === length) {
      selectedPicture = 0;
    }
    this.setState((prevState) => {
      return {
        ...prevState,
        selectedPicture,
      };
    });
  };

  getClass(name) {
    return this.props.componentSize !== 'mini' ? name : name + '-mini';
  }

  render() {
    return (
      <div className={this.getClass('cart-item-content')}>
        <div>
          <div
            className={this.getClass('item-type-title')}
          >
            {this.props.data.brand}
          </div>
          <div
            className={this.getClass('item-type-title')}
            style={{ marginTop: '4px', fontWeight: '400' }}
          >
            {this.props.data.name}
          </div>
          <div className={this.getClass('item-price')}>
            {this.state.currency + ' ' + this.state.price}
          </div>
          <div>
            {this.props.data.attributes &&
              this.props.data.attributes.map((item) => (
                <Attribute
                  key={item.id}
                  data={item}
                  componentSize={this.props.componentSize}
                  selectedIndex={this.props.data.selectedAttributes[item.id]}
                />
              ))}
          </div>
        </div>
        <div className={this.getClass('cart-item-details-content')}>
          <div className={this.getClass('quantity-column')}>
            <button
              onClick={() =>
                this.props.addItemHandler(
                  this.props.data.id,
                  this.props.data.attributesID
                )
              }
              className={this.getClass('plus-minus-button')}
            >
              +
            </button>
            <div className={this.getClass('item-quantity')}>
              {this.props.data.quantity}
            </div>
            <button
              onClick={() =>
                this.props.removeItemHandler(
                  this.props.data.id,
                  this.props.data.attributesID
                )
              }
              className={this.getClass('plus-minus-button')}
            >
              -
            </button>
          </div>
          <div>
            <img
              src={this.props.data.gallery[this.state.selectedPicture]}
              alt='pic'
              className={this.getClass('item-images')}
            />
            {this.props.componentSize !== 'mini' &&
              this.props.data.gallery.length > 1 && (
                <div className='carousel-buttons'>
                  <div
                    className='carousel-button'
                    onClick={() => this.showNextPicture(1)}
                  >
                    <div className='arrow left'></div>
                  </div>
                  <div
                    className='carousel-button'
                    onClick={() => this.showNextPicture(-1)}
                  >
                    <div className='arrow right'></div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }
}

CartItemDetails.contextType = SharedContext;

export default CartItemDetails;
