## Steps on eu4-parser

prepare
- Run tests
- package.json - update version

simulate upload
- npm run build => creates dist content
- npm pack --pack-destination c:\temp\eu4-parser-pack => eu4-parser-&lt;version&gt;.tgz

## Steps on ESM und CJS test consumers
- dependency "eu4-parser": "file:/temp/eu4-parser-pack/ eu4-parser-&lt;version&gt;.tgz" 
- npm install
- node index.js


## Commit & push
- commit & push changes and create tag

## Create releaseon github
- use interactive dialog
  - select the just defined tag
  - name of release: eu4-parser&lt;version&gt;

## Deploy to npm
- npm run build  // if not already done
- npm publish --access public // browser dialog for OTP will appear

## Check npm deployment with ESM und CJS test consumers

- change dependence in package.json: "eu-4parser": "^&lt;version&gt;"


# Delete tags

- local: git tag -d "&lt;tag&gt;"
- remote: git push origin --delete "&lt;tag&gt;"