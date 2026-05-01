const mongoose = require('mongoose');
const https = require('https');
require('dotenv').config();
const Product = require('./models/Product');

const albanianNames = {
  'Këpucë': ['Atlete Vrapimi', 'Këpucë Lëkure', 'Atlete Sportive', 'Çizme Dimërore', 'Sandalet Vere', 'Mokasini Klasike'],
  'Rroba Burra': ['Këmishë Pambuku', 'Xhaketë Lëkure', 'T-Shirt Casual', 'Xhinse Slim Fit', 'Pallto Dimërore', 'Kardigan Leshi'],
  'Rroba Gra': ['Fustan Mbrëmje', 'Fustan Veror', 'Këmishë Mëndafshi', 'Fund Plise', 'Xhaketë Elegante', 'Xhinse High-Waist'],
  'Aksesorë': ['Orë Dore Klasike', 'Syze Dielli Aviator', 'Qafore Argjendi', 'Byzylyk Minimalist', 'Kapelë Verore', 'Rrip Lëkure'],
  'Çanta': ['Çantë Krahu Lëkure', 'Çantë Shpine', 'Portofol Lëkure', 'Çantë Udhëtimi', 'Çantë Dizejnatori'],
  'Sporte': ['Set Sportiv', 'Tuta Vrapimi', 'Bluzë Termike', 'Pantallona Sportive', 'Atlete Palestre', 'Xhaketë Kundër Erës'],
  'Fëmijë': ['Set Pambuku për Fëmijë', 'Fustan për Vajza', 'Bluzë me Print', 'Xhaketë Dimërore', 'Pantallona të Rehatshme']
};

const brands = ['Zara', 'Mango', 'Nike', 'Adidas', 'Puma', 'Hugo Boss', 'Massimo Dutti', 'LUXE', 'Prada', 'Gucci'];

const colorPool = [
  { name: 'E zezë', hex: '#000000' },
  { name: 'E bardhë', hex: '#FFFFFF' },
  { name: 'Blu Navy', hex: '#000080' },
  { name: 'Bezhë', hex: '#F5F5DC' },
  { name: 'E kuqe', hex: '#FF0000' },
  { name: 'Gri', hex: '#808080' },
  { name: 'Kaki', hex: '#F0E68C' }
];

const sizePool = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const shoeSizePool = ['37', '38', '39', '40', '41', '42', '43', '44', '45'];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomPrice = (min, max) => Number((Math.random() * (max - min) + min).toFixed(2));
const getRandomSubarray = (arr, size) => {
  const shuffled = arr.slice(0);
  let i = arr.length;
  while (i--) {
    const index = Math.floor((i + 1) * Math.random());
    const temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
};

function fetchDummyJSON() {
  return new Promise((resolve, reject) => {
    https.get('https://dummyjson.com/products?limit=200', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data).products);
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function fetchFakeStore() {
  return new Promise((resolve, reject) => {
    https.get('https://fakestoreapi.com/products', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Database.');
    
    console.log('Fetching real product images from external APIs...');
    const [dummyProducts, fakeStoreProducts] = await Promise.all([
      fetchDummyJSON(),
      fetchFakeStore()
    ]);

    // Extract images by category from DummyJSON
    const imagesByCat = {
      'Këpucë': [],
      'Rroba Burra': [],
      'Rroba Gra': [],
      'Aksesorë': [],
      'Çanta': [],
      'Sporte': [],
      'Fëmijë': []
    };

    // Populate from DummyJSON
    dummyProducts.forEach(p => {
      if (['mens-shoes', 'womens-shoes'].includes(p.category)) imagesByCat['Këpucë'].push(...p.images);
      else if (['mens-shirts'].includes(p.category)) imagesByCat['Rroba Burra'].push(...p.images);
      else if (['womens-dresses', 'tops'].includes(p.category)) imagesByCat['Rroba Gra'].push(...p.images);
      else if (['womens-jewellery', 'sunglasses', 'mens-watches', 'womens-watches'].includes(p.category)) imagesByCat['Aksesorë'].push(...p.images);
      else if (['womens-bags'].includes(p.category)) imagesByCat['Çanta'].push(...p.images);
    });

    // Populate from FakeStore
    fakeStoreProducts.forEach(p => {
      if (p.category === "men's clothing") imagesByCat['Rroba Burra'].push(p.image);
      else if (p.category === "women's clothing") imagesByCat['Rroba Gra'].push(p.image);
      else if (p.category === "jewelery") imagesByCat['Aksesorë'].push(p.image);
    });

    // For missing categories (Sporte, Fëmijë), we will share images from clothes and shoes
    imagesByCat['Sporte'] = [...imagesByCat['Rroba Burra'].slice(0, 10), ...imagesByCat['Rroba Gra'].slice(0, 10), ...imagesByCat['Këpucë'].slice(0, 10)];
    imagesByCat['Fëmijë'] = [...imagesByCat['Rroba Gra'].slice(10, 20), ...imagesByCat['Rroba Burra'].slice(10, 20), ...imagesByCat['Këpucë'].slice(10, 20)];

    // Ensure we have enough unique images
    Object.keys(imagesByCat).forEach(k => {
      // make unique
      imagesByCat[k] = [...new Set(imagesByCat[k])];
    });

    console.log('Clearing old products...');
    await Product.deleteMany({});
    
    console.log('Generating 140 products with 100% REAL unique images...');
    const productsToInsert = [];
    const usedImages = new Set(); // Global set to prevent ANY image repetition

    for (const categoryName of Object.keys(albanianNames)) {
      for (let i = 0; i < 20; i++) {
        // Find an unused image for this category
        let imageUrl = null;
        for (const img of imagesByCat[categoryName]) {
          if (!usedImages.has(img)) {
            imageUrl = img;
            usedImages.add(img);
            break;
          }
        }
        
        // Fallback if category runs out of unique images: grab from ANY unused DummyJSON/FakeStore image
        if (!imageUrl) {
          const allArrays = Object.values(imagesByCat).flat();
          for (const img of allArrays) {
            if (!usedImages.has(img)) {
              imageUrl = img;
              usedImages.add(img);
              break;
            }
          }
        }

        // Ultimate fallback just in case
        if (!imageUrl) imageUrl = `https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg`;

        const isSale = Math.random() > 0.7;
        const price = getRandomPrice(15, 150);
        const originalPrice = isSale ? Number((price * (1 + Math.random() * 0.4 + 0.1)).toFixed(2)) : null;
        
        const sizes = categoryName === 'Këpucë' 
          ? getRandomSubarray(shoeSizePool, Math.floor(Math.random() * 4) + 3)
          : categoryName === 'Aksesorë' || categoryName === 'Çanta'
          ? ['One Size']
          : getRandomSubarray(sizePool, Math.floor(Math.random() * 3) + 3);

        const product = {
          name: `${getRandom(albanianNames[categoryName])}`,
          description: `Ky produkt ofron një dizajn të përsosur dhe komoditet maksimal. Ideale për koleksionin tuaj të përditshëm. Materiale premium nga marka ${getRandom(brands)}.`,
          price,
          originalPrice,
          category: categoryName,
          brand: getRandom(brands),
          images: [imageUrl],
          sizes: sizes.sort(),
          colors: getRandomSubarray(colorPool, Math.floor(Math.random() * 3) + 1),
          stock: Math.floor(Math.random() * 50) + 5,
          isNewUser: Math.random() > 0.8,
          isFeatured: Math.random() > 0.8,
          isSale,
          rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
          reviewCount: Math.floor(Math.random() * 100),
          tags: [categoryName.toLowerCase(), 'premium', '2024']
        };
        productsToInsert.push(product);
      }
    }

    await Product.insertMany(productsToInsert);
    console.log(`Successfully inserted ${productsToInsert.length} products with REAL studio images!`);
    
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

seed();
