import React from 'react';
import './Header.css';
import GreenLogo from '../assets/GreenLogo.png';
import CurrencySelector from './CurrencySelector';
import { Link, matchPath, withRouter } from 'react-router-dom';
import { getCategoryNames } from '../api/base';
import { SharedContext } from '../contexts/shared-context';
import Cart from '../assets/Cart.png';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      selectedIndex: -1,
    };
  }

  componentDidMount = async () => {
    const match = matchPath(this.props.location.pathname, {
      path: '/category/:categoryId',
    });

    const categories = await getCategoryNames();
    const selectedIndex = categories.findIndex(
      (item) => item.name === match?.params?.categoryId
    );

    this.setState(() => {
      return {
        categories: categories,
        selectedIndex,
        showCart: this.context.cart.show,
      };
    });
  };

  select = (index) => {
    this.setState({
      selectedIndex: index,
    });
  };

  render() {
    return (
      <div className='header-content'>
        <div className='left-content'>
          {this.state.categories.map((value, index) => {
            return (
              <Link
                key={value.name}
                className='link-title-decoration'
                to={`/category/${value.name}`}
              >
                <div
                  className={[
                    'title-decoration',
                    this.state.selectedIndex === index &&
                    'title-decoration-clicked',
                  ].join(' ')}
                  onClick={() => this.select(index)}
                >
                  {value.name}
                </div>
              </Link>
            );
          })}
        </div>
        <div>
          <img
            src={GreenLogo}
            alt='Green Logo'
            className="green-logo"
          />
        </div>

        <div className='right-content'>
          <CurrencySelector />
          <div onClick={this.context.cart.toggleCart}>
            <div className='cartIcon'>
              <img src={Cart} width='20px' height='20px' alt='Cart' />
            </div>
            {this.context.cart.totalQuantity > 0 && (
              <div className='cart-quantity'>
                {this.context.cart.totalQuantity}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);

Header.contextType = SharedContext;
