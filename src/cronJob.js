import nodeSchedule from 'node-schedule';
import taskService from './app/task/service.js';

nodeSchedule.scheduleJob('* * * * *', async () => {
	await taskService.run();
});

process.on('SIGINT', async () => {
	console.log('SIGINT received. Gracefully shutting down. Please wait...');
	await nodeSchedule.gracefulShutdown();
	process.exit(0);
});
