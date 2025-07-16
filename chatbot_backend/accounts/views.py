from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import serializers  # ✅ Needed for custom validation

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User
from .serializers import RegisterSerializer, UserSerializer


# ✅ Register view
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully"})
    return Response(serializer.errors, status=400)


# ✅ Get current logged-in user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


# ✅ Custom token serializer using email + password
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({'error': 'Invalid email or password'})

        if not user.check_password(password):
            raise serializers.ValidationError({'error': 'Invalid email or password'})

        # 💡 JWT needs 'username' and 'password'
        data = super().validate({
            'username': user.username,
            'password': password
        })

        # Add extra user info to response
        data['user_id'] = user.id
        data['username'] = user.username
        data['email'] = user.email
        data['role'] = user.role

        return data

    def to_internal_value(self, data):
        # 💡 This fixes the "username is required" error
        return {
            'email': data.get('email'),
            'password': data.get('password')
        }



# ✅ Custom token view
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
