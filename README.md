I built this to learn system design, networking and devops.

## Architecture

**Microservices Reddit** is composed of 10 microservices written in different languages, deployed using kubernetes. These microservices communicate using rest apis. 

![Architecture of
microservices](/docs/img/graph.jpeg)

| Service                                              | Language      | Description                                                                                                                       |
| ---------------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [frontend](/frontend)                                | React.js      | Exposes an HTTP server to serve the website. Stores a JWT after the user signs in                                                 |
| [post-service](/post-service)                        | Python        | Adds and stores posts. Provides methods to retrieve posts based on different criteria                                             |
| [search-service](/search-service)                    | Java          | Ranks a list of posts based on matches with key words, which allows the user to search for posts                                  |
| [user-service](/src/user-service)                    | Python        | Adds, stores and retrieves users. Authenticates users and encodes a JWT                                                           |
| [recommendation-service](/recommendation-service)    | Python        | Maintains a list of posts visited by a single user to power recommendations                                                       |
| [email-service](/email-service)                      | Java          | Sends welcome email to users upon creation of new accounts                                                                        |
| [comment-service](/comment-service)                  | Python        | Adds and stores comments. Provides methods to retrieve comments based on different criteria                                       |                                            |
| [gateway](/gateway)                                  | Node.js       | Connects the frontend to all other services. Decodes the JWT and allows for asynchronous requests                                 |
| [reply-service](/reply-service)                      | Python        | Adds, stores, and retrieves a list of replies associated with each comment                                                        |
| [filter-service](/filter-service)                    | Java          | Filters and returns a list of posts based on different criteria                                                                   |

Docker images are at [https://hub.docker.com/repositories/eddyzheng](https://hub.docker.com/repositories/eddyzheng)

## Screenshots

| Home Page                                                                                          | Post                                                                                                   |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| ![Screenshot 1](/docs/img/posts.jpeg)                                                              | ![Screenshot 2](/docs/img/post.jpeg) 

## Quickstart
This app can be deployed for free on Minikube, a local kubernetes cluster 
1. Ensure you have the following requirements:
   - [MySQL](https://formulae.brew.sh/formula/mysql)
   - [Minikube](https://minikube.sigs.k8s.io/docs/start/?arch=%2Fmacos%2Farm64%2Fstable%2Fbinary+download)
   - Shell environment with `git`
2. Clone this repo
   ```
   git clone https://github.com/e1011/microservices-reddit.git
   cd microservices
   ```
3. Initialize MySql databases
   ```
   mysql -uroot < init.sql
   ```
5. Deploy the app on minikube
   ```minikube start
   cd manifests
   kubectl apply -f ./
   ```
6. Wait for pods to start
   ```
   kubectl get pod
   ```
   Pods should be running after a few minutes
   ```
   NAME                               READY   STATUS    RESTARTS   AGE
   comments-77b87979d6-qvgqv          1/1     Running   0          12h
   email-f5d777db8-c77lw              1/1     Running   0          14h
   filter-9bb487bc4-6hnfk             1/1     Running   0          14h
   frontend-768db6c7b4-srpfb          1/1     Running   0          12h
   gateway-8598659dd6-h6b4r           1/1     Running   0          13h
   posts-79b7dd7fbc-rp5wp             1/1     Running   0          14h
   recommendations-5c5765ccc6-n5mm4   1/1     Running   0          14h
   replies-d94f5b4d4-9gwc9            1/1     Running   0          14h
   search-5fd4c476fb-5wbzk            1/1     Running   0          14h
   users-5b87cf99fb-zc67h             1/1     Running   0          14h
   ```
7. Access the frontend in a browser tab
   ```
   minikube service frontend
   ```
