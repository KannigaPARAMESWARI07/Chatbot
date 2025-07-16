import os
from dotenv import load_dotenv
load_dotenv() # This reads your .env file
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Message
from .serializers import MessageSerializer
from accounts.models import User
import google.generativeai as genai

# Configure Gemini API

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


def chat_with_gemini(prompt):
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    return response.text


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    data = request.data.copy()
    data['sender'] = request.user.id
    serializer = MessageSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_history(request):
    user = request.user
    ai_user = User.objects.filter(username='GeminiAI').first()

    if not ai_user:
        return Response([])

    messages = Message.objects.filter(
        sender__in=[user, ai_user],
        receiver__in=[user, ai_user]
    ).order_by('timestamp')

    history = [
        {
            'text': m.text,
            'sender': 'You' if m.sender == user else 'Gemini',
            'timestamp': m.timestamp
        }
        for m in messages
    ]

    return Response(history)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def talk_to_gemini(request):
    user = request.user
    user_message = request.data.get('message')
    if not user_message:
        return Response({'error': 'No message provided'}, status=400)

    ai_user, _ = User.objects.get_or_create(username='GeminiAI')

    Message.objects.create(
        sender=user,
        receiver=ai_user,
        text=user_message,
        is_from_ai=False
    )

    ai_reply = chat_with_gemini(user_message)

    Message.objects.create(
        sender=ai_user,
        receiver=user,
        text=ai_reply,
        is_from_ai=True
    )

    return Response({'reply': ai_reply})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_clients(request):
    if not request.user.is_superuser:
        return Response({'error': 'Forbidden'}, status=403)

    clients = User.objects.exclude(username='GeminiAI').exclude(id=request.user.id)
    data = [{'id': u.id, 'username': u.username, 'email': u.email} for u in clients]
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversation_with_user(request, user_id):
    from_user = request.user
    to_user = User.objects.get(id=user_id)

    messages = Message.objects.filter(
        sender__in=[from_user, to_user],
        receiver__in=[from_user, to_user],
        is_from_ai=False
    ).order_by('timestamp')

    data = [
        {
            'sender': m.sender.username,
            'text': m.text,
            'timestamp': m.timestamp,
        }
        for m in messages
    ]

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message_to_user(request):
    to_user_id = request.data.get('to_user_id')
    text = request.data.get('text')

    to_user = User.objects.get(id=to_user_id)
    Message.objects.create(
        sender=request.user,
        receiver=to_user,
        text=text,
        is_from_ai=False
    )
    return Response({'status': 'Message sent'})
