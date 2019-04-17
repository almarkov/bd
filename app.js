const db         = require('./bd.js')
db.init()

var uuid_admin = db.insert( 'roles', { name: 'admin' })
var uuid_user  = db.insert( 'roles', { name: 'user' })

var user1_uuid = db.insert( 'users', { login: 'user1', role: uuid_user })
var user2_uuid = db.insert( 'users', { login: 'user2', role: uuid_user })
var admin_uuid = db.insert( 'users', { login: 'admin', role: uuid_admin })

console.log( db.read('users', { join: {role: 'roles'}}) )

db.delete( 'users', user1_uuid )
db.delete( 'users', user2_uuid )
db.delete( 'users', admin_uuid )


db.delete( 'roles', uuid_admin )
db.delete( 'roles', uuid_user )
