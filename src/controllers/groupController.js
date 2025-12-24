const Group = require('../models/Group');
const User = require('../models/User');
const { calculateBalances, simplifyDebts } = require('../utils/balanceUtils');

// Create a new group
exports.createGroup = async (req, res) => {
    try {
        const { name, members } = req.body;
        // Validate members exist
        const users = await User.find({ _id: { $in: members } });
        if (users.length !== members.length) {
            return res.status(400).json({ error: 'One or more users not found' });
        }

        const group = new Group({ name, members });
        await group.save();
        res.status(201).json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get group balance
exports.getGroupBalance = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate('expenses')
            .populate('members', 'name email');

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const balances = calculateBalances(group.expenses, group.members.map(m => m._id));
        const simplified = simplifyDebts(balances);

        // Enhance response with user names
        const memberMap = {};
        group.members.forEach(m => memberMap[m._id.toString()] = m);

        const readableBalances = {};
        Object.keys(balances).forEach(id => {
            if (memberMap[id]) readableBalances[memberMap[id].name] = balances[id];
        });

        const readableSimplification = simplified.map(t => ({
            from: memberMap[t.from].name,
            to: memberMap[t.to].name,
            amount: t.amount
        }));

        res.json({
            balances: readableBalances,
            simplifiedDebts: readableSimplification
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Add members to group
exports.addMember = async (req, res) => {
    try {
        const { userId } = req.body;
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if already member
        if (group.members.includes(userId)) {
            return res.status(400).json({ error: 'User already in group' });
        }

        group.members.push(userId);
        await group.save();

        res.json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
