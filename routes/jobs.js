const router = require('express').Router();
const axios = require('axios');

const authenticateUser = require('./verifyToken');

router.get('/', async (req, res, next) => {
  try {
    const results = await axios.get(
      'http://dev3.dansmultipro.co.id/api/recruitment/positions.json'
    );

    res.send(results?.data);
  } catch (err) {
    next(err);
  }
});

router.get('/:jobId/details', authenticateUser, async (req, res, next) => {
  const jobId = req.params.jobId;

  try {
    const results = await axios.get(
      'http://dev3.dansmultipro.co.id/api/recruitment/positions/' + jobId
    );
    res.send(results?.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
