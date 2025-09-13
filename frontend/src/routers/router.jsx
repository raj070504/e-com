import OwnerDashboard from "../pages/admin/DashBoard"
import OrdersPage from "../pages/Books/order";
import Login from "../components/Login";
import Register from "../components/Register";
import { createBrowserRouter } from "react-router-dom";
import CartPage from "../pages/Books/CartPage";
import App from "../App";
import Home from "../pages/home/Home";
import CheckoutPage from "../pages/Books/CheckoutPage";
import BooksPage from "../pages/Books/BooksPage";
import AddBook from "../pages/admin/AddBook";
import ManageBooks from "../pages/admin/ManageBooks";
import ManageOrders from "../pages/admin/ManageOrders";
import AdminLayout from "../pages/admin/AdminLayout";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App></App>,
    children:[
       {
        path: '/',
        element: <Home/>
       },
       {
        path: '/orders',
        element: <OrdersPage/>
       },
       {
        path: '/about',
        element: <div>about</div>
       },
       {
        path: '/login',
        element: <Login/>
       },
       {
        path: '/register',
        element: <Register/>
       },
       {
        path: "/cart",
        element: <CartPage/>
      },
      {
        path: "/checkout",
        element: <CheckoutPage/>
      },{
        path:"/allBooks",
        element: <BooksPage/>
      },
      {
        path:"/dashboard",
        element:<OwnerDashboard/>
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <OwnerDashboard />
      },
      {
        path: 'books',
        element: <ManageBooks />
      },
      {
        path: 'add-book',
        element: <AddBook />
      },
      {
        path: 'orders',
        element: <ManageOrders />
      }
    ]
  }
]);

export default router;