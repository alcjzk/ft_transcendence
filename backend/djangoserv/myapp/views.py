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
    redirect_uri = "http://127.0.0.1:8000/oauth_callback"  # Adjust this to your callback URL
    auth_url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&state={state}&response_type=code"
    return redirect(auth_url)



def oauth_callback(request):
    if request.method == 'GET':
        code = request.GET.get('code')
        state = request.GET.get('state')
        client_id = os.getenv("42_CLIENT_ID")
        client_secret = os.getenv("42_CLIENT_SECRET")  
        

        # # Exchange the authorization code for an access token
        token_url = "https://api.intra.42.fr/oauth/token"
        data = {
            'grant_type': 'authorization_code',
            'client_id': client_id,
            'client_secret': client_secret,
            'code': code,
            'redirect_uri': "http://127.0.0.1:8000/oauth_callback"
        }
        response = requests.post(token_url, data=data)
        if response.status_code == 200:
            access_token = response.json().get('access_token')
            print(access_token)
        #     # Now you can use the access token to make authenticated requests on behalf of the user
        #     # Redirect the user to the desired page after successful login
            return HttpResponseRedirect(reverse('home'))
        else:
            # Handle error
            return HttpResponseRedirect(reverse('error'))
    else:
        # If the request is not a GET request, redirect to the home page
        return HttpResponseRedirect(reverse('home'))

def error(request):
    return HttpResponse("An error occurred.", status=400)