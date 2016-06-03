OUTPUT_DIR=../output

YENV=production npm run build
cp favicon.ico $OUTPUT_DIR/
cp $OUTPUT_DIR/index.en.html $OUTPUT_DIR/index.html
touch $OUTPUT_DIR/.nojekyll
