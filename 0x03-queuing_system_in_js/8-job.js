const createPushNotificationsJobs = (jobs, queue) => {
  if (!jobs instanceof Array) throw new Error('Jobs is not an array');

  jobs.forEach(job => {
    const newJob = queue.create('push_notification_code_3', job).save(err => {
      if (!err) console.log(`Notification job created: ${newJob.id}`);
    });

    newJob.on('complete', result => {
      console.log(`Notification job ${newJob.id} completed`);
    });

    newJob.on('failed', errorMessage => {
      console.log(`Notification job ${newJob.id} failed: ${errorMessage}`);
    });

    newJob.on('progress', (progress, data) => {
      console.log(`Notification job ${newJob.id} ${progress}% complete`);
    });
  });
};

module.exports = createPushNotificationsJobs;
