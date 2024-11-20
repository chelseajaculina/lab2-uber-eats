from django.urls import path, include
from rest_framework.routers import DefaultRouter
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
)
from rest_framework_simplejwt.views import TokenRefreshView

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
]
