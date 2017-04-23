const vk = new (require('vk-io'))
const fs = require('fs')
const lib = require('./lib')
const token = require('./token')

const HOMYACHAT_ID = 29 // TODO определять в зависимости от юзера
const PEER_ID = HOMYACHAT_ID + 2000000000

vk.setToken(token);
vk.setOptions({
	/* Optimize the number of requests per second  */
	call: 'execute'
});

getUsersInfo = chatlans => {
	let insertSql = "";
	const users = vk.api.users.get({user_ids: chatlans.join(','), fields: ["photo_50", "photo_200", "photo_400_orig", "domain"]})
	.then( users => {
		users.forEach( user => {
			insertSql += `INSERT INTO users (user_id, first_name, last_name, domain, photo_50, photo_200, photo_400) VALUES (${user.id}, '${user.first_name}', '${user.last_name}', '${user.domain}', '${user.photo_50}','${user.photo_200}', '${user.photo_400_orig}');\n`
		})

		console.log('Записываю users SQL файл')

		fs.writeFile("./homyachat_users.sql", insertSql, "utf8", err => {
			if(err) {
				return console.log(err);
			}

			console.log("SQL файл записан");
		});
	})
	.catch(error => console.error(`=== ERROR ===\n${error}\n==============`))
}

getAllMessages = () => {
	let insertSql = "";
	const messages = vk.collect.messages.getHistory({peer_id: PEER_ID, /*count: 200,*/ rev: 1})
	.then( items => {
		console.log(`Количество сообщений на ${new Date().toLocaleString()}: ${items.length}`)

		items.forEach(item => {
			insertSql += `INSERT INTO messages (vk_id, body, user_id, from_id, date) VALUES (${item.id}, '${lib.mysqlRealEscapeString(item.body)}', ${item.user_id}, ${item.from_id}, FROM_UNIXTIME(${item.date}, '%Y-%m-%d %H:%i:%s'));\n`
		})

		console.log('Записываю messages SQL файл')

		fs.writeFile("./homyachat.sql", insertSql, "utf8", err => {
			if(err) {
				return console.log(err);
			}

			console.log("SQL файл записан");
		});
	})
	.catch(error => console.error(`=== ERROR ===\n${error}\n==============`))
}

module.exports = {
	getUsersInfo,
	getAllMessages
}