# BiteXpress Backend

This is the backend API for the BiteXpress food ordering system.

## Setup Instructions

### 1. Install MongoDB

**On Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service

**On macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**On Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 2. Setup Backend

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration:
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

5. Start the server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### 3. API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-otp` - Verify email OTP
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

#### Shops
- `GET /api/shops` - Get all verified shops
- `GET /api/shops/:id` - Get shop details with menu

#### Menu (Shopkeeper only)
- `GET /api/menu/my-menu` - Get my menu items
- `POST /api/menu` - Add menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

#### Orders
- `POST /api/orders` - Create order (Student only)
- `GET /api/orders/my-orders` - Get student orders
- `GET /api/orders/shop-orders` - Get shopkeeper orders
- `PUT /api/orders/:id/status` - Update order status

### 4. Database Structure

The application uses MongoDB with the following collections:
- `users` - Students and shopkeepers
- `menuitems` - Food items from shops
- `orders` - Order history and status

### 5. Email Configuration

For OTP verification, you need to configure email settings:

1. For Gmail, enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in EMAIL_PASS

### 6. Development

- Use `npm run dev` for development (with nodemon)
- Use `npm start` for production
- MongoDB data is stored in your local MongoDB instance
- Check `http://localhost:5000/api/health` to verify the API is running