const https = require('https');

https.get('https://api.escuelajs.co/api/v1/products?limit=50', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const products = JSON.parse(data);
    const fashion = products.filter(p => p.category.name === 'Clothes' || p.category.name === 'Shoes');
    console.log(`Found ${fashion.length} fashion products out of 50.`);
    if (fashion.length > 0) {
      console.log('Sample images:', fashion[0].images);
    }
  });
}).on('error', (e) => {
  console.error(e);
});
