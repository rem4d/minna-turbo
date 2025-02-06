rm -rf @deploy
pnpm --filter=client-backend --prod deploy @deploy
mv @deploy/dist/index.js @deploy/dist/app.js

# rsync -avz -r @deploy/dist/* rem4d:/home/users/j/j73366709/domains/api.rem4d.ru/
# rsync -avz -r --stats --progress --delete @deploy/node_modules rem4d:/home/users/j/j73366709/domains/api.rem4d.ru/node_modules
# rsync -avz -r ./@deploy/.env rem4d:/home/users/j/j73366709/domains/api.rem4d.ru/
