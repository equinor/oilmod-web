# Lazy way to publish all packages..
cd dist

for d in */ ; do
  cd $d
  npm publish
  cd ..
done
