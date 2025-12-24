const Expense = require('../models/Expense');
const Group = require('../models/Group');

exports.addExpense = async (req, res) => {
    try {
        const { description, amount, paidBy, group, splitType, splits } = req.body;

        // Validate Group exists
        const groupDoc = await Group.findById(group);
        if (!groupDoc) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Validate Split Logic
        let processedSplits = [];

        if (splitType === 'EQUAL') {
            const splitAmount = amount / splits.length;
            processedSplits = splits.map(split => ({
                user: split.user,
                amount: splitAmount
            }));
            // Check for rounding issues? 
            // For simplicity, we assume 2 decimals handled or standard float behavior suitable for this exercise.
            // Ideally, the last person picks up the remainder.
        } else if (splitType === 'EXACT') {
            const totalSplit = splits.reduce((sum, split) => sum + split.amount, 0);
            if (Math.abs(totalSplit - amount) > 0.01) { // Floating point tolerance
                return res.status(400).json({ error: 'Splits amount does not match total amount' });
            }
            processedSplits = splits;
        } else if (splitType === 'PERCENTAGE') {
            const totalPercent = splits.reduce((sum, split) => sum + split.percentage, 0);
            if (totalPercent !== 100) {
                return res.status(400).json({ error: 'Percentages must calculate to 100' });
            }
            processedSplits = splits.map(split => ({
                user: split.user,
                amount: (amount * split.percentage) / 100,
                percentage: split.percentage
            }));
        } else {
            return res.status(400).json({ error: 'Invalid split type' });
        }

        const expense = new Expense({
            description,
            amount,
            paidBy,
            group,
            splitType,
            splits: processedSplits
        });

        await expense.save();

        // Add expense to group for easier tracking
        groupDoc.expenses.push(expense._id);
        await groupDoc.save();

        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
