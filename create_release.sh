# Create release (mostly from .gitlab-ci.yml)

# Install composer (see https://getcomposer.org/download/)
#php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
#php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'.PHP_EOL; } else { echo 'Installer corrupt'.PHP_EOL; unlink('composer-setup.php'); exit(1); }"
#php composer-setup.php
#php -r "unlink('composer-setup.php');"

# Install deps
./composer.phar install -o  --no-interaction --no-progress --prefer-dist --no-dev
./composer.phar dump-autoload --optimize --no-dev --classmap-authoritative

# Move everything to separate folder
mkdir release
mv `ls -A | grep -v release` ./release

# Set permissions
find release/ -type d -exec chmod 750 {} \;
find release/ -type f -exec chmod 640 {} \;

# Delete files
rm -r ./release/.git
rm ./release/composer.phar

# Delete additional files to complicate reconnaisannce
rm \
    ./release/.editorconfig \
    ./release/.php-cs-fixer.dist.php \
    ./release/.po2json.sh \
    ./release/.renest_json.pl \
    ./release/AUTHORS.md \
    ./release/htaccess.txt \
    ./release/INSTALL.md \
    ./release/LICENCE.fr.txt \
    ./release/LICENSE.en.txt \
    ./release/locale.bat \
    ./release/Makefile \
    ./release/php.ini \
    ./release/phpunit.bat \
    ./release/phpunit.sh \
    ./release/psalm.xml \
    ./release/robots.txt

rm -r ./release/doc

find . -name .gitignore -exec rm {} \;
find . -name .gitlab-ci.yml -exec rm {} \;
find . -name README.md -exec rm {} \;
find . -name CHANGELOG.md -exec rm {} \;
find . -name composer.json -exec rm {} \;
find . -name composer.lock -exec rm {} \;
