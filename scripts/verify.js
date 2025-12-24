const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

const run = async () => {
    try {
        console.log('--- Starting Verification ---');

        // 1. Create Users
        console.log('\nCreating Users...');
        const alice = await axios.post(`${API_URL}/users`, { name: 'Alice', email: 'alice@test.com' });
        const bob = await axios.post(`${API_URL}/users`, { name: 'Bob', email: 'bob@test.com' });
        const charlie = await axios.post(`${API_URL}/users`, { name: 'Charlie', email: 'charlie@test.com' });
        console.log('Users created:', alice.data.name, bob.data.name, charlie.data.name);

        // 2. Create Group
        console.log('\nCreating Group...');
        const group = await axios.post(`${API_URL}/groups`, {
            name: 'Trip',
            members: [alice.data._id, bob.data._id, charlie.data._id]
        });
        console.log('Group created:', group.data.name);

        const groupId = group.data._id;

        // 2.5 Add Member (David)
        console.log('\nCreating User David...');
        const david = await axios.post(`${API_URL}/users`, { name: 'David', email: 'david@test.com' });

        console.log('Adding David to Group...');
        await axios.post(`${API_URL}/groups/${groupId}/members`, { userId: david.data._id });
        console.log('David added to group.');

        // 3. Add Expense (Equal Split)
        // Alice pays 300, split equally (100 each)
        console.log('\nAdding Expense (Equal Split: Alice pays 300)...');
        await axios.post(`${API_URL}/expenses`, {
            description: 'Lunch',
            amount: 300,
            paidBy: alice.data._id,
            group: groupId,
            splitType: 'EQUAL',
            splits: [
                { user: alice.data._id },
                { user: bob.data._id },
                { user: charlie.data._id }
            ]
        });

        // 4. Add Expense (Exact Split)
        // Bob pays 100, Alice owes 20, Charlie owes 80
        console.log('\nAdding Expense (Exact Split: Bob pays 100)...');
        await axios.post(`${API_URL}/expenses`, {
            description: 'Taxi',
            amount: 100,
            paidBy: bob.data._id,
            group: groupId,
            splitType: 'EXACT',
            splits: [
                { user: alice.data._id, amount: 20 },
                { user: charlie.data._id, amount: 80 }
            ]
        });

        // 5. Add Expense (Percentage Split)
        // Alice pays 200. Alice 50%, Bob 25%, Charlie 25%
        // Alice owes: 100, Bob owes: 50, Charlie owes: 50
        console.log('\nAdding Expense (Percentage Split: Alice pays 200)...');
        await axios.post(`${API_URL}/expenses`, {
            description: 'Dinner',
            amount: 200,
            paidBy: alice.data._id,
            group: groupId,
            splitType: 'PERCENTAGE',
            splits: [
                { user: alice.data._id, percentage: 50 },
                { user: bob.data._id, percentage: 25 },
                { user: charlie.data._id, percentage: 25 }
            ]
        });

        // 6. Get Balance
        console.log('\nFetching Group Balance...');
        const balance = await axios.get(`${API_URL}/groups/${groupId}/balance`);
        console.log('Balances:', JSON.stringify(balance.data.balances, null, 2));
        console.log('Simplified Debts:', JSON.stringify(balance.data.simplifiedDebts, null, 2));

        console.log('\n--- Verification Complete ---');
    } catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

run();
