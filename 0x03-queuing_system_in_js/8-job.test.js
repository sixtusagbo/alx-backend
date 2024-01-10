const createPushNotificationsJobs = require('./8-job.js');
const { createQueue } = require('kue');
import { expect } from 'chai';

const queue = createQueue();

before(() => {
  queue.testMode.enter();
});

beforeEach(() => {
  queue.testMode.clear();
});

after(() => {
  queue.testMode.exit();
});

const list = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account',
  },
  {
    phoneNumber: '7080854254',
    message: 'This is the code 0430 to verify your account',
  },
];

describe('createPushNotificationsJobs', () => {
  it('display a error message if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs('jobs', queue)).to.throw(
      Error,
      'Jobs is not'
    );
  });

  it('create two new jobs to the queue', () => {
    createPushNotificationsJobs(list, queue);
    expect(queue.testMode.jobs.length).to.equal(2);
  });
});
