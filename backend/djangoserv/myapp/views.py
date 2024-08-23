from django.shortcuts import render, redirect
from dotenv import load_dotenv
from django.http import HttpResponseRedirect, HttpResponse, HttpRequest, JsonResponse
from django.urls import reverse
import requests
import os
import binascii

load_dotenv()

CLIENT_ID = os.getenv('42_CLIENT_ID')
REDIRECT_URI = os.getenv('42_REDIRECT_URI')
CLIENT_SECRET = os.getenv('42_CLIENT_SECRET')

def home(request: HttpRequest) -> HttpResponse:
    return render(request, 'home.html')

def profile(request: HttpRequest) -> HttpResponse:
    first_name = request.session.get('first_name')
    if not first_name:
        return HttpResponse(status = 401)
    return JsonResponse({'first_name': first_name})

def logout(request: HttpRequest) -> HttpResponse:
    request.session.clear()
    return HttpResponseRedirect('/')

def initiate_oauth(request: HttpRequest) -> HttpResponseRedirect:
    state = binascii.hexlify(os.urandom(16)).decode()  # To prevent CSRF attacks
    auth_url = f"https://api.intra.42.fr/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&state={state}&response_type=code"  
    request.session['oauth_state'] = state 
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
        del request.session['oauth_state']
        # Exchange access token
        data = {
            'grant_type': 'authorization_code',
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'code': code,
            'redirect_uri': REDIRECT_URI
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
                request.session['first_name'] = user_data.get('first_name');
                request.session['user_login'] = usr1['login']
                request.session['campus'] = user_data.get('campus')[0].get('name')
                campus_id = user_data.get('campus')[0].get('id')
                response = requests.get(url=f"https://api.intra.42.fr/v2/campus/{campus_id}/users", headers=headers)
                data = response.json()
                users = [{'id': data['id'], 'login': data['login'], 'full_name':data['usual_full_name']} for data in data]
                request.session['users'] = users
                return HttpResponseRedirect('/')
        return HttpResponseRedirect(reverse('error'), status=401)
    else:
        return HttpResponseRedirect(reverse('error'), status=401)

def post_oauth(request):
    return render(request, 'post_oauth.html')

def error(status: int) -> HttpResponse:
    if status == 400:
        return HttpResponse("Bad Request. Status code: 400", status=status)
    elif status == 401:
        return HttpResponse("Unauthorized. Status code: 401", status=status)
    elif status == 500:
        return HttpResponse("Internal Server Error. Status code: 500", status=status)
    else:
        return HttpResponse(f"An error occurred. Status code: {status}", status=status)
