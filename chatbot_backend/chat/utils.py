import google.generativeai as genai
from django.conf import settings

def chat_with_gemini(prompt):
    genai.configure(api_key=settings.GEMINI_API_KEY)
    
    model = genai.GenerativeModel('gemini-pro')
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"
