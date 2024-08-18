import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { fetchMetadata } from './fetchMetadata.js';
import { apiKey } from '../config/apiConfig.js';
import axios from 'axios';
import { jest } from '@jest/globals';

// Mock Express
const app = express();
app.use(bodyParser.json());
app.post('/fetch-metadata', fetchMetadata);

// Mock Axios
jest.mock('axios');

// Test 1: Valid URL
test('should return metadata for valid URL', async () => {
  // Mock response
  axios.get.mockResolvedValue({
    data: { title: 'Title1', description: 'Description1', image: 'Image1' }
  });

  const response = await request(app)
    .post('/fetch-metadata')
    .send({ urls: ['https://example.com'] });

  expect(response.status).toBe(200);
  expect(response.body[0]).toEqual({
    title: 'Title1',
    description: 'Description1',
    image: 'Image1',
    url: 'https://example.com'
  });
});

// Test 2: Invalid URL format
test('should return error for invalid URL format', async () => {
  const response = await request(app)
    .post('/fetch-metadata')
    .send({ urls: ['invalid-url'] });

  expect(response.status).toBe(200);
  expect(response.body[0].error).toBe('Invalid URL format: invalid-url');
});

// Test 3: API error response
test('should handle API error response', async () => {
  // Mock error response
  axios.get.mockRejectedValue(new Error('API error'));

  const response = await request(app)
    .post('/fetch-metadata')
    .send({ urls: ['https://example.com'] });

  expect(response.status).toBe(200);
  expect(response.body[0].error).toMatch(/Could not fetch metadata for URL: https:\/\/example.com/i);
});

// Test 4: No URLs provided
test('should return error if no URLs are provided', async () => {
  const response = await request(app)
    .post('/fetch-metadata')
    .send({});

  expect(response.status).toBe(400);
  expect(response.body.error).toBe('Invalid input. Expecting an array of URLs.');
});

// Test 5: Empty URL array
test('should handle empty URL array', async () => {
  const response = await request(app)
    .post('/fetch-metadata')
    .send({ urls: [] });

  expect(response.status).toBe(200);
  expect(response.body).toEqual([]);
});