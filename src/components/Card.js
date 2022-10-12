import React from 'react';
import './Card.css';
import GreenVector from '../assets/GreenVector.png';
import { Link } from 'react-router-dom';
import { SharedContext } from '../contexts/shared-context';

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddToCart: false,
      price: 0,
      currency: undefined,
    };
  }

  componentDidMount = () => {
    this.calculatePrice();
  };

  componentDidUpdate = () => {
    if (this.state.currency !== this.context.currency.label) {
      this.calculatePrice();
    }
  };

  calculatePrice = () => {
    const price = this.props.item.prices.find(
      (price) => price.currency.label === this.context.currency.label
    );

    this.setState((prevState) => {
      return {
        ...prevState,
        price: price.amount,
        currency: this.context.currency.label,
      };
    });
  };

  showCart = () => {
    if (this.props.item.inStock) {
      this.setState({
        showAddToCart: true,
      });
    }
  };

  hideCart = () => {
    this.setState({
      showAddToCart: false,
    });
  };

  addToCart = (e) => {
    e.preventDefault();
    const item = {
      ...this.props.item,
      quantity: 1,
      selectedAttributes: {},
    };
    const arr = [];

    this.props.item.attributes.forEach((attribute) => {
      item.selectedAttributes[attribute.id] = 0;
      arr.push(attribute.id + ' ' + 0);
    });

    this.context.cart.addItem({ ...item, attributesID: arr.join(',') });
  };

  render() {
    return (
      <Link
        to={`/product-details/${this.props.item.id}`}
        style={{ textDecoration: 'none' }}
      >
        <div
          className={`card ${!this.props.item.inStock && 'out-of-stock'}`}
          onMouseOver={this.showCart}
          onMouseLeave={this.hideCart}
        >
          <img
            className='card-image'
            src={this.props.item.gallery[0]}
            alt='Item'
          />
          {this.state.showAddToCart ? (
            <div
              className="green-cart"
              onClick={this.addToCart}
            >
              <img
                className="green-cart-position"
                src={GreenVector}
                alt='GreenVector'
              />
            </div>
          ) : (
            <div className="card-bottom-content-size"></div>
          )}
          <div className='card-title'>
            {this.props.item.brand + ' ' + this.props.item.name}
          </div>
          <div className='card-price'>
            {this.context.currency.symbol + ' ' + this.state.price}
          </div>
          {!this.props.item.inStock && (
            <div className='out-of-stock-text'>OUT OF STOCK</div>
          )}
        </div>
      </Link>
    );
  }
}

Card.contextType = SharedContext;

export default Card;
