
DISTFILE=admin-portal-`node -p -e "require('./package.json').version"`.tgz
PUBLIC=../portal-login
WEBAPP=$(PUBLIC)/public
DEVAPP=../admin-portal/src

clean:
	[ -d $(WEBAPP) ] && /bin/rm -fr $(WEBAPP)

prod:
	./bin/reset-index.js
	npm run build:prod
	mv $(WEBAPP)/index.html $(PUBLIC)/provider-index.html
	(cd $(WEBAPP) && gzip  -kr ./)

version:
	@( echo $(DISTFILE) $(WEBAPP) )

tar:
	@make prod
	tar cvzf $(DISTFILE) $(WEBAPP)

untar:
	tar xvzf $(DISTFILE)

serve:
	./bin/inject-user.js
	npm run start:dev -- --port 4200

reset:
	./bin/reset-index.js

