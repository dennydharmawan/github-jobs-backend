const router = require('express').Router();
const axios = require('axios');
const _ = require('lodash');

const authenticateUser = require('./verifyToken');

function getPaginatedItems(items, page, pageSize) {
  const pg = page || 1;
  const pgSize = pageSize || 1;
  const offset = (pg - 1) * pgSize;
  const pagedItems = _.drop(items, offset).slice(0, pgSize);

  return {
    page: pg,
    pageSize: pgSize,
    total: items.length,
    total_pages: Math.ceil(items.length / pgSize),
    data: pagedItems
  };
}

router.get('/', async (req, res, next) => {
  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.limit);

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
