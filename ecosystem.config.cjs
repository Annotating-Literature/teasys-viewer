/** @type {import('pm2').StartOptions} */
module.exports = {
	apps: [
		{
			name: 'teasys-viewer',
			script: 'build/index.js',
			cwd: __dirname,
			env: {
				NODE_ENV: 'production',
				PORT: 3000,
				// Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
				SESSION_SECRET: 'change-me-to-a-32-character-secret',
				// Optional: override default data/ directory
				// TEASYS_DATA_DIR: '/var/data/teasys',
			},
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: '512M',
			error_file: 'logs/err.log',
			out_file: 'logs/out.log',
			log_file: 'logs/combined.log',
			time: true,
		},
	],
};
