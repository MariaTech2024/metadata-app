"use strict";

var _supertest = _interopRequireDefault(require("supertest"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _fetchMetadata = require("./fetchMetadata.js");

var _apiConfig = require("../config/apiConfig.js");

var _axios = _interopRequireDefault(require("axios"));

var _globals = require("@jest/globals");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Mock Express
var app = (0, _express["default"])();
app.use(_bodyParser["default"].json());
app.post('/fetch-metadata', _fetchMetadata.fetchMetadata); // Mock Axios

_globals.jest.mock('axios'); // Test 1: Valid URL


test('should return metadata for valid URL', function _callee() {
  var response;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Mock response
          _axios["default"].get.mockResolvedValue({
            data: {
              title: 'Title1',
              description: 'Description1',
              image: 'Image1'
            }
          });

          _context.next = 3;
          return regeneratorRuntime.awrap((0, _supertest["default"])(app).post('/fetch-metadata').send({
            urls: ['https://example.com']
          }));

        case 3:
          response = _context.sent;
          expect(response.status).toBe(200);
          expect(response.body[0]).toEqual({
            title: 'Title1',
            description: 'Description1',
            image: 'Image1',
            url: 'https://example.com'
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}); // Test 2: Invalid URL format

test('should return error for invalid URL format', function _callee2() {
  var response;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap((0, _supertest["default"])(app).post('/fetch-metadata').send({
            urls: ['invalid-url']
          }));

        case 2:
          response = _context2.sent;
          expect(response.status).toBe(200);
          expect(response.body[0].error).toBe('Invalid URL format: invalid-url');

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // Test 3: API error response

test('should handle API error response', function _callee3() {
  var response;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // Mock error response
          _axios["default"].get.mockRejectedValue(new Error('API error'));

          _context3.next = 3;
          return regeneratorRuntime.awrap((0, _supertest["default"])(app).post('/fetch-metadata').send({
            urls: ['https://example.com']
          }));

        case 3:
          response = _context3.sent;
          expect(response.status).toBe(200);
          expect(response.body[0].error).toMatch(/Could not fetch metadata for URL: https:\/\/example.com/i);

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // Test 4: No URLs provided

test('should return error if no URLs are provided', function _callee4() {
  var response;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap((0, _supertest["default"])(app).post('/fetch-metadata').send({}));

        case 2:
          response = _context4.sent;
          expect(response.status).toBe(400);
          expect(response.body.error).toBe('Invalid input. Expecting an array of URLs.');

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // Test 5: Empty URL array

test('should handle empty URL array', function _callee5() {
  var response;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap((0, _supertest["default"])(app).post('/fetch-metadata').send({
            urls: []
          }));

        case 2:
          response = _context5.sent;
          expect(response.status).toBe(200);
          expect(response.body).toEqual([]);

        case 5:
        case "end":
          return _context5.stop();
      }
    }
  });
});