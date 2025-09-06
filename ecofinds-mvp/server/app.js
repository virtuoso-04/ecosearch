// Express app entry point
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());


const sequelize = require('./sequelize');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/products', productRoutes);

// Sync DB and start server if run directly
if (require.main === module) {
	const PORT = process.env.PORT || 5000;
	sequelize.sync().then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	});
}

module.exports = app;
