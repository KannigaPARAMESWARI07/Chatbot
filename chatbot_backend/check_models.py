import google.generativeai as genai

# ⚠️ Replace this with your actual Gemini API key
genai.configure(api_key="AIzaSyAm_3bKJqg527CgIe76D2F8dCsWRlP3wuY")

for model in genai.list_models():
    print(model.name, model.supported_generation_methods)
