import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Logout from './components/Logout';
import CustomerProfile from './components/CustomerProfile';
import 'bootstrap/dist/css/bootstrap.min.css';
import Welcome from './components/Welcome';
import RestaurantTab from './components/RestaurantTab';
import RestaurantSignUp from './components/RestaurantSignUp';
import RestaurantLogin from './components/RestaurantLogin';
import CustomerLogin from './components/CustomerLogin';
import CustomerSignUp from './components/CustomerSignUp';
import Favorites from './components/Favorites';
import RestaurantDashboard from './components/RestaurantDashboard';
import RestaurantProfile from './components/RestaurantProfile';
import OrdersManagement from './components/OrdersManagement';
import PandaExpress from './components/brands/PandaExpress';
import RestaurantMenu from './components/RestaurantMenu';
import RestaurantPage from './components/RestaurantPage';
import RestaurantList from './components/RestaurantList';
// import CartComponent from './components/CartComponent';

const App = () => {

    return (
        <Router>
            <MainLayout>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Welcome />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    
                    {/* Customer Routes */}
                    <Route path="customer/signup" element={<CustomerSignUp />} />
                    <Route path="customer/login" element={<CustomerLogin />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/customerprofile" element={<CustomerProfile />} />

                    {/* Restaurant Routes */}
                    <Route path="restaurant/signup" element={<RestaurantSignUp />} />
                    <Route path="restaurant/login" element={<RestaurantLogin />} />
                    <Route path="/restaurantdashboard" element={<RestaurantDashboard />} />
                    <Route path="/restaurantprofile" element={ <RestaurantProfile />}  />
                    <Route path="/restaurantmenu" element={ <RestaurantMenu/>}  />
                    <Route path="/orders" element={<OrdersManagement/>} />
                    <Route path="/restauranttab" element={<RestaurantTab />} />
                    <Route path="/restaurants" element={<RestaurantList />} />


                    {/* Dynamic Brand Routes */}
                    <Route path="/brands/:restaurantName" element={<RestaurantPage />} />
                    {/* <Route path="/brands/:restaurantName" element={<RestaurantPage /> : <Navigate to="/" />}/> */}

                    {/* Miscellaneous Routes */}
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/welcome" element={<Welcome />} />

                    {/* Example for static brand page */}
                    <Route path="/brands/panda-express" element={<PandaExpress />} />

                    {/* <Route path="/" element={<Home />} /> */}
                    {/* <Route path="/cart" element={<CartComponent />} /> */}
                </Routes>
            </MainLayout>
        </Router>
    );
};

const MainLayout = ({ children }) => (
    <div>
        {children}
    </div>
);

export default App;
