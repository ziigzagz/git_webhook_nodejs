echo "starting..."
sleep 3
cd ..
cd umayplus-front-end/
docker compose down
echo "down..."
sleep 10
docker compose up -d
echo "up..."
