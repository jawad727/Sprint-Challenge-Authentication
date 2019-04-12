

const db = require('../database/dbConfig')

module.exports = {
    getUser,
    add,
    getBy
};

function getUser() {
    return db('users');
}


function getBy(filter) {
    return db('users').where(filter).first()
}


function getById(id) {
    return db('users').where({ id }).first()
}


function add(user) {
    return db('users')
    .insert(user)
    .then(ids => ids[0])
}
