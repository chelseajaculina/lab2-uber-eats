# Uber Eats Simulation - Part 2 with Docker, Kubernetes, Kafka, AWS, and Redux #

A prototype of Uber Eats web app using Django backend and React frontend. This project lets users browse and order food from restaurants, manage profiles, etc.

This project part 2 enhances the Lab 1 Uber Eats prototype by containerizing services, orchestrating them with Kubernetes, integrating Kafka for asynchronous messaging, deploying the application to AWS, and using Redux for state management.

## Features ## 
 ### Backend ### 
+ Dockerized Services: User, Restaurant, and Order services.
+ Kubernetes Orchestration: For scaling and managing microservices communication.
+ Kafka Integration: For asynchronous order processing and event-based communication.
+ MongoDB: As the database for storing sessions and encrypted passwords using Passport.js.

### Frontend ### 
+ Redux State Management:
++ User Authentication (JWT Tokens).
++ Restaurant Data (Menus, Lists).
++ Order Data (Cart, Order Status Updates).

## Technologies Used ## 
+ Backend: Django, Django REST Framework, Docker, Kubernetes, Kafka, MongoDB, AWS
+ Frontend: React, Axios (for API requests),Redux
+ Database: SQLite, MongoDB (with encrypted passwords)

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
+ Redux 

## Steps ##
### 1. Clone this repository: ### 

- git clone https://github.com/your-username/your-project-name.git
- cd your-project-name

### 2. Backend Setup: ### 

#### 1. Dockerize Services:   ####
 
+ Build Docker images for User, Restaurant, and Order services.
+ Use the provided Dockerfile in each service directory.

+ Example:
  + docker build -t user-service ./user-service

#### 2. Kubernetes Deployment #### 
+ Deploy the services to a Kubernetes cluster
+ Apply the YAML configuration files:
  + kubectl apply -f kubernetes-config/

#### 3.  Kafka Setup ####

+ Add Kafka to the Kubernetes cluster.
+ Ensure topics like order_creation and status_update are created.
+ Example:
 + kafka-topics.sh --create --topic order_creation --bootstrap-server localhost:9092

 #### 4. MongoDB Setup #### 
+ Deploy MongoDB in the Kubernetes cluster or connect to an external MongoDB instance.
+ Ensure user sessions are stored in MongoDB.

 #### 5. Run Backend Services #### 
+ Use Kubernetes commands to start and monitor the services: kubectl get pods

### 3. Frontend Setup ###

#### 1. Navigate to frontend directory ####
cd frontend 

#### 2. Install dependencies ####
npm install

#### 3. Start the React development server ####
npm start

#### 4. Redux Integration #### 
+ Ensure Redux actions, reducers, and store are set up as per the provided example.
+ Update frontend components to use Redux for state management.


## Deployment to AWS ## 

1. Containerize the application using Docker.
2. Push Docker images to AWS Elastic Container Registry (ECR).
3. Deploy the Kubernetes cluster on AWS EKS.
4. Use AWS S3 for hosting static files and Route 53 for domain management.
5. Monitor services using AWS CloudWatch.



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
