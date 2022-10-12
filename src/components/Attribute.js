import React from 'react';
import './Attribute.css';

class Attribute extends React.Component {
  getClass = (name) => {
    return this.props.componentSize !== 'mini' ? name : name + '-mini';
  };

  getSelected = (index) => {
    if (this.props.selectedIndex !== index) {
      return;
    }

    return this.props.data.type !== 'swatch'
      ? 'attribute-clicked'
      : 'swatch-attribute-clicked';
  };

  getInnerDivClass(index, color) {
    if (this.props.data.type !== 'swatch') {
      return '';
    }

    let classNames = this.getClass('swatch-attribute-inner');
    if (this.props.selectedIndex !== index && color === 'White') {
      classNames += ' swatch-attribute-white';
    }
    return classNames;
  }

  render() {
    return (
      <div>
        <div className='attribute-title'>
          {this.props.data.name}
        </div>
        <div
          className='attribute-content'
        >
          {this.props.data.items.map((item, index) => {
            return (
              <div
                key={index}
                className={[
                  this.props.data.type !== 'swatch'
                    ? this.getClass('attribute')
                    : this.getClass('swatch-attribute'),
                  this.getSelected(index),
                ].join(' ')}
                onClick={() =>
                  this.props.select &&
                  this.props.select(this.props.data.id, index)
                }
              >
                <div
                  className={this.getInnerDivClass(index, item.id)}
                  style={{ backgroundColor: item.value }}
                >
                  {this.props.data.type !== 'swatch' ? item.value : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Attribute;
