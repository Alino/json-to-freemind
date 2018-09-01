var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var fs = require('fs');
var path = require('path');

function createMindMap(sourceFilePath, targetFilePath) {
  if (!fs.existsSync(sourceFilePath)) throw ('Error: json file does not exist');
  const jsonInput = fs.readFileSync(sourceFilePath, 'utf8');
  const jsonFileName = path.basename(sourceFilePath);
  const mindMapData = convert(jsonInput, jsonFileName);
  fs.writeFileSync(targetFilePath, mindMapData, { encoding: 'utf8' });
}

function convert(json, jsonFileName) {
  let parsedJson;
  try { parsedJson = JSON.parse(json); }
  catch (err) { throw ('Error: invalid json'); }
  const jsonKeys = Object.keys(parsedJson);
  const jsonValues = Object.values(parsedJson);
  const parser = new DOMParser();
  const serializer = new XMLSerializer();
  const xmlWrapper = `<map version="1.0.1">
<!-- This file was generated from a JSON structure, using json-to-freemind. -->
<!-- To view this file, download free mind mapping software FreeMind from http://freemind.sourceforge.net -->
<node TEXT="${jsonFileName}"></node>
</map>`;
  const xmlDoc = parser.parseFromString(xmlWrapper, 'text/xml');

  recur = function recur(keys, values, runNumber, lastParentEl) {
    let parentEl;
    let topSiblings = [];
    for (let p = 0; p < keys.length; p++) {

      const key = keys[p];
      let value = values[p];

      const isLastChild = typeof value != 'object';
      const isParent = !isLastChild;

      parentEl = xmlDoc.createElement('node');
      parentEl.setAttribute('TEXT', key);

      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (typeof v != 'object') {
            const childEl = xmlDoc.createElement('node');
            childEl.setAttribute('TEXT', v);
            parentEl.appendChild(childEl);
            lastParentEl.appendChild(parentEl);
          } else {
            lastParentEl.appendChild(parentEl);
            recur(Object.keys(v), Object.values(v), runNumber + 1, parentEl)
          }
        })
        continue;
      }

      if (runNumber == 0) {
        lastParentEl = parentEl;
        topSiblings.push(parentEl);
      }

      if (isLastChild) {
        const childEl = xmlDoc.createElement('node');
        childEl.setAttribute('TEXT', value);
        parentEl.appendChild(childEl);
        lastParentEl.appendChild(parentEl);
      }

      if (runNumber > 0 && isParent) {
        lastParentEl.appendChild(parentEl);
      }

      if (isParent) {
        recur(Object.keys(value), Object.values(value), runNumber + 1, parentEl)
      }
    }

    if (runNumber == 0) {
      topSiblings.forEach((topSibling) => {
        xmlDoc.getElementsByTagName('node')[0].appendChild(topSibling);
      })
    }
  }(jsonKeys, jsonValues, 0);

  const output = serializer.serializeToString(xmlDoc);
  return output;
}

module.exports = {
  convert,
  createMindMap
}