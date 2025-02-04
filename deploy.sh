# front

rm -rf @deploy/client-front

turbo run build --filter=client-front

rsync -avz -r --stats --progress apps/client-front/dist/* rem4d:/home/users/j/j73366709/domains/stage.rem4d.ru/

rm -rf client-target
pnpm --filter=client-front --prod deploy client-target
rsync -avz -r --stats --progress client-target/node_modules rem4d:/home/users/j/j73366709/domains/stage.rem4d.ru/node_modules


# back
rm -rf @deploy/client-backend

turbo run build --filter=client-backend

# create deploy target directory
pnpm --filter=client-backend --prod deploy @deploy/client-backend

rsync -avz -r --stats --progress ./@deploy/client-backend/dist/* rem4d:/home/users/j/j73366709/domains/api.rem4d.ru/
rsync -avz -r --stats --progress ./@deploy/client-backend/node_modules/* rem4d:/home/users/j/j73366709/domains/api.rem4d.ru/node_modules
rsync -avz -r ./@deploy/client-backend/.env rem4d:/home/users/j/j73366709/domains/api.rem4d.ru/

