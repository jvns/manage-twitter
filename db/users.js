module.exports = {
  findById: findById,
  findByUsername: findByUsername,
  findOrCreate: findOrCreate,
  fetch: fetch
};

function findById(id, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.id === id) {
        return cb(null, record);
      }
    }
    cb(new Error('User ' + id + ' does not exist'));
  });
}

function findByUsername(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}

function findOrCreate(profile, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.provider === profile.provider && record.id === profile.id) {
        return cb(null, record);
      }
    }
    console.log('Creating user');
    var user = {
      id: profile.id,
      provider: profile.provider,
      username: profile.username,
      displayName: profile.displayName,
      emails: profile.emails
    };
    records.push(user);
    console.log(records);
    return cb(null, user);
  });
}

// yeah... probably should return copies, but whatever.
function fetch() {
  console.log('returning all records');
  return records;
}

var records = [];