const calculateBalances = (expenses, members) => {
    const balances = {};

    // Initialize balances for all members
    members.forEach(memberId => {
        balances[memberId.toString()] = 0;
    });

    expenses.forEach(expense => {
        const paidBy = expense.paidBy.toString();
        const amount = expense.amount;

        // Payer gets +ve balance (they are owed money)
        if (balances[paidBy] !== undefined) {
            balances[paidBy] += amount;
        }

        // Splitters get -ve balance (they owe money)
        expense.splits.forEach(split => {
            const owedBy = split.user.toString();
            const splitAmount = split.amount;
            if (balances[owedBy] !== undefined) {
                balances[owedBy] -= splitAmount;
            }
        });
    });

    return balances;
};

const simplifyDebts = (balances) => {
    const debtors = [];
    const creditors = [];

    // Separate into debtors and creditors
    Object.keys(balances).forEach(user => {
        const amount = balances[user];
        if (amount < -0.01) debtors.push({ user, amount }); // Negative
        if (amount > 0.01) creditors.push({ user, amount }); // Positive
    });

    // Sort by magnitude (optional but good for stable results)
    debtors.sort((a, b) => a.amount - b.amount); // Ascending (most negative first)
    creditors.sort((a, b) => b.amount - a.amount); // Descending (most positive first)

    const transactions = [];

    let i = 0; // debtor index
    let j = 0; // creditor index

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        // The amount to settle is the minimum of what debtor owes and creditor is owed
        const amount = Math.min(Math.abs(debtor.amount), creditor.amount);

        transactions.push({
            from: debtor.user,
            to: creditor.user,
            amount: Number(amount.toFixed(2))
        });

        // Adjust amounts
        debtor.amount += amount;
        creditor.amount -= amount;

        // If settled, move to next
        if (Math.abs(debtor.amount) < 0.01) i++;
        if (creditor.amount < 0.01) j++;
    }

    return transactions;
};

module.exports = { calculateBalances, simplifyDebts };
