import { createQueue } from 'kue';
import { createClient } from 'redis';
import express from 'express';
import { promisify } from 'util';

const client = createClient();

const reserveSeat = number => {
  client.set(`available_seats`, number);
};

const getCurrentAvailableSeats = async () => {
  const getAsync = promisify(client.get).bind(client);

  try {
    const availableSeats = await getAsync(`available_seats`);
    return availableSeats;
  } catch (err) {
    console.log(err);
  }
};

reserveSeat(50);
let reservationEnabled = true;

const kue = createQueue();
const app = express();
const port = 1245;

app.use(express.json());

app.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();

  return res.json({ numberOfAvailableSeats: availableSeats });
});

app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled)
    return res.json({ status: 'Reservation are blocked' });

  const job = kue.create('reserve_seat', {});

  job.save(err => {
    if (err) return res.json({ status: 'Reservation failed' });

    return res.json({ status: 'Reservation in process' });
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', errorMessage => {
    console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`);
  });
});

app.get('/process', async (req, res) => {
  kue.process('reserve_seat', async (job, done) => {
    let availableSeats = await getCurrentAvailableSeats();

    if (availableSeats <= 0) {
      done(Error('Not enough seats available'));
    }

    availableSeats -= 1;
    reserveSeat(availableSeats);

    if (availableSeats === 0) reservationEnabled = false;

    if (availableSeats >= 0) {
      done();
    } else {
      done(Error('Not enough seats available'));
    }
  });

  return res.json({ status: 'Queue processing' });
});

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
