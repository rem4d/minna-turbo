# rm -rf @deploy
# pnpm --filter=client-front --prod deploy @deploy
# rsync -avz -r --stats --progress @deploy/dist/* rem4d:/home/users/j/j73366709/domains/stage.rem4d.ru/
# rsync -avz -r --stats --progress @deploy/node_modules rem4d:/home/users/j/j73366709/domains/stage.rem4d.ru/node_modules

rsync -avz -r --stats --progress ./dist/* rem4d:/home/users/j/j73366709/domains/stage.rem4d.ru/

