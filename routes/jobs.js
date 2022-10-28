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
  } catch (error) {
    next(error);
  }
});

router.get('/:jobId/details', authenticateUser, async (req, res, next) => {
  const jobId = req.params.jobId;

  try {
    const results = await axios.get(
      'http://dev3.dansmultipro.co.id/api/recruitment/positions/' + jobId
    );
    res.send(results?.data);
  } catch (error) {
    next(error);
  }
});

// https://gist.github.com/jherax/f11d669ba286f21b7a2dcff69621eb72
function filterArray(array, filters) {
  const filterKeys = Object.keys(filters);

  return array.filter((item) => {
    // validates all filter criteria
    return filterKeys.every((key) => {
      // ignores non-function predicates
      if (typeof filters[key] !== 'function') return true;
      return filters[key](item[key]);
    });
  });
}

router.post('/search', async (req, res, next) => {
  const page = parseInt(req.query?.page) || undefined;
  const pageSize = parseInt(req.query?.pageSize) || undefined;
  const filterCriteria = req?.body || null;

  try {
    const { data } = await axios.get(
      'http://dev3.dansmultipro.co.id/api/recruitment/positions.json'
    );

    // const filters = {
    //   size: (size) => size === 50 || size === 70,
    //   color: (color) => ['blue', 'black'].includes(color.toLowerCase()),
    //   locations: (locations) =>
    //     locations.find((x) => ['JAPAN', 'USA'].includes(x.toUpperCase())),
    //   details: (details) => details.length < 30 && details.width >= 70
    // };

    const filterFns = _.mapValues(
      filterCriteria,
      function (filterValue, filterKey, filterCriteria) {
        return (objectPropertyValue) => {
          return objectPropertyValue.includes(filterValue);
        };
      }
    );

    const filteredItems = filterArray(data, filterFns);

    const paginatedItems = getPaginatedItems(filteredItems, page, pageSize);

    res.send(paginatedItems);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
