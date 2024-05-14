from django.shortcuts import render, redirect
from dotenv import load_dotenv
from django.http import HttpResponseRedirect, HttpResponse, HttpRequest
from django.urls import reverse
import requests
import os
import binascii

def home(request: HttpRequest) -> HttpResponse:
    return render(request, 'home.html')



def initiate_oauth(request: HttpRequest) -> HttpResponseRedirect:
    load_dotenv() # load .env to environment
    state = binascii.hexlify(os.urandom(16)).decode()  # To prevent CSRF attacks
    client_id = os.getenv("42_CLIENT_ID")
    redirect_uri = "http://127.0.0.1:8000/oauth_callback"  
    auth_url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&state={state}&response_type=code"
    request.session['oauth_state'] = state # Save state in session
    return redirect(auth_url)



def oauth_callback(request: HttpRequest) -> HttpResponseRedirect:
    if request.method == 'GET':

        code = request.GET.get('code')
        if not code or not code.isalnum():
            return HttpResponseRedirect(reverse('error'), status=400)
        
        state = request.GET.get('state')
        if state is None or not state.isalnum():
            return HttpResponseRedirect(reverse('error'), status=400)
        
        # Retrieve & compare state and session state
        stored_state = request.session.get('oauth_state')
        if state != stored_state:
            return HttpResponseRedirect(reverse('error'), status=400)
        
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
            if not access_token:
                return HttpResponseRedirect(reverse('error'), status=401)
            
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
            
        return HttpResponseRedirect(reverse('error'), status=401)
    else:
        return HttpResponseRedirect(reverse('home'))

def error(status: int) -> HttpResponse:
    if status == 400:
        return HttpResponse("Bad Request. Status code: 400", status=status)
    elif status == 401:
        return HttpResponse("Unauthorized. Status code: 401", status=status)
    elif status == 500:
        return HttpResponse("Internal Server Error. Status code: 500", status=status)
    else:
        return HttpResponse(f"An error occurred. Status code: {status}", status=status)