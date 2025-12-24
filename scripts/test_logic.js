const { flatten } = require('mongoose');
const { calculateBalances, simplifyDebts } = require('../src/utils/balanceUtils');
const assert = require('assert');

console.log('--- Testing Balance Logic ---');

// Mock Data
// Users: A, B, C
const members = ['A', 'B', 'C'];
const expenses = [
    {
        paidBy: 'A',
        amount: 300,
        splits: [
            { user: 'A', amount: 100 },
            { user: 'B', amount: 100 },
            { user: 'C', amount: 100 }
        ]
    },
    {
        paidBy: 'B',
        amount: 100,
        splits: [
            { user: 'A', amount: 20 },
            { user: 'C', amount: 80 }
        ]
    }
];

// 1. Calculate Balances
// A paid 300. Own share 120 (100+20). Net: +180
// B paid 100. Own share 100. Net: 0
// C paid 0. Own share 180 (100+80). Net: -180
const balances = calculateBalances(expenses, members);
console.log('Balances:', balances);

// Expected: A: 180, B: 0, C: -180
assert.strictEqual(balances['A'], 180);
assert.strictEqual(balances['B'], 0);
assert.strictEqual(balances['C'], -180);
console.log('✓ Balance Calculation Correct');

// 2. Simplify Debts
// Expect C pays A 180
const simplified = simplifyDebts(balances);
console.log('Simplified:', simplified);

assert.strictEqual(simplified.length, 1);
assert.strictEqual(simplified[0].from, 'C');
assert.strictEqual(simplified[0].to, 'A');
assert.strictEqual(simplified[0].amount, 180);
console.log('✓ Simplification Logic Correct');

console.log('--- Logic Tests Passed ---');
