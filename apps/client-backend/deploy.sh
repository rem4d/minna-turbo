rm -rf @deploy
pnpm --filter=client-backend --prod deploy @deploy
mv @deploy/dist/index.js @deploy/dist/app.js

rsync -avz -r @deploy/dist/* timeweb:/var/www/stage-api.kanjiflow.ru/
rsync -avz -r --stats --progress --delete @deploy/node_modules timeweb:/var/www/stage-api.kanjiflow.ru/node_modules
rsync -avz -r ./@deploy/.env timeweb:/var/www/stage-api.kanjiflow.ru/
