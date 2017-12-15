const ejs = require('ejs')

const layout = require('./layout.ejs')
const login = require('./login.ejs')
const interaction = require('./interaction.ejs')

module.exports = {
  interaction: ejs.compile(interaction),
  layout: ejs.compile(layout),
  login: ejs.compile(login)
}
