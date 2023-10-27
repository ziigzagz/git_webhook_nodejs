echo "starting..."
sleep 3

cd /home/umayplus/umayplus-front-end
sleep 1

git checkout del-split-2
echo "checkout del-split-2"
sleep 1

git pull
sleep 5

docker compose down
echo "Down..."
sleep 5

docker images -a | grep "umayplus-front-end-umayplus-website" | awk '{print $3}' | xargs docker rmi
sleep 1

echo "Remove Docker images..."
sleep 5

docker compose build --no-cache
sleep 60

docker compose up -d
echo "up..."
cd /home/umayplus/git_webhook_nodejs


