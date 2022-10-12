import { client, Field, Query } from '@tilework/opus';

client.setEndpoint('http://localhost:4000');

export async function getCategoryNames() {
  const query = new Query('categories', true).addField('name');
  const result = await client.post(query);
  return result.categories;
}

export async function getCategory(categoryName) {
  const query = new Query('category').addField('name').addField(
    new Field('products', true)
      .addFieldList([
        'id',
        'name',
        'inStock',
        'description',
        'category',
        'brand',
      ])
      .addField(new Field('gallery', true))
      .addField(
        new Field('attributes', true)
          .addFieldList(['id', 'name', 'type'])
          .addField(
            new Field('items', true).addFieldList([
              'displayValue',
              'value',
              'id',
            ])
          )
      )
      .addField(
        new Field('prices', true)
          .addField('amount')
          .addField(new Field('currency').addFieldList(['label', 'symbol']))
      )
  );

  if (categoryName) {
    query.addArgument('input', 'CategoryInput!', { title: categoryName });
  }

  const result = await client.post(query);
  return result.category;
}

export async function getProduct(id) {
  const query = new Query('product')
    .addFieldList(['id', 'name', 'inStock', 'description', 'category', 'brand'])
    .addField(new Field('gallery', true))
    .addField(
      new Field('attributes', true)
        .addFieldList(['id', 'name', 'type'])
        .addField(
          new Field('items', true).addFieldList(['displayValue', 'value', 'id'])
        )
    )
    .addField(
      new Field('prices', true)
        .addField('amount')
        .addField(new Field('currency').addFieldList(['label', 'symbol']))
    )
    .addArgument('id', 'String!', id);
  const result = await client.post(query);
  return result.product;
}

export async function getCurrencies() {
  const query = new Query('currencies').addFieldList(['label', 'symbol']);
  const result = await client.post(query);
  return result.currencies;
}
