import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

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

const getItemById = id => {
  return listProducts.find(item => item.id === id);
};

const app = express();
const port = 1245;

app.use(express.json());

app.get('/list_products', (req, res) => {
  return res.json(listProducts);
});

const client = createClient();

const reserveStockById = (itemId, stock) => {
  const item = getItemById(itemId);

  client.set(`item.${item.id}`, item.stock);
};

const getCurrentReservedStockById = async itemId => {
  const getAsync = promisify(client.get).bind(client);

  try {
    const reservedStock = await getAsync(`item.${itemId}`);
    return reservedStock;
  } catch (err) {
    console.log(err);
  }
};

app.get('/list_products/:itemId(\\d+)', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const item = getItemById(itemId);

  if (!item) {
    return res.status(404).json({ status: 'Product not found' });
  } else {
    const reservedStock = await getCurrentReservedStockById(itemId);
    const currentQuantity = item.stock - reservedStock;

    return res.json({
      itemId: item.id,
      itemName: item.name,
      price: item.price,
      initialAvailableQuantity: item.stock,
      currentQuantity,
    });
  }
});

app.get('/reserve_product/:itemId(\\d+)', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const item = getItemById(itemId);

  if (!item) {
    return res.status(404).json({ status: 'Product not found' });
  } else {
    const reservedStock = await getCurrentReservedStockById(itemId);
    const currentQuantity = item.stock - reservedStock;

    if (currentQuantity <= 0) {
      return res
        .status(403)
        .json({ status: 'Not enough stock available', itemId });
    }

    reserveStockById(itemId, item.stock);
    return res.json({ status: 'Reservation confirmed', itemId });
  }
});

app.listen(port, () => console.log(`App running on port ${port}`));
