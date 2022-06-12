CommitMsg = "first commit"

all:
	echo "choose: install/commit"

install:
	npm init -y
	npm i --save-dev autoprefixer browser-sync cssnano gulp gulp-concat gulp-postcss gulp-replace gulp-sass gulp-sourcemaps gulp-uglify sass
	gulp

commit:
	rm -rf dist/src && rm -rf dist/gulpfile.js && rm -rf dist/makefile
	cp -r src makefile gulpfile.js ./dist
	cd dist && git add * && git commit -m ${CommitMsg} && git push -u origin master && cd ..

# preview:
# 	rm -rf ../segfaulty.bitbucket.io/
# 	cp -r dist ../segfaulty.bitbucket.io/dist
# 	cd dist && git add * && git commit -m ${CommitMsg} && git push -u origin master && cd ..