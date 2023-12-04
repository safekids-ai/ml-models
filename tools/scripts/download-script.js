const fs = require('fs');
const axios = require('axios');
const path = require('path');

const baseUrl = 'https://github.com/safekids-ai/ml-models-binary/raw/main/models/';
const files = ['nlp.onnx', 'vision.onnx', 'nlp.json', 'vision.json', 'vocab.txt'];
const targetDir = path.join(__dirname, "..", "..", "model_files");

fs.mkdir(targetDir, {recursive: true}, (error) => {
  if (error) {
    console.error('Error creating directory:', error);
    throw error;
  }
});

files.forEach(file => {
  const fileUrl = baseUrl + file;
  const filePath = path.join(targetDir, file);

  if (!fs.existsSync(filePath)) {
    axios({
      method: 'get',
      url: fileUrl,
      responseType: 'stream'
    }).then(response => {
      response.data.pipe(fs.createWriteStream(filePath));
      console.log(`Downloaded: ${file}`);
    }).catch(error => {
      console.error(`Failed to download ${file}:`, error);
    });
  } else {
    console.log(`File already exists: ${file}`);
  }
});
