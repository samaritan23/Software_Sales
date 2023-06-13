const Sales = require('../models/Sales')

class SalesController{
    async getTotalItems(req, res) {
        let { start_date, end_date, department } = req.query
        
        let start_date_formatted = new Date(start_date.split(" ").join("+"))
        let end_date_formatted = new Date(end_date.split(" ").join("+"))

        try{
            let items = await Sales.countDocuments({department: department, date: {$gte: start_date_formatted, $lte: end_date_formatted}})
            res.status(200).send(items.toString())
        } catch(error) {
            res.status(500).json({message : "500 Server Error"})
        }
    }

    async getNthMostTotalItem(req, res) {
        const { item_by ,start_date, end_date, n } = req.query

        let start_date_formatted = new Date(start_date.split(" ").join("+"))
        let end_date_formatted = new Date(end_date.split(" ").join("+"))

        try{
            const item = await Sales.aggregate(
                                                [{$match: { date: {$gte: start_date_formatted, $lte: end_date_formatted } }}, 
                                                {$group: { _id: "$software", [item_by]: { $sum: "$"+item_by } }},
                                                {'$sort': {[item_by]: -1}}]
                                            ).skip(parseInt(n)-1).limit(1)
            
            res.status(200).send(item[0]._id)
        } catch(error) {
            res.status(500).json({message : "500 Server Error"})
        }

    }

    async getPercentDeptWise(req, res) {
        const { start_date, end_date } = req.query

        let start_date_formatted = new Date(start_date.split(" ").join("+"))
        let end_date_formatted = new Date(end_date.split(" ").join("+"))
        
        const result = await Sales.aggregate([{ $match : { date: {$gte: start_date_formatted, $lte: end_date_formatted} } }, { $group: { _id : "$department", percent:{$sum:"$seats"} } }])

                        // find({date: {$gte: start_date, $lte: end_date}})
        
        if (!result) {
            res.status(500).json({message : "500 Server Error"})
        }

        let sum = 0
        for (let element of result) {
            sum += element.percent
        }
        for (let element of result) {
            element.percent = (element.percent/sum)*100
        }

        let finalRes = {}

        for (let element of result) {
            finalRes[element._id] = element.percent
        }

        res.status(200).json(finalRes)
    }

    async getMonthlySales(req, res) {
        const { product, year } = req.query

        const startDate = new Date(year, 0, 1);  // January 1st of the specified year
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);  // December 31st of the specified year

        const result = await Sales.find({software: product, date: { $gte: startDate, $lte: endDate }})

        let monthlySales = new Array(12)

        monthlySales.fill(0)

        for (let i in monthlySales) {
            for (let item of result) {
                if (i == item.date.getMonth()) {
                    monthlySales[i] += item.amount
                }
            }
        }

        res.status(200).send(monthlySales)
    }
}

module.exports = new SalesController()