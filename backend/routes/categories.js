const express = require('express');
const router = express.Router();

const CATEGORIES = [
  { id: 'kepuce', name: 'Këpucë', icon: '👟', description: 'Sneakers, sandalet, taka dhe më shumë' },
  { id: 'rroba-burra', name: 'Rroba Burra', icon: '🧥', description: 'Bluza, xhinse, xhaketa dhe kostume' },
  { id: 'rroba-gra', name: 'Rroba Gra', icon: '👗', description: 'Fustan, bluzë, fund dhe çdo trend' },
  { id: 'aksesore', name: 'Aksesorë', icon: '⌚', description: 'Ora, zinxhirë, syzë dhe kapele' },
  { id: 'canta', name: 'Çanta', icon: '👜', description: 'Çanta dore, shpine dhe udhëtimi' },
  { id: 'sporte', name: 'Sporte', icon: '🏃', description: 'Veshje dhe pajisje sportive' },
  { id: 'femije', name: 'Fëmijë', icon: '🧸', description: 'Koleksion i plotë për fëmijë' },
];

router.get('/', (req, res) => res.json(CATEGORIES));

module.exports = router;
