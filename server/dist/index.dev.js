"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _helmet = _interopRequireDefault(require("helmet"));

var _cors = _interopRequireDefault(require("cors"));

var _expressRateLimit = _interopRequireDefault(require("express-rate-limit"));

var _metadataRoutes = _interopRequireDefault(require("./routes/metadataRoutes.js"));

var _dotenv = require("dotenv");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _dotenv.config)();
var app = (0, _express["default"])();
var PORT = process.env.PORT || 5000;
var rateLimiter = (0, _expressRateLimit["default"])({
  windowMs: 1000,
  // 1 second
  max: 5 // Limit each IP to 5 requests per windowMs

}); // Security middleware

app.use((0, _helmet["default"])());
app.use((0, _cors["default"])({
  origin: 'http://localhost:3000'
}));
app.use(rateLimiter); // Middleware to parse JSON bodies

app.use(_bodyParser["default"].json());
app.use('/', _metadataRoutes["default"]);
app.listen(PORT, function () {
  console.log("Server is running on port ".concat(PORT));
});