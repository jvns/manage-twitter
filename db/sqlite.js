var Sequelize = require('sequelize');
// default user list
var User;
console.log(__dirname + '/../.data/database.sqlite');
console.log(require('fs').readdir("/app"), function(err, files) {console.log("asdf", err, files)})
// setup a new database
// using database credentials set in .env
var sequelize = new Sequelize('database', process.env.DB_USER, process.env.DB_PASS, {
  host: '0.0.0.0',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
    // Security note: the database is saved to the file `database.sqlite` on the local filesystem. It's deliberately placed in the `.data` directory
    // which doesn't get copied if someone remixes the project.
  storage: '/app/.data/database.sqlite'
});

// authenticate with the database
sequelize.authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
    // define a new table 'users'
    User = sequelize.define('users', {
      id: {
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      token: {
        type: Sequelize.STRING
      },
      tokenSecret: {
        type: Sequelize.STRING
      },
    });
    
    setup();
  })
  .catch(function (err) {
    console.log('Unable to connect to the database: ', err);
  })
  ;

function findOrCreate(profile, token, tokenSecret, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.id === profile.id) {
        return cb(null, record);
      }
    }
    console.log('Creating user');
    User.create({
      id: profile.id,
      username: profile.username,
      token: token,
      tokenSecret: tokenSecret
    });
    return cb(null, user);
  });
}

// populate table with default users
function setup(){
  User.sync() // using 'force' it drops the table users if it already exists, and creates a new one
    .then(function(){
      // Add the default users to the database
      // for(var i=0; i<users.length; i++){ // loop through all users
      //   User.create({ firstName: users[i][0], lastName: users[i][1]}); // create a new entry in the users table
      // }
      
    });  
}

module.exports = {
  findOrCreate: findOrCreate,
};