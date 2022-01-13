(function () {
	'use strict';

	module.exports = {
		init
	};

	const fs = require('fs');

	const dbConfig = require('../../config/db/db-config').data;

	const { Sequelize } = require('sequelize');
	const sequelize = new Sequelize(prepareConnectionString(), {logging: false});

	async function init () {
		try {
			await sequelize.authenticate();
			console.log('Connected to DB');
			initModels();
		}catch(err) {
			console.error(err);
		}
	}
	
	function initModels () {
		fs.readdir('./modules', (err, folders) => {
			folders.forEach(folder => {
				if (folder == 'db') return;
				const module = require(`../${folder}/module`)();
				if (module.model == undefined) return;
				//module.model.init(sequelize);
			});
		});
	}

	function prepareConnectionString () {
		const str = `postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.server}/${dbConfig.database}`;
		return str;
	}
})();
