const Sales = require('../models/Sales')

class SalesController{
    async getTotalItems(req, res) {
        let { start_date, end_date, department } = req.params
        const start_date_formatted = new Date(start_date)
        const end_date_formatted = new Date(end_date)
        const items = await Sales.count({department: department, date: {$gte: start_date_formatted, $lte: end_date_formatted}})

        res.status(200).send(items.length)
    }

    async getNthMostTotalItem(req, res) {
        const { item_by ,start_date, end_date, n } = req.params

        const item = await Sales.find({date: {$gte: start_date, $lte: end_date}})
                        .sort({[item_by]: -1}).skip(n-1)
                        .limit(1)

        res.status(200).json(item)
    }

    async getPercentDeptWise(req, res) {
        const { start_date, end_date } = req.params
        
        const result = await Sales.find({date: {$gte: start_date, $lte: end_date}})
                        .aggregate([{ $group: {department : "$department", percent:{$sum:"$seats"}}}])
        
        if (!result) {
            res.status(500).json({message : "500 Server Error"})
        }

        let sum = 0
        for (let element in result) {
            sum += element.percent
        } 
        for (let element in result) {
            element.percent = (element.percent/sum)*100
        }

        let finalRes = {}

        for (let element in result) {
            finalRes[element.department] = element.percent
        }

        res.status(200).json(finalRes)
    }

    async getMonthlySales(req, res) {
        const { product, year } = req.params

        const startDate = new Date(year, 0, 1);  // January 1st of the specified year
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);  // December 31st of the specified year

        const result = await Sales.find({software: product, date: { $gte: startDate, $lte: endDate }})

        let monthlySales = new Array(12)

        for (let item in monthlySales) {
            monthlySales[item] = 0
        }

        for (let i in monthlySales) {
            for (let item in result) {
                if (i == item.date.getMonth()) {
                    monthlySales[i] += item.amount
                }
            }
        }

        res.status(200).send(monthlySales)
    }
}

module.exports = new SalesController()