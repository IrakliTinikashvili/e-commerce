import React from 'react';
import parse from 'html-react-parser';
import './ProductDetails.css';
import Attribute from './Attribute';
import { withRouter } from 'react-router-dom';
import { getProduct } from '../api/base';
import { SharedContext } from '../contexts/shared-context';

class ProductDetails extends React.Component {
  constructor() {
    super();

    this.state = {
      currency: undefined,
    };
  }

  componentDidMount = async () => {
    const productId = this.props.match.params.productId;
    const product = await getProduct(productId);

    const selectedAttributes = {};

    product.attributes.forEach((attribute) => {
      selectedAttributes[attribute.id] = 0;
    });

    const price = product.prices.find(
      (price) => price.currency.label === this.context.currency.label
    );

    this.setState({
      product: {
        ...product,
        price: price.amount,
        selectedAttributes,
        selectedPicture: product.gallery[0],
      },
      currency: this.context.currency.label,
    });
  };

  componentDidUpdate = () => {
    if (
      this.state.product &&
      this.state.currency !== this.context.currency.label
    ) {
      const price = this.state.product.prices.find(
        (price) => price.currency.label === this.context.currency.label
      );

      this.setState((prevState) => {
        return {
          product: {
            ...prevState.product,
            price: price.amount,
          },
          currency: this.context.currency.label,
        };
      });
    }
  };

  addToCart = () => {
    const item = {
      ...this.state.product,
      selectedAttributes: Object.assign(
        {},
        this.state.product.selectedAttributes
      ),
      quantity: 1,
    };
    const arr = [];
    item.attributes.forEach((attribute) => {
      arr.push(attribute.id + ' ' + item.selectedAttributes[attribute.id]);
    });

    this.context.cart.addItem({ ...item, attributesID: arr.join(',') });
  };

  selectAttribute = (key, index) => {
    const selectedAttributes = this.state.product.selectedAttributes;
    selectedAttributes[key] = index;
    this.setState((prevState) => {
      return {
        product: {
          ...prevState.product,
          selectedAttributes: selectedAttributes,
        },
      };
    });
  };

  selectPicture = (index) => {
    this.setState((prevState) => {
      return {
        product: {
          ...prevState.product,
          selectedPicture: prevState.product.gallery[index],
        },
      };
    });
  };

  render() {
    return this.state.product ? (
      <div
        className='main-content-for-card-details'
      >
        <div className='left-column-images'>
          {this.state.product.gallery &&
            this.state.product.gallery.map((value, index) => {
              return (
                <div key={value}>
                  <img
                    className='image'
                    src={value}
                    alt='pic'
                    width='79px'
                    height='80px'
                    onClick={() => this.selectPicture(index)}
                  />
                </div>
              );
            })}
        </div>
        {this.state.product.selectedPicture && (
          <div className="product-details-middle-content">
            <img
              className='image'
              src={this.state.product.selectedPicture}
              alt='pic'
              width='610px'
              height='511px'
            />
          </div>
        )}
        <div className='right-content-for-card-details'>
          <div className='item-type-title'>
            {this.state.product.brand}
          </div>
          <div
            className='item-type-title'
            style={{ fontWeight: '400', marginTop: '10px' }}
          >
            {this.state.product.name}
          </div>
          {
            <div>
              {this.state.product.attributes &&
                this.state.product.attributes.map((item) => (
                  <Attribute
                    key={item.id}
                    data={item}
                    selectedIndex={
                      this.state.product.selectedAttributes[item.id]
                    }
                    select={this.selectAttribute}
                  />
                ))}
              <div className='price-title'>PRICE:</div>
              <div
                className="product-details-price"
              >
                {this.context.currency.symbol + ' ' + this.state.product.price}
              </div>
              {this.state.product.inStock ? (
                <button className='button-for-cart' onClick={this.addToCart}>
                  ADD TO CART
                </button>
              ) : (
                <div className="product-details-out-of-stock">
                  OUT OF STOCK{' '}
                </div>
              )}

              <div
                className="product-details-item-description"
              >
                <div>{parse(this.state.product.description)}</div>
              </div>
            </div>
          }
        </div>
      </div>
    ) : null;
  }
}

export default withRouter(ProductDetails);

ProductDetails.contextType = SharedContext;
