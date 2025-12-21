# backend/Dockerfile

# 1. Use an official Python runtime as a parent image
FROM python:3.11-slim

# 2. Set the working directory in the container
WORKDIR /app

# 3. Install system dependencies (needed for some Python packages)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 4. Copy the requirements file into the container
COPY requirements.txt .

# 5. Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy the rest of the backend code
COPY . .

# 7. Create the directory for uploaded documents
RUN mkdir -p saved_files

# 8. Expose port 8000
EXPOSE 8000

# 9. Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]