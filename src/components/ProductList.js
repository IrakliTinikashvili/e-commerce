import React from 'react';
import './ProductList.css';
import Card from './Card';
import { getCategory } from '../api/base';
import { withRouter } from 'react-router-dom';
import { SharedContext } from '../contexts/shared-context';
import Filters from './Filters';

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      filteredProducts: [],
      filters: [],
    };
  }

  componentDidMount = async () => {
    let categoryId = this.props.match.params.categoryId;
    let category = await getCategory(categoryId);
    if (!categoryId) {
      this.props.history.push(`/category/${category.name}`);
      return;
    }

    this.setState(() => {
      return {
        products: category.products,
        filteredProducts: category.products,
        name: category.name,
      };
    });
  };

  componentDidUpdate = async (prevProps) => {
    let categoryId = this.props.match.params.categoryId;
    if (categoryId !== prevProps.match.params.categoryId) {
      const category = await getCategory(categoryId);
      this.setState(() => {
        return {
          products: category.products,
          filteredProducts: category.products,
          name: category.name,
        };
      });
    }
  };

  handleFiltersChange = (selectedFilters) => {
    let filteredProducts = this.state.products;
    for (const property in selectedFilters) {
      filteredProducts = filteredProducts.filter((product) => {
        if (!product.inStock) {
          return false;
        }

        return product.attributes.some((attribute) => {
          if (attribute.id !== property) {
            return false;
          }

          if (attribute.type !== 'swatch') {
            return attribute.items.some(
              (item) => item.id === selectedFilters[property]
            );
          }

          let hasAllSwatchAttributes = true;
          selectedFilters[property].forEach((value) => {
            if (!attribute.items.find((item) => item.id === value)) {
              hasAllSwatchAttributes = false;
            }
          });

          return hasAllSwatchAttributes;
        });
      });
    }

    this.setState((prevState) => {
      return {
        ...prevState,
        filteredProducts,
      };
    });
  };

  render() {
    return (
      <div className='product-list'>
        <div className='side-bar'>
          {this.state.products.length > 0 && (
            <Filters
              products={this.state.products}
              onFiltersChange={this.handleFiltersChange}
            />
          )}
        </div>
        <div className='main-content'>
          <div className='main-content-title'>{this.state.name}</div>
          <div className='cards'>
            {this.state.filteredProducts.map((item) => {
              return <Card key={item.id} item={item} />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProductList);

ProductList.contextType = SharedContext;
