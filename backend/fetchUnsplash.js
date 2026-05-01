const https = require('https');
https.get('https://unsplash.com/napi/search/photos?query=mens-fashion&page=1&per_page=30', {
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("Status Code:", res.statusCode);
    if(res.statusCode === 200) {
        const json = JSON.parse(data);
        console.log("Results count:", json.results.length);
        console.log("Sample ID:", json.results[0].id);
        console.log("Sample URL:", json.results[0].urls.regular);
    } else {
        console.log(data.substring(0, 500));
    }
  });
}).on('error', (e) => {
  console.error(e);
});
