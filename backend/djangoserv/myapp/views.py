from django.shortcuts import render, redirect
from dotenv import load_dotenv
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
import requests
import os
import binascii

def home(request):
    return render(request, 'home.html')



def initiate_oauth(request):
    load_dotenv() # load .env to environment
    state = binascii.hexlify(os.urandom(16)).decode()  # To prevent CSRF attacks
    client_id = os.getenv("42_CLIENT_ID")
    redirect_uri = "http://127.0.0.1:8000/oauth_callback"  
    auth_url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&state={state}&response_type=code"
    return redirect(auth_url)



def oauth_callback(request):
    if request.method == 'GET':
        code = request.GET.get('code')
        state = request.GET.get('state')
        client_id = os.getenv("42_CLIENT_ID")
        client_secret = os.getenv("42_CLIENT_SECRET")  
        

        # Exchange access token
        data = {
            'grant_type': 'authorization_code',
            'client_id': client_id,
            'client_secret': client_secret,
            'code': code,
            'redirect_uri': "http://127.0.0.1:8000/oauth_callback"
        }
        response = requests.post(url ="https://api.intra.42.fr/oauth/token", data=data)
        if response.status_code == 200:
            access_token = response.json().get('access_token')
            headers = {"Accept": "application/json", "Authorization": f"Bearer {access_token}"}
            response = requests.get(url="https://api.intra.42.fr/v2/me", headers=headers)
            if response.status_code == 200:
                user_data = response.json()
                usr1 = {
                    'id': user_data.get('id'),
                    'login': user_data.get('login'),
                    'full_name': user_data.get('usual_full_name'),
                }
                print(usr1)
                return HttpResponseRedirect(reverse('home'))
            
        return HttpResponseRedirect(reverse('error'))
    else:
        return HttpResponseRedirect(reverse('home'))

def  error(request):
    return HttpResponse("An error occurred.", status=400)