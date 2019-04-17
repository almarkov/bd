const jsonfile     = require('jsonfile')
const fs           = require('fs')
const uuidv4       = require('uuid/v4')

exports._path      = __dirname + '/data/'
exports._schema    = [ 'users', 'roles' ]

exports.path = function(table) {
    return exports._path + table + '.json'
}


exports.read = function(table, options) {
    var data = jsonfile.readFileSync( exports.path( table ), { throws: false } )
    if ( options && options.join ) {
        for ( var field in options.join ) {
            var join_table = options.join[field]
            var join_data = jsonfile.readFileSync( exports.path( join_table ), { throws: false } )
            for ( var _id in data ) {
                var join_id = data[_id][field]
                if ( join_id ) {
                    data[_id][field] = join_data[join_id]
                }
                else {
                    data[_id][field] = {}
                }
            }
        }
    }
    return data
}

exports.find = function(table, uuid) {
    var data = jsonfile.readFileSync( exports.path( table ), { throws: false } )
    return data[uuid]
}

exports.insert = function(table, item) {
    var data = jsonfile.readFileSync( exports.path( table ), { throws: false } )
    var uuid = uuidv4()
    item.uuid = uuid
    data[uuid] = item
    jsonfile.writeFileSync( exports.path( table ), data )
    return uuid
}

exports.delete = function(table, uuid) {
    var data = jsonfile.readFileSync( exports.path( table ), { throws: false } )
    delete data[uuid]
    jsonfile.writeFileSync( exports.path( table ), data )
}

exports.update = function(table, item, uuid) {
    var data = jsonfile.readFileSync( exports.path( table ), { throws: false } )
    if ( data[uuid] ) {
        for ( var field in item ) {
            data[uuid][field] = item[field]
        }
    }
    jsonfile.writeFileSync( exports.path( table ), data )
}

exports.update_all = function(table, items) {
    var data = jsonfile.readFileSync( exports.path( table ), { throws: false } )
    for ( var uuid in items ) {
        data[uuid] = items[uuid]
    }
    jsonfile.writeFileSync( exports.path( table ), data )
}

exports.update_or_create = function(table, item) {
    var data = jsonfile.readFileSync( exports.path( table ), { throws: false } )
    if ( data[item.uuid] ) {
        for ( var field in item ) {
            data[item.uuid][field] = item[field]
        }
    }
    else {
        var uuid = uuidv4()
        item.uuid = uuid
        data[uuid] = item
    }
    jsonfile.writeFileSync( exports.path( table ), data )
}


exports.init = function() {
    exports._schema.forEach((table) => {
        if ( !fs.existsSync( exports.path(table) ) ) {
            fs.writeFileSync( exports.path(table), '{}' )
        }
    })
    
}