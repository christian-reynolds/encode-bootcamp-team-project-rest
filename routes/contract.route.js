let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();

// Contract Model
let contractSchema = require('../models/Contract');

// CREATE Contract
router.route('/create-contract').post((req, res, next) => {
  contractSchema.create(req.body, (error, data) => {
    if (error) {
      return error
    } else {
      console.log(data)
      res.json(data)
    }
  })
});

// Get all Contracts
router.route('/').get((req, res) => {
    contractSchema.find((error, data) => {
      if (error) {
        return error
      } else {
        res.json(data)
      }
    })
  })
  
  // Get Single Contract by Id
  router.route('/edit-contract/:id').get((req, res) => {
    contractSchema.findById(req.params.id, (error, data) => {
      if (error) {
        return error
      } else {
        res.json(data)
      }
    })
  })

  // Get single contract by address
  router.route('/get-contract/:address').get((req, res) => {
    contractSchema.findOne({ address: req.params.address }, (error, data) => {
      if (error) {
        return error
      } else {
        res.json(data)
      }
    })
  })
  
  
  // Update Contract
  router.route('/update-contract/:id').put((req, res, next) => {
    contractSchema.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, (error, data) => {
      if (error) {
        console.log(error)
        return error;        
      } else {
        res.json(data)
        console.log('Contract updated successfully !')
      }
    })
  })
  
  // Delete Contract
  router.route('/delete-contract/:id').delete((req, res, next) => {
    contractSchema.findByIdAndRemove(req.params.id, (error, data) => {
      if (error) {
        return error;
      } else {
        res.status(200).json({
          msg: data
        })
      }
    })
  })
  
  module.exports = router;
