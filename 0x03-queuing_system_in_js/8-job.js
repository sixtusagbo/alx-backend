const createPushNotificationsJobs = (jobs, queue) => {
  if (!(jobs instanceof Array)) throw new Error('Jobs is not an array');

  for (const job of jobs) {
    const newJob = queue.create('push_notification_code_3', job);

    newJob.save((err) => {
      if (!err) console.log(`Notification job created: ${newJob.id}`);
    });

    newJob.on('complete', (result) => console.log(`Notification job ${newJob.id} completed`));

    newJob.on('failed', (err) => console.log(`Notification job ${newJob.id} failed: ${err}`));

    newJob.on('progress', (progress, data) => console.log(`Notification job ${newJob.id} ${progress}% complete`));
  }
};

export default createPushNotificationsJobs;
