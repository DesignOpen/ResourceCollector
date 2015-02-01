var express = require('express');
var router = express.Router();

/* Process new resource form */
router.post('/resource', function(req, res) {
  console.log(req.body);
  // STUB: Process form
});

module.exports = router;
