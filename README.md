# Docker build command 
- docker build -t turbo:v1 . OR docker build -t turbo:v1 /path/to/directory

- it will create an image in docker. from where you can make a container
- for using zod validation it requires to transform the in build validator in NestJS


# This is the github workflows/ github actions / github ci
- name: Turbo-Repo CI

on:
  push:
    branches: -main
    
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Build the Docker image
        uses: actions/checkout@v4
      - name: Create env file
        run: |
         echo "AUTH_SECRET"=${{secrets.AUTH_SECRET}} >> .env 
         echo "NEXT_PUBLIC_API_URL"=${{secrets.NEXT_PUBLIC_API_URL}} >> .env
         
      - name: Build the Docker image
        run: |
          docker build . -t ghcr.io/tech-analytica-limited/association-website:latest
      - name: Push the image to github org packages
        run: |
          docker login --username ${{ secrets.USER_GITHUB_NAME }} --password ${{ secrets.USER_GITHUB_TOKEN }} ghcr.io
          docker push ghcr.io/tech-analytica-limited/association-website:latest
# Turbo Run BUild for all external packages.
- turbo run build --filter=@repo/ui... # build the @repo/ui external package after setup