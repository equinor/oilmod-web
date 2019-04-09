# Lazy way to publish all packages..
cd dist
set +e

for d in */ ; do
  cd $d
  npm publish --access public
  cd ..
done
