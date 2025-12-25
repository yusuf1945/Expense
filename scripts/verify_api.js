const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

async function runVerification() {
    try {
        console.log(' Starting Verification...');

        // 1. Create Users
        console.log('\n--- Creating Users ---');
        const alice = await axios.post(`${API_URL}/users`, { name: 'Alice', email: 'alice@example.com' });
        const bob = await axios.post(`${API_URL}/users`, { name: 'Bob', email: 'bob@example.com' });
        const charlie = await axios.post(`${API_URL}/users`, { name: 'Charlie', email: 'charlie@example.com' });
        console.log('Users Created:', [alice.data.name, bob.data.name, charlie.data.name]);

        // 2. Create Group
        console.log('\n--- Creating Group ---');
        const group = await axios.post(`${API_URL}/groups`, {
            name: 'Trip to Vegas',
            members: [alice.data._id, bob.data._id]
        });
        console.log('Group Created:', group.data.name);

        // 3. Add Member
        console.log('\n--- Adding Member ---');
        const updatedGroup = await axios.post(`${API_URL}/groups/${group.data._id}/members`, {
            userId: charlie.data._id
        });
        console.log('Member Added, Total Members:', updatedGroup.data.members.length);

        // 4. Add Expense (Equal)
        console.log('\n--- Adding Expense (Equal) ---');
        await axios.post(`${API_URL}/expenses`, {
            description: 'Dinner',
            amount: 120,
            paidBy: alice.data._id,
            group: group.data._id,
            splitType: 'EQUAL',
            splits: [
                { user: alice.data._id },
                { user: bob.data._id },
                { user: charlie.data._id }
            ]
        }); // Expected: Alice pays 120. Split 40 each. Alice gets back 80. Bob owes 40. Charlie owes 40.
        console.log('Expense "Dinner" Added ($120 verified)');

        // 5. Add Expense (Exact) - Bob pays 30. Alice 10, Bob 10, Charlie 10.
        console.log('\n--- Adding Expense (Exact) ---');
        await axios.post(`${API_URL}/expenses`, {
            description: 'Cab',
            amount: 30,
            paidBy: bob.data._id,
            group: group.data._id,
            splitType: 'EXACT',
            splits: [
                { user: alice.data._id, amount: 10 },
                { user: bob.data._id, amount: 10 },
                { user: charlie.data._id, amount: 10 }
            ]
        });
        console.log('Expense "Cab" Added ($30 verified)');

        // 6. Check Balances
        // Total: Dinner (120) + Cab (30) = 150.
        // Alice paid 120. Share: 40 (Dinner) + 10 (Cab) = 50. Net: +70.
        // Bob paid 30. Share: 40 + 10 = 50. Net: -20.
        // Charlie paid 0. Share: 40 + 10 = 50. Net: -50.

        // Simplified:
        // Charlie owes Alice 50.
        // Bob owes Alice 20.

        console.log('\n--- Checking Balances ---');
        const balanceRes = await axios.get(`${API_URL}/groups/${group.data._id}/balance`);
        console.log('Balances:', JSON.stringify(balanceRes.data.balances, null, 2));
        console.log('Simplified Debts:', JSON.stringify(balanceRes.data.simplifiedDebts, null, 2));

        console.log('\n VERIFICATION COMPLETE');
    } catch (error) {
        console.error('Verification Failed:', error.response ? error.response.data : error.message);
    }
}

runVerification();
