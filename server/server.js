// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const profileRoutes = require('./routes/profileRoutes');
const materialsRoutes = require('./routes/materialsRoutes');
const planRoutes = require('./routes/planRoutes');
const summariesRoutes = require('./routes/summariesRoutes');
const userRoutes = require('./routes/upbdateroleRoutes');
const examRoutes = require('./routes/examRoutes');
const newsRoutes = require('./routes/newsRoutes');
require('dotenv').config();
const connectDB = require('./config/db');
const app = express();
const path = require('path');

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/departments', departmentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/departments', materialsRoutes);
app.use('/departments', planRoutes);
app.use('/api/summaries', summariesRoutes);
app.use('/api/users', userRoutes);
app.use('/departments', examRoutes);
app.use('/api', newsRoutes);
app.use('/download', express.static(path.join(__dirname, 'uploads/summaries')));
app.use(express.urlencoded({ extended: true }));




app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'حدث خطأ في الخادم',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.use((req, res) => {
   // console.log(`مسار غير موجود: ${req.method} ${req.url}`);
    res.status(404).json({
        message: 'المسار غير موجود'
    });
});


// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads/summaries');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}
// بدء الخادم
const startServer = async () => {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();