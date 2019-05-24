// import something here
const Discord = require('discord.js/browser')
// "async" is optional
export default async ({ Vue }) => {
  // something to do
  Vue.prototype.$logind = ''
  Vue.prototype.$dclient = new Discord.Client()
}
