import axios from 'axios';
import { apiKey } from '../config/apiConfig.js';
import { isValidUrlFormat } from '../utils/urlUtils.js';

export const fetchMetadata = async (req, res) => {
  const { urls } = req.body;
  console.log('Received URLs:', urls);

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Invalid input. Expecting an array of URLs.' });
  }

  const metadataPromises = urls.map(async (url) => {
    try {
      if (!isValidUrlFormat(url)) {
        return { error: `Invalid URL format: ${url}` };
      }

      const response = await axios.get(`https://api.linkpreview.net/?key=${apiKey}&q=${encodeURIComponent(url)}`);
      
      if (!response.data || response.data.error) {
        throw new Error(`Invalid metadata response for URL: ${url}`);
      }

      const { title, description, image } = response.data;

      return {
        title: title || 'No title available',
        description: description || 'No description available',
        image: image || 'No image available',
        url: url,
      };
    } catch (error) {
      return { error: `Could not fetch metadata for URL: ${url}. ${error.message}` };
    }
  });

  const metadata = await Promise.all(metadataPromises);
  res.json(metadata);
};