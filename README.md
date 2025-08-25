# BiteXpress - Campus Food Ordering System

A modern food ordering platform designed specifically for Thapar University, connecting students with campus vendors.

## 🚀 Features

- **Student Portal**: Browse shops, place orders, track delivery
- **Vendor Dashboard**: Manage menu, process orders, track sales
- **Email Verification**: OTP-based verification for Thapar students
- **Real-time Updates**: Order status tracking
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Nodemailer for emails

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd BiteXpress
```

### 2. Setup Frontend
```bash
# Install frontend dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Setup Backend
```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 4. Configure Environment Variables
Edit `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/BiteXpress
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5000
NODE_ENV=development
```

### 5. Start Backend Server
```bash
# In server directory
npm run dev
```

The API will be available at `http://localhost:5000`

### 6. Install & Start MongoDB

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

## 📱 Usage

### For Students:
1. Register with Thapar email (@thapar.edu)
2. Verify email with OTP
3. Browse available shops
4. Add items to cart and place orders
5. Track order status in real-time

### For Vendors:
1. Register as shopkeeper
2. Set up shop profile and location
3. Add menu items with categories
4. Manage incoming orders
5. Update order status (pending → accepted → preparing → ready → completed)

## 🗄️ Data Storage

### Current Setup (localStorage)
- Data stored in browser's localStorage
- Suitable for development and testing
- Data persists until browser cache is cleared

### Production Setup (MongoDB)
- All data stored in MongoDB database
- User authentication with JWT tokens
- Real-time synchronization across devices
- Proper data relationships and validation

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user  
- `POST /api/auth/verify-otp` - Verify email OTP
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Shops & Menu
- `GET /api/shops` - Get all shops
- `GET /api/shops/:id` - Get shop with menu
- `POST /api/menu` - Add menu item (shopkeeper)
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Orders
- `POST /api/orders` - Create order (student)
- `GET /api/orders/my-orders` - Get student orders
- `GET /api/orders/shop-orders` - Get shopkeeper orders
- `PUT /api/orders/:id/status` - Update order status

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
# Set environment variables
# Deploy server/ directory
```

### Database (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create cluster and database
3. Update MONGODB_URI in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation in `/docs`

---

Made with ❤️ for Thapar University students