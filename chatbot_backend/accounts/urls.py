from django.urls import path
from .views import MyTokenObtainPairView, register_user, get_current_user
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register_user'),
    path('me/', get_current_user, name='get_current_user'),
]
