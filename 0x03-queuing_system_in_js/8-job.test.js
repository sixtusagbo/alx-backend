import { expect } from "chai";
import createPushNotificationsJobs from "./8-job";
import { createQueue } from "kue";

const queue = createQueue();

before(function () {
  queue.testMode.enter();
});

afterEach(function () {
  queue.testMode.clear();
});

after(function () {
  queue.testMode.exit();
});

const list = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
  },
  {
    phoneNumber: '4153518922',
    message: 'This is the code 5678 to verify your account'
  },
  {
    phoneNumber: '4153238922',
    message: 'This is the code 9123 to verify your account'
  },
];

describe('createPushNotificationsJobs', function () {
  it('should create push notification jobs', () => {
    createPushNotificationsJobs(list, queue);
    expect(queue.testMode.jobs.length).to.equal(3);
  });

  it('should create jobs with correct type', () => {
    createPushNotificationsJobs(list, queue);
    queue.testMode.jobs.forEach((job) => {
      expect(job.type).to.equal('push_notification_code_3');
    });
  });

  it('should throw an error when jobs is not an array', () => {
    expect(() => createPushNotificationsJobs('jobs', queue))
      .to
      .throw('Jobs is not an array');
  });

  it('should create jobs with correct data', () => {
    createPushNotificationsJobs(list, queue);
    queue.testMode.jobs.forEach((job, index) => {
      expect(job.data.phoneNumber).to.equal(list[index].phoneNumber);
      expect(job.data.message).to.equal(list[index].message);
    });
  });
});
