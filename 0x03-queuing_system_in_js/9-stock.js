import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

const app = express();
const port = 1245;
const client = createClient();
const getAsync = promisify(client.get).bind(client);
const listProducts = [
  {
    id: 1,
    name: 'Suitcase 250',
    price: 50,
    stock: 4,
  },
  {
    id: 2,
    name: 'Suitcase 450',
    price: 100,
    stock: 10,
  },
  {
    id: 3,
    name: 'Suitcase 650',
    price: 350,
    stock: 2,
  },
  {
    id: 4,
    name: 'Suitcase 1050',
    price: 550,
    stock: 5,
  },
];

client.on('error', (err) => console.error(`Failed to connect to redis: ${err}`));
client.on('connect', () => console.log('Redis connection successful'));

const getItemById = (id) => listProducts.find((product) => product.id === id);

const reserveStockById = (itemId, stock) => {
  client.set(`item.${itemId}`, stock);
};

const getCurrentReservedStockById = async (itemId) => {
  const key = `item.${itemId}`;

  try {
    const reservedStock = await getAsync(key);
    return reservedStock || 0;
  } catch (err) {
    throw new Error(`Failed to get current stock for item id ${itemId}`);
  }
};

app.get('/list_products', (req, res) => res.json(listProducts.map((product) => ({
  itemId: product.id,
  itemName: product.name,
  price: product.price,
  initialAvailableQuantity: product.stock,
}))));

app.get('/list_products/:itemId(\\d+)', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const product = getItemById(itemId);

  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  try {
    const reservedStock = await getCurrentReservedStockById(itemId);
    const currentQuantity = product.stock - reservedStock;

    return res.json({
      itemId: product.id,
      itemName: product.name,
      price: product.price,
      initialAvailableQuantity: product.stock,
      currentQuantity,
    });
  } catch (err) {
    return res.status(500).json({ status: `Server error: ${err}` });
  }
});

app.get('/reserve_product/:itemId(\\d+)', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const item = getItemById(itemId);
  if (!item) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const reservedStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = item.stock - reservedStock;
  console.info('reservedStock: ', reservedStock);
  if (currentQuantity === 0) {
    return res.status(200).json({ status: 'Not enough stock available', itemId: itemId });
  } else {
    reserveStockById(itemId, 1);
    return res.status(200).json({ status: 'Reservation confirmed', itemId: itemId });
  }
});

app.listen(port, () => console.info(`Server listening on port: ${port}`));
