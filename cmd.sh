echo "starting..."
sleep 3
cd ..
cd umayplus-front-end/
docker compose down
echo "Down..."
sleep 10
docker rmi $(docker images 'umayplus-front-end-umayplus-website' -q)
echo "Remove Docker images..."
sleep 5
docker compose build --no-cache
sleep 30
docker compose up -d
echo "up..."
