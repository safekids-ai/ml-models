# Build Main Website
## without cache
docker build --progress=plain --no-cache -t main-website-react -f ./apps/main-website-react/Dockerfile .

## with cache
docker build --progress=plain -t main-website-react -f ./apps/main-website-react/Dockerfile .

## running docker for website
docker run -p 4200:4200 main-website-react

## pruning docker
docker image prune -a
docker container prune
docker volume prune
docker system prune -a

