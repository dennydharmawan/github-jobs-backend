const router = require('express').Router();
const axios = require('axios');
const _ = require('lodash');

const authenticateUser = require('./verifyToken');

function getPaginatedItems(items, page = 1, pageSize = 5) {
  const offset = (page - 1) * pageSize;
  const pagedItems = _.drop(items, offset).slice(0, pageSize);

  return {
    page,
    pageSize,
    total: items.length,
    total_pages: Math.ceil(items.length / pageSize),
    data: pagedItems
  };
}

router.get('/', async (req, res, next) => {
  const page = parseInt(req.query?.page) || undefined;
  const pageSize = parseInt(req.query?.pageSize) || undefined;

  try {
    const { data } = await axios.get(
      'http://dev3.dansmultipro.co.id/api/recruitment/positions.json'
    );

    const paginatedItems = getPaginatedItems(data, page, pageSize);

    res.send(paginatedItems);
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
