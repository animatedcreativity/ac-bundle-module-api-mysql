exports = module.exports = exports = module.exports = function() {
  var mysql = typeof require !== "undefined" ? require("mysql") : undefined;
  var mod = {
    escape: function(value) {
      return mysql.escape(value);
    },
    connect: function() {
      return new Promise(function(resolve, reject) {
        if (!app.has(mod.connection) || mod.connection.state.split("disconnect").length > 1) {
          mod.connection = mysql.createConnection(appConfig.mysql);
          mod.connection.connect(function(error, data) {
            resolve(true);
          });
        } else {
          resolve(true);
        }
      });
    },
    requestCallback: async function(callback, errorCallback, query, type) {
      if (!app.has(type)) type = "single";
      await mod.connect();
      var result = {};
      await new Promise(function(resolve, reject) {
        mod.connection.query(query, function(error, records, fields) {
          result = {error: error, records: records, fields: fields};
          resolve(true);
        });
      });
      if (!app.has(result.error)) {
        var data = type === "single" ? (result.records.length > 0 ? result.records[0] : undefined) : result.records;
        if (typeof callback === "function") await callback(data, result.fields);
      } else {
        if (typeof errorCallback === "function") await errorCallback("Could not run query: " + query, result.error);
      }
    }
  };
  return mod;
}