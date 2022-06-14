CommitMsg = "first commit"

all:
	echo "choose: install/commit"

commit:
	rm -rf dist/src && rm -rf dist/makefile && rm -rf dist/pnpm-lock.yaml && rm -rf dist/package.json
	cp -r src makefile pnpm-lock.yaml package.json ./dist
	cd dist && git add * && git commit -m ${CommitMsg} && git push -u origin master && cd ..

# preview:
# 	rm -rf ../segfaulty.bitbucket.io/
# 	cp -r dist ../segfaulty.bitbucket.io/dist
# 	cd dist && git add * && git commit -m ${CommitMsg} && git push -u origin master && cd ..