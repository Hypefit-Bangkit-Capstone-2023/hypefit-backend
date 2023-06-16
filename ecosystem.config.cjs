module.exports = {
	apps: [
		{
			name: 'hypefit-backend',
			script: 'src/index.js',
			exec_mode: 'cluster',
			time: true,
		},
		{
			name: 'hypefit-backend-cronjob',
			script: 'src/cronJob.js',
			time: true,
		},
	],
};
