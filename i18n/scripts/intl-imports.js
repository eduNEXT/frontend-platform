#!/usr/bin/env node
const scriptHelpDocument = `
NAME
  intl-imports.js — Script to generate the src/i18n/index.js file that exports messages from all the languages for Micro-frontends.

SYNOPSIS
  intl-imports.js [DIRECTORY ...]

DESCRIPTION
  This script is intended to run after 'atlas' has pulled the files.
  
  This expects to run inside a Micro-frontend root directory with the following structure:
  
    frontend-app-learning $ tree src/i18n/
    src/i18n/
    ├── index.js
    └── messages
        ├── frontend-app-example
        │   ├── ar.json
        │   ├── es_419.json
        │   └── zh_CN.json
        ├── frontend-component-footer
        │   ├── ar.json
        │   ├── es_419.json
        │   └── zh_CN.json
        └── frontend-component-header (empty directory)
  
  
  
  With the structure above it's expected to run with the following command in Makefile:
  
    
    $ node_modules/.bin/intl-imports.js frontend-component-footer frontend-component-header frontend-app-example
  
  
  It will generate two type of files:
  
   - Main src/i18n/index.js which overrides the Micro-frontend provided with a sample output of:
      
      """
      import messagesFromFrontendComponentFooter from './messages/frontend-component-footer';
      // Skipped import due to missing './messages/frontend-component-footer/index.js' likely due to empty translations.
      import messagesFromFrontendAppExample from './messages/frontend-app-example';
   
      export default [
        messagesFromFrontendComponentFooter,
        messagesFromFrontendAppExample,
      ];
      """
  
   - Each sub-directory has src/i18n/messages/frontend-component-header/index.js which is imported by the main file.:
   
      """
      import messagesOfArLanguage from './ar.json';
      import messagesOfDeLanguage from './de.json';
      import messagesOfEs419Language from './es_419.json';
      export default {
        'ar': messagesOfArLanguage,
        'de': messagesOfDeLanguage,
        'es-419': messagesOfEs419Language,
      };
     """
`;
const fs = require('fs');
const path = require('path');
const camelCase = require('lodash.camelcase');
const loggingPrefix = path.basename(`${__filename}`); // the name of this JS file

// Header note for generated src/i18n/index.js file
const filesCodeGeneratorNoticeHeader = `// This file is generated by the openedx/frontend-platform's "intl-import.js" script.
//
// Refer to the i18n documents in https://docs.openedx.org/en/latest/developers/references/i18n.html to update
// the file and use the Micro-frontend i18n pattern in new repositories.
//
`;

/**
 * Create frontend-app-example/index.js file with proper imports.
 *
 * @param directory - a directory name containing .json files from Transifex e.g. "frontend-app-example".
 * @param log - Mockable process.stdout.write
 * @param writeFileSync - Mockable fs.writeFileSync
 * @param i18nDir - Path to `src/i18n` directory
 *
 * @return object - An object containing directory name and whether its "index.js" file was successfully written.
 */
