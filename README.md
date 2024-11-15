# Uber Eats Simulation - Part 1 #

A prototype of Uber Eats web app using Django backend and React frontend. This project lets users browse and order food from restaurants, manage profiles, etc.

## Contents ## 
+ Overview
+ Technologies Used
+ Features
+ Installation
+ How to Use
+ API Endpoints
+ Project Structure


## Overview ## 
This app lets users sign up, log in, browse restaurants, view menus, and place orders using Django for backend logic and database and React for user interface.

## Technologies Used ## 
+ Backend: Django, Django REST Framework
+ Frontend: React, Axios (for API requests)
+ Database: SQLite 

## Features ## 
+ User registration and login
+ User profile management
+ Restaurant and menu listings
+ Order management (view, place, and track orders)
+ Favorite restaurants
  
## Installation Requirements ##
+ Python 3.x
+ Node.js with npm
+ Django
+ React

## Steps ##
1. Clone this repository:

- git clone https://github.com/your-username/your-project-name.git
- cd your-project-name

2. Backend Setup (Django):
- Go to the backend folder:
cd backend

- Create a virtual environment and install dependencies:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

- Apply database migrations:
python manage.py migrate

- Create an admin user:
python manage.py createsuperuser


- Start the Django server:
python manage.py runserver

<img width="727" alt="image" src="https://github.com/user-attachments/assets/06323c20-5b7a-4797-adbc-89495a9043e3">

3. Frontend Setup (React):
- Go to the frontend folder:
cd ../frontend

- Install npm packages:
npm install

- Start the React development server:

npm start

<img width="668" alt="image" src="https://github.com/user-attachments/assets/1c29ff5d-ea10-4a4b-b21a-801e351660bc">


<img width="561" alt="image" src="https://github.com/user-attachments/assets/c7f677e5-b484-4804-869f-beece0b15c05">



## After installing: ## 

+ Frontend: Open http://localhost:3000
+ Backend: Open http://localhost:8000

<img width="1057" alt="image" src="https://github.com/user-attachments/assets/9e35735e-fe41-4174-a1b5-706b88e25f3c">

<img width="1099" alt="image" src="https://github.com/user-attachments/assets/36ca66fa-68a9-4a07-bcc4-dd77d67b16f2">

<img width="1102" alt="image" src="https://github.com/user-attachments/assets/8e00f26c-6f1b-46f4-beba-8b14ec511846">




## API Endpoints ## 
Main API routes:

+ http://127.0.0.1:8000/api/
<img width="284" alt="image" src="https://github.com/user-attachments/assets/cfbd2be7-683e-4b36-95d8-a71622886489">

+ http://127.0.0.1:8000/api/customers/
  <img width="656" alt="image" src="https://github.com/user-attachments/assets/981ebf29-f58f-42c2-9d27-05eed4845bbd">

+ http://127.0.0.1:8000/api/restaurants/
<img width="677" alt="image" src="https://github.com/user-attachments/assets/ac947ba3-866c-42e4-a38a-504802cc51a1">


## Project Structure
+ main project
  + backend
  + frontend
  + screenshots
