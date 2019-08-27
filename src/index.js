/**
 * Generic comments organizer.
 * @param {string[]} comments input containing an array with all comments
 */
function proceedParse(comments) {
    const splitComments = comments.split(/@(dev|param|return|notice|author|title) /);
    const paramComments = new Map();
    const returnComment = [];
    let devComment = '';
    let noticeComment = '';
    let authorComment = '';
    let titleComment = '';
    //
    for (let c = 1; c < splitComments.length; c += 2) {
        // if it's a param, extract the name
        if (splitComments[c] === 'param') {
            // get param name
            const paramName = splitComments[c + 1].match(/(\w+).*/)[1];
            // clean up the comment
            const readableComment = splitComments[c + 1].slice(paramName.length + 1, splitComments[c + 1].length);
            // add to array
            paramComments.set(paramName, readableComment.trim());
        } else if (splitComments[c] === 'return') {
            // clean up the comment
            returnComment.push(splitComments[c + 1].trim());
        } else if (splitComments[c] === 'dev') {
            // clean up the comment
            devComment = splitComments[c + 1].trim();
        } else if (splitComments[c] === 'notice') {
            // clean up the comment
            noticeComment = splitComments[c + 1].trim();
        } else if (splitComments[c] === 'author') {
            // clean up the comment
            authorComment = splitComments[c + 1].trim();
        } else { // if (splitComments[c] === 'title') {
            // clean up the comment
            titleComment = splitComments[c + 1].trim();
        }
    }
    return {
        param: paramComments,
        return: returnComment,
        dev: devComment,
        notice: noticeComment,
        author: authorComment,
        title: titleComment,
    };
}

/**
 * From a given input, get all the multiline comments, within /** *\/
 * @param {string} input contract code as a string
 */
function getMultilineComments(input) {
    let output = input;
    let outputConstructor = new Map();
    const outputFunctions = new Map();
    const outputContracts = new Map();
    const outputEvents = new Map();
    // get original comments
    const rawComments = output.match(/\/\*\*[\w\W]+?\*\//gm);
    // If there's no comments!
    if (rawComments === null) {
        return {
            contract: outputContracts, function: outputFunctions, event: outputEvents, constructor: outputConstructor,
        };
    }
    // first we transform the comment to a specific format
    rawComments.forEach((comment) => {
        // remove ine break
        const noLineBreak = comment.replace(/\s{2,}\*?(?!\/)/gm, '');
        // create a new type of comment
        const newCommentLine = `<<#${noLineBreak.match(/\/\*\*(.+)\*\//)[1]}#>>`;
        // replace the original comment by the new style
        output = output.replace(comment, newCommentLine);
    });
    // and then we parse them into variables
    // first from functions, contract and event
    const findComments = output.match(/<<#.+?#>>\W+\w+ \w+/gm);
    findComments.forEach((comment) => {
        // now, see if it's a function, contract, event or a unicorn
        const matched = comment.match(/<<#(.+?)#>>\W+(function|contract|event) (\w+)/);
        // it can be null, because we are not catching interfaces yet, for example
        if (matched !== null) {
            const comments = matched[1];
            const subjectName = matched[3];
            if (matched[2] === 'function') {
                outputFunctions.set(subjectName, proceedParse(comments));
            } else if (matched[2] === 'contract') {
                outputContracts.set(subjectName, proceedParse(comments));
            } else { // if (matched[2] === 'event') {
                outputEvents.set(subjectName, proceedParse(comments));
            }
        }
    });
    // constructor is a special case
    const constructorComments = output.match(/<<#(.+?)#>>\W+constructor/);
    if (constructorComments !== null) {
        outputConstructor = proceedParse(constructorComments[1]);
    }
    return {
        contract: outputContracts, function: outputFunctions, event: outputEvents, constructor: outputConstructor,
    };
}

/**
 * From a given input, and all the previous values from multiline parsing,
 * get the single line comments after // or ///.
 * @param {string} input input contract code as a string
 * @param {map} outputFunctions functions map with comments
 * @param {map} outputContracts contracts map with comment
 * @param {map} outputEvents events map with comments
 * @param {map} outputConstructor contructor map with comments
 */
function getSingleLineComments(input, outputFunctions, outputContracts, outputEvents, outputConstructor) {
    // look for single line comments in functions
    const rawComments = input.match(/\/\/\/?([@\w ]+)\W+function ([\w]+)\(/g);
    // if not inline commants were found
    if (rawComments === null) {
        // and eventualy no multiline comments as well, lets return empty
        if (
            outputFunctions.size === 0
            && outputContracts.size === 0
            && outputEvents.size === 0
            && outputConstructor.size === 0
        ) {
            return new Map();
        }
        // otherwise return the previous state
        return {
            contract: outputContracts, function: outputFunctions, event: outputEvents, constructor: outputConstructor,
        };
    }
    // lets iterate over all simple line comments found (only for functions, right now)
    rawComments.forEach((comment) => {
        // now, see if it's a function, contract, event or a unicorn
        const matched = comment.match(/\/\/\/? ([@\w ]+)\W+function ([\w]+)\(/);

        if (matched !== null && matched.length >= 3) {
            outputFunctions.set(matched[2], proceedParse(matched[1]));
        }
    });
    return {
        contract: outputContracts, function: outputFunctions, event: outputEvents, constructor: outputConstructor,
    };
}

/**
 *
 */
exports.mapComments = (input) => {
    //
    const multiline = getMultilineComments(input);
    const singleline = getSingleLineComments(
        input, multiline.function, multiline.contract, multiline.event, multiline.constructor,
    );
    return singleline;
};
