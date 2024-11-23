from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RestaurantSignUpView, 
    GetRestaurantDataView, 
    DishListCreateView, 
    DishDetailView,
    RestaurantProfileView, 
    UploadRestaurantProfilePictureView,
    RestaurantLoginView,
    GetProfilePictureView,
    RestaurantViewSet,
    DishViewSet,
    RestaurantDetailView,
    RestaurantListView,
    RestaurantLogoutView,
    TokenRefreshView,
    CreateOrderView,
    OrderDetailView,  # Import the new view
)

# Create a router for the viewsets
router = DefaultRouter()
router.register(r'restaurants', RestaurantViewSet)
router.register(r'dishes', DishViewSet)

urlpatterns = [
    # Restaurant sign-up and login
    path('signup/', RestaurantSignUpView.as_view(), name='restaurant-signup'),
    path('login/', RestaurantLoginView.as_view(), name='restaurant-login'),
    path('logout/', RestaurantLogoutView.as_view(), name='restaurant-logout'),

    # Restaurant profile management
    path('me/', GetRestaurantDataView.as_view(), name='restaurant-profile'),
    path('update/', RestaurantProfileView.as_view(), name='restaurant-profile-update'),
    path('upload-profile-picture/', UploadRestaurantProfilePictureView.as_view(), name='restaurant-profile-upload'),
    path('profile-picture/', GetProfilePictureView.as_view(), name='restaurant-profile-picture'),
    path('<str:restaurant_name>/', RestaurantDetailView.as_view(), name='restaurant-detail'),
    
    path('restaurants/list/', RestaurantListView.as_view(), name='restaurant-list'),

    # Dish management
    path('restaurants/dishes/', DishListCreateView.as_view(), name='dish-list-create'),
    path('dishes/<int:dish_id>/', DishDetailView.as_view(), name='dish-detail'),

    # JWT token refresh
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Include the router URLs for RestaurantViewSet and DishViewSet
    path('api/', include(router.urls)),

    # Orders
    path('api/orders/create/', CreateOrderView.as_view(), name='create_order'),
    path('api/orders/<int:order_id>/', OrderDetailView.as_view(), name='order-detail'),  # Add the detail view for orders
]
