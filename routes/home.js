const router = require('express').Router();

router.get('/', (req, res) => {
  res.send(process.env.CORS_ALLOWED_ORIGINS);
});

module.exports = router;
