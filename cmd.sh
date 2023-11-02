echo "starting..."
sleep 3

cd /home/umayplus/umayplus-front-end
sleep 1

git checkout dev-split-2
echo "checkout dev-split-2"
sleep 1

git pull
sleep 5

docker compose down
echo "Down..."
sleep 5

docker system prune --all
echo "Prune..."
sleep 3

sudo rm -R /var/lib/docker/overlay2
sleep 10

sudo rm -R /var/lib/docker/image
sleep 1

docker system prune -f
sleep 5

systemctl restart docker
sleep 3

docker images -a | grep "umayplus-front-end-umayplus-website" | awk '{print $3}' | xargs docker rmi -f
sleep 1

echo "Remove Docker images..."
sleep 1

docker compose build --no-cache
sleep 45

docker compose up -d
echo "up..."
cd /home/umayplus/git_webhook_nodejs


