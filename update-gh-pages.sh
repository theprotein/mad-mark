# if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    echo -e "Starting to update gh-pages\n"

    git config --global user.email "travis@travis-ci.org"
    git config --global user.name "Travis"

    YENV=production ./build.sh
    git clone -b gh-pages https://${GH_TOKEN}@github.com/tadatuta/bb.git deploy
    cd deploy
    rm -rf *
    cd ..
    rsync -avz --stats output/ deploy/

    cd deploy
    git add -A
    git commit -m "Travis build $TRAVIS_BUILD_NUMBER pushed to gh-pages"
    git push origin gh-pages

    echo -e "Finishing to update gh-pages\n"
# fi
