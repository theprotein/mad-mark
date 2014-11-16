OUTPUT_DIR=output

YENV=production npm run build
cp favicon.ico $OUTPUT_DIR/
touch $OUTPUT_DIR/.nojekyll
