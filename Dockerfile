# Step 1: Build the React app
FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve it with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Step 3: Run the container
# docker build -t my-react-app .
# docker run -p 80:80 my-react-app
# Step 4: Access the app at http://localhost:80
# Step 5: Clean up
# docker rmi my-react-app
# docker container prune -f
# docker image prune -f
# docker system prune -f
# Step 6: Push to Docker Hub (optional)
# docker tag my-react-app <your-dockerhub-username>/my-react-app
# docker push <your-dockerhub-username>/my-react-app
# Step 7: Deploy to Kubernetes (optional)
# kubectl create deployment my-react-app --image=<your-dockerhub-username>/my-react-app
# kubectl expose deployment my-react-app --type=LoadBalancer --port=80
# kubectl get services
# Step 8: Access the app in Kubernetes (optional)
# kubectl port-forward service/my-react-app 8080:80
# Access the app at http://localhost:8080
# Step 9: Clean up Kubernetes resources (optional)
# kubectl delete service my-react-app
# kubectl delete deployment my-react-app
# Step 10: Clean up Docker resources (optional)
# docker rmi <your-dockerhub-username>/my-react-app
# docker container prune -f
# docker image prune -f
# docker system prune -f
# Step 11: Clean up Docker resources (optional)
# docker rmi <your-dockerhub-username>/my-react-app
# docker container prune -f
