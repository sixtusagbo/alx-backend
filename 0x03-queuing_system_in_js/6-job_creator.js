const { createQueue } = require('kue');
const queue = createQueue();
const jobData = {
  phoneNumber: '+2347080854254',
  message: 'Foo Bar',
};

const job = queue.create('push_notification_code', jobData).save(err => {
  if (!err) console.log(`Notification job created: ${job.id}`);
});

job.on('complete', result => console.log('Notification job completed'));

job.on('failed', errorMessage => console.log('Notification job failed'));
