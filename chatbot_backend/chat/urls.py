from django.urls import path
from .views import (
    send_message,
    get_chat_history,
    talk_to_gemini,
    get_all_clients,
    get_conversation_with_user,
    send_message_to_user
)

urlpatterns = [
    path('send/', send_message),
    path('history/', get_chat_history),
    path('gemini/', talk_to_gemini),
    path('admin/users/', get_all_clients),
    path('admin/chat/<int:user_id>/', get_conversation_with_user),
    path('admin/send/', send_message_to_user),
]
