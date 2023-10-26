echo "starting..."
sleep 3
docker compose down
echo "down..."
sleep 10
docker compose up -d
echo "up..."
sleep 3