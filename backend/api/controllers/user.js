const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const prisma = new PrismaClient();

exports.signup = async (req, res) => {
    const { email, password, name } = req.body;

    console.log('Signup request body:', req.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    
    try {
        const existingUser = await prisma.users.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        res.status(201).json({ message: 'User created', userId: user.id });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({
        where: { email },
    });

    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '1h',
    });

    res.status(200).json({ token });
};

exports.profile = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.users.findUnique({
        where: { id: decoded.userId },
    });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
};