function generateSubdirectoryMessageFile(_ref) {
  let {
    directory,
    log,
    writeFileSync,
    i18nDir
  } = _ref;
  const importLines = [];
  const messagesLines = [];
  const counter = {
    nonEmptyLanguages: 0
  };
  const messagesDir = `${i18nDir}/messages`; // The directory of Micro-frontend i18n messages

  try {
    const files = fs.readdirSync(`${messagesDir}/${directory}`, {
      withFileTypes: true
    });
    files.sort(); // Sorting ensures a consistent generated `index.js` order of imports cross-platforms.

    const jsonFiles = files.filter(file => file.isFile() && file.name.endsWith('.json'));
    if (!jsonFiles.length) {
      log(`${loggingPrefix}: Not creating '${directory}/index.js' because no .json translation files were found.\n`);
      return {
        directory,
        isWritten: false
      };
    }
    jsonFiles.forEach(file => {
      const filename = file.name;
      // Gets `fr_CA` from `fr_CA.json`
      const languageCode = filename.replace(/\.json$/, '');
      // React-friendly language code fr_CA --> fr-ca
      const reactIntlLanguageCode = languageCode.toLowerCase().replace(/_/g, '-');
      // camelCase variable name
      const messagesCamelCaseVar = camelCase(`messages_Of_${languageCode}_Language`);
      const filePath = `${messagesDir}/${directory}/${filename}`;
      try {
        const entries = JSON.parse(fs.readFileSync(filePath, {
          encoding: 'utf8'
        }));
        if (!Object.keys(entries).length) {
          importLines.push(`// Note: Skipped empty '${filename}' messages file.`);
          return; // Skip the language
        }
      } catch (e) {
        importLines.push(`// Error: unable to parse '${filename}' messages file.`);
        log(`${loggingPrefix}: NOTICE: Skipping '${directory}/${filename}' due to error: ${e}.\n`);
        return; // Skip the language
      }
      counter.nonEmptyLanguages += 1;
      importLines.push(`import ${messagesCamelCaseVar} from './${filename}';`);
      messagesLines.splice(1, 0, `  '${reactIntlLanguageCode}': ${messagesCamelCaseVar},`);
    });
    if (counter.nonEmptyLanguages) {
      // See the help message above for sample output.
      const messagesFileContent = [filesCodeGeneratorNoticeHeader, importLines.join('\n'), '\nexport default {', messagesLines.join('\n'), '};\n'].join('\n');
      writeFileSync(`${messagesDir}/${directory}/index.js`, messagesFileContent);
      return {
        directory,
        isWritten: true
      };
    }
    log(`${loggingPrefix}: Skipping '${directory}' because no languages were found.\n`);
  } catch (e) {
    log(`${loggingPrefix}: NOTICE: Skipping '${directory}' due to error: ${e}.\n`);
  }
  return {
    directory,
    isWritten: false
  };
}

/**
 * Create main `src/i18n/index.js` messages import file.
 *
 *
 * @param processedDirectories - List of directories with a boolean flag whether its "index.js" file is written
 *                               The format is "[\{ directory: "frontend-component-example", isWritten: false \}, ...]"
 * @param log - Mockable process.stdout.write
 * @param writeFileSync - Mockable fs.writeFileSync
 * @param i18nDir` - Path to `src/i18n` directory
 */
function generateMainMessagesFile(_ref2) {
  let {
    processedDirectories,
    log,
    writeFileSync,
    i18nDir
  } = _ref2;
  const importLines = [];
  const exportLines = [];
  processedDirectories.forEach(processedDirectory => {
    const {
      directory,
      isWritten
    } = processedDirectory;
    if (isWritten) {
      const moduleCamelCaseVariableName = camelCase(`messages_from_${directory}`);
      importLines.push(`import ${moduleCamelCaseVariableName} from './messages/${directory}';`);
      exportLines.push(`  ${moduleCamelCaseVariableName},`);
    } else {
      const skipMessage = `Skipped import due to missing '${directory}/index.js' likely due to empty translations.`;
      importLines.push(`// ${skipMessage}.`);
      log(`${loggingPrefix}: ${skipMessage}\n`);
    }
  });

  // See the help message above for sample output.
  const indexFileContent = [filesCodeGeneratorNoticeHeader, importLines.join('\n'), '\nexport default [', exportLines.join('\n'), '];\n'].join('\n');
  writeFileSync(`${i18nDir}/index.js`, indexFileContent);
}

/*
 * Main function of the file.
 */
function main(_ref3) {
  let {
    directories,
    log,
    writeFileSync,
    pwd
  } = _ref3;
  const i18nDir = `${pwd}/src/i18n`; // The Micro-frontend i18n root directory

  if (directories.includes('--help') || directories.includes('-h')) {
    log(scriptHelpDocument);
  } else if (!directories.length) {
    log(scriptHelpDocument);
    log(`${loggingPrefix}: Error: A list of directories is required.\n`);
  } else if (!fs.existsSync(i18nDir) || !fs.lstatSync(i18nDir).isDirectory()) {
    log(scriptHelpDocument);
    log(`${loggingPrefix}: Error: src/i18n directory was not found.\n`);
  } else {
    const processedDirectories = directories.map(directory => generateSubdirectoryMessageFile({
      directory,
      log,
      writeFileSync,
      i18nDir
    }));
    generateMainMessagesFile({
      processedDirectories,
      log,
      writeFileSync,
      i18nDir
    });
  }
}
if (require.main === module) {
  // Run the main() function if called from the command line.
  main({
    directories: process.argv.slice(2),
    log: text => process.stdout.write(text),
    writeFileSync: fs.writeFileSync,
    pwd: process.env.PWD
  });
}
module.exports.main = main; // Allow tests to use the main function.
//# sourceMappingURL=intl-imports.js.map