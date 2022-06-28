var mongoose = require("mongoose");
 //mongoose.connect('mongodb://localhost/satsangRegisteration', { useNewUrlParser: true });
// mongoose.connect(
//   "mongodb+srv://harshmetkel24:harshmetkel24@cluster0.rwdpg.mongodb.net/chalo-satsang-taraf?retryWrites=true&w=majority",
//   {
//     useNewUrlParser: true,
//   }
// );
mongoose.connect(
  "mongodb+srv://isha_121:isha123@cluster0.opawjal.mongodb.net/chalo-satsang-taraf?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

var conn = mongoose.connection;
conn.on("connected", function () {
  console.log("database is connected successfully");
});
conn.on("disconnected", function () {
  console.log("database is disconnected successfully");
});
conn.on("error", console.error.bind(console, "connection error:"));
module.exports = conn;
