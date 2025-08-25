export interface User {
  _id: string;
  email: string;
  password: string;
  userType: 'student' | 'shopkeeper';
  name: string;
  phone?: string;
  createdAt: Date;
}

export interface Student extends User {
  rollNumber: string;
  hostel?: string;
}

export interface Shopkeeper extends User {
  shopName: string;
  shopDescription: string;
  location: string;
  isVerified: boolean;
  menu: MenuItem[];
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  image?: string;
}

export interface Order {
  _id: string;
  studentId: string;
  shopkeeperId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'rejected';
  orderTime: Date;
  estimatedTime?: number;
  notes?: string;
  studentDetails: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}