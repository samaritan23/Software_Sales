const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const salesController = require('../controllers/SalesController')
require('dotenv').config()

router.get('/total_items', salesController.getTotalItems)
router.get('/nth_most_total_item', salesController.getNthMostTotalItem)
router.get('/percentage_of_department_wise_sold_items', salesController.getPercentDeptWise)
router.get('/monthly_sales', salesController.getMonthlySales)

module.exports = router