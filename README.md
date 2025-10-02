# BiteXpress - Food Ordering Platform for Thapar Students

A comprehensive food ordering web application built specifically for Thapar University students and campus shop owners. This platform enables students to order food from various campus shops while providing shop owners with tools to manage their menu and orders.

## 🚀 Features

### For Students
- **Thapar ID Authentication**: Sign up using official Thapar email (@thapar.edu)
- **Browse Campus Shops**: View all available shops and their menus
- **Easy Ordering**: Add items to cart and place orders with cash payment
- **Order Tracking**: Real-time status updates from preparation to delivery
- **Order History**: View all past orders and their status

### For Shop Owners
- **Shop Management**: Register and manage shop details
- **Menu Management**: Add, edit, and delete menu items with categories
- **Order Processing**: Accept/reject orders and update status
- **Customer Information**: Access customer details for order fulfillment
- **Order History**: Track all orders and sales

### General Features
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live order status tracking
- **Secure Authentication**: JWT-based authentication system
- **College-friendly UI**: Modern, intuitive design optimized for students

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js
- **MongoDB Atlas** for database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation

## 📦 Project Structure

```
bitexpress-food-ordering/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context for state management
│   │   ├── pages/           # Application pages/routes
│   │   └── main.tsx         # Application entry point
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # Node.js backend application
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API route handlers
│   ├── middleware/          # Custom middleware
│   └── server.js            # Server entry point
└── package.json             # Root package.json for scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bitexpress-food-ordering
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the frontend (port 3000) and backend (port 5000) servers concurrently.

## 📱 Usage

### Student Registration
1. Go to the homepage and click "Sign Up as Student"
2. Fill in your details with your Thapar email ID
3. Provide your 9-digit roll number, hostel, year, and branch
4. Create a secure password and complete registration

### Shop Owner Registration
1. Click "Sign Up as Shop Owner" on the homepage
2. Enter your personal and shop details
3. Select your shop location and type
4. Wait for admin verification (automatic for demo)

### Placing Orders (Students)
1. Browse available shops on your dashboard
2. Click on a shop to view their menu
3. Add items to your cart
4. Review your order and place it with cash payment
5. Track your order status in real-time

### Managing Orders (Shop Owners)
1. View incoming orders on your dashboard
2. Accept or reject orders with optional reasons
3. Update order status as you prepare and complete orders
4. Access customer contact information for coordination

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register/student` - Student registration
- `POST /api/auth/register/shopkeeper` - Shop owner registration
- `POST /api/auth/login` - User login

### Students
- `GET /api/students/profile` - Get student profile
- `GET /api/shops` - Get all active shops
- `GET /api/shops/:id/menu` - Get shop menu

### Orders
- `POST /api/orders` - Place new order
- `GET /api/orders/my-orders` - Get student's orders
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id/cancel` - Cancel order

### Shop Owners
- `POST /api/shopkeepers/menu` - Add menu item
- `GET /api/shopkeepers/menu` - Get shop menu
- `PUT /api/shopkeepers/menu/:id` - Update menu item
- `DELETE /api/shopkeepers/menu/:id` - Delete menu item
- `GET /api/shopkeepers/orders` - Get shop orders
- `PUT /api/shopkeepers/orders/:id/status` - Update order status

## 🎨 Design Features

- **Modern UI**: Clean, professional design with smooth animations
- **Responsive Layout**: Optimized for all screen sizes
- **Color System**: Consistent primary (blue) and accent (orange) colors
- **Typography**: Inter font family for excellent readability
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Micro-interactions**: Subtle hover effects and transitions

## 🔐 Security Features

- **Input Validation**: Server-side validation for all user inputs
- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Proper CORS configuration
- **Email Validation**: Thapar email verification for students
- **SQL Injection Prevention**: MongoDB with proper queries

## 🚀 Deployment

### Frontend Deployment
The frontend can be deployed to platforms like Vercel, Netlify, or any static hosting service.

### Backend Deployment
The backend can be deployed to platforms like Heroku, Railway, or any Node.js hosting service.

### Environment Configuration
Make sure to set the production environment variables:
- `MONGODB_URI`: Your production MongoDB connection string
- `JWT_SECRET`: A secure secret key for JWT tokens
- `NODE_ENV`: Set to "production"

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Thapar Institute of Engineering & Technology
- All the campus food vendors who inspired this project
- The student community for their valuable feedback

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

Made with ❤️ for the Thapar community