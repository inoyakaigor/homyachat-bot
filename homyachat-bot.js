'use strict';

const vk = new (require('vk-io'))
const token = require('./token')
const sqlGens = require('./sqlGenerator')

const chatlans = [2627994, 2360141, 5643035, 1470688, 331812, 18860458, 3061187, 4448694, 25316102, 837792, 7395082, 1595041, 140489943, 21724721, 1843269, 104617133, 5806103, 3150553, 4305360, 14558328, 5598104, 582714, 184108835, 196496031, 4464494, 204740388, 2988356, 3606926, 33746867, 7518321, 407397, 191785560, 211046009, 14528595, 7508641, 7715161, 228748595, 3742636, 46069783, 437224, 6176067, 3515714, 39605033, 259146000, 260957762, 25171976, 30739898, 6037797, 31669153, 21381735, 19238032, 205023859, 23558499, 18807784, 103504847, 6560997, 424652459]

console.log('🔑 Твой токен:', token)

vk.setToken(token);

vk.setOptions({
	/* Optimize the number of requests per second  */
	call: 'execute'
});

const longpollStarted = () => {
	console.log('Longpoll started')
/*	const dialogs = vk.api.messages.get().then(
		(resp) => {
			let {items} = resp
			let homyachat = items.filter(item => item.chat_id == HOMYACHAT_ID)
			console.log('items', items.length, items)
		}
	)*/

	sqlGens.getUsersInfo(chatlans)
	console.log("Получаю список сообщений")
	sqlGens.getAllMessages()


}

vk.longpoll.start()
.then(longpollStarted)
.catch(error => {console.error(`=== ERROR ===\n${error}\n==============`); process.exit(0)})

const regexReverse = /\/reverse (.+)/i;

vk.longpoll.on('message', message => {
	/* Empty message */
	if (message.text === null) {
		return;
	}

	if (message.text.startsWith('!#cat')) {
		return message.sendPhoto({
			value: 'http://lorempixel.com/400/200/cats/',
			options: {
				filename: 'cat.jpg'
			}
		});
	}

	if (message.text.startsWith('!#hi')) {
		return message.send('Hi!');
	}

	if (message.text.startsWith('!#time')) {
		return message.send((new Date).toString());
	}

	if (message.text.startsWith('!#random')) {
		return message.send(Math.random());
	}

	if (regexReverse.test(message.text)) {
		const text = message.text.match(regexReverse)[1];

		return message.send(text.split('').reverse().join(''));
	}
});
