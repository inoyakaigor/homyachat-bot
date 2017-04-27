const vk = new (require('vk-io'))
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (name, rl) => () => new Promise(resolve => {
  rl.question(`Введите ${name}: `, resolve)
})

const answers = {
  login:    '',
  appId:    '',
  phone:    '',
  password: ''
}

const setAnswer = name => answer => {
  answers[name] = answer
}

const askAppId    = question('app id', rl)
const askLogin    = question('login', rl)
const askPhone    = question('phone', rl)
const askPassword = question('password', rl)

askLogin()
.then(setAnswer('login'))
.then(askAppId)
.then(setAnswer('appId'))
.then(askPhone)
.then(setAnswer('phone'))
.then(askPassword)
.then(setAnswer('password'))
.then(() => {
  console.log(answers)

  vk.setOptions({
    app: answers.appId,
    login: answers.login,
    pass: answers.password,
    phone: answers.phone
  });

  const auth = vk.auth.standalone();

  auth.run()
  .then((token) => {
    //Вот этот токен надо подставить в vk.settoken()
    console.log('User token:', token)
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(0)
  })
  rl.close()
})