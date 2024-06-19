# Proleap Django Project

## Backend

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

### Getting Started

Follow these steps to get the Django project up and running locally using Docker Compose:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Prem-Dharshan/ProLeap.git
   cd ProLeap
   git checkout dev
   ```

2. **Navigate to backend folder**

    ```bash
    cd proleap-backend/proleap_backend
    ```



3. **Build and run the Docker containers:**

   ```bash
   docker-compose up --build
   ```

   This command builds the Docker images defined in `docker-compose.yml` and starts the containers. Use `-d` flag to run containers in detached mode.

4. **Apply Django migrations:**

   Open a new terminal window/tab and run Django migrations:

   ```bash
   docker exec -it proleap-backend-web python manage.py makemigrations
   docker exec -it proleap-backend-web python manage.py migrate
   docker exec -it proleap-backend-web python manage.py loaddata until_options.json
   ```

5. **Create a superuser (if needed):**

   To create a Django superuser for admin access:

   ```bash
   docker exec -it proleap-backend-web python manage.py createsuperuser
   ```

   Follow the prompts to set up the superuser account.
   - Email: admin@proleap.com
   - username: admin
   - password: admin
   - too short?: y

6. **Access the Django development server:**

   Once migrations are applied and superuser is created, you can access the Django development server at [http://localhost:8000](http://localhost:8000).

7. **Stop and remove containers:**

   To stop the containers (and remove them if needed):

   ```bash
   docker-compose down
   ```

   Use `-v` flag to remove volumes as well.


8. **Acesss Server logs**

   ```bash
   docker logs proleap-backend-web
   ```
