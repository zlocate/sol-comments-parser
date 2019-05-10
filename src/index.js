const fs = require('fs');

/**
 * Generic comments organizer.
 * @param {string[]} comments input containing an array with all comments
 */
function proceedParse(comments) {
    const splitComments = comments.split(/@(dev|param|return) /);
    const paramComments = new Map();
    const returnComment = [];
    let devComment = '';
    //
    for (let c = 1; c < splitComments.length; c += 2) {
        // if it's a param, extract the name
        if (splitComments[c] === 'param') {
            // get param name
            const paramName = splitComments[c + 1].match(/(\w+).*/)[1];
            // clean up the comment
            const readableComment = splitComments[c + 1].split(paramName)[1].replace(/\s+\*\/?/gm, '');
            // add to array
            paramComments.set(paramName, readableComment);
        } else if (splitComments[c] === 'return') {
            // clean up the comment
            returnComment.push(splitComments[c + 1]);
        } else if (splitComments[c] === 'dev') {
            // clean up the comment
            devComment = splitComments[c + 1];
        }
    }
    return { param: paramComments, return: returnComment, dev: devComment};
}

/**
 *
 */
exports.mapComments = (input) => {
    let output = input;
    const outputFunctions = new Map();
    const outputResult = new Map();
    // get original comments
    const rawComments = output.match(/\/\*\*[\w\W]+?\*\//gm);
    // If there's no comments!
    if (rawComments === null) {
        return outputResult;
    }
    // first we transform the comment to a specific format
    rawComments.forEach((comment) => {
        // remove ine break
        const noLineBreak = comment.replace(/\s{2,}\*?(?!\/)/gm, '');
        // create a new type of comment
        const newCommentLine = '<<#' + noLineBreak.match(/\/\*\*(.+)\*\//)[1] + '#>>';
        // replace the original comment by the new style
        output = output.replace(comment, newCommentLine);
    });
    // and then we parse them into variables
    const functionComments = output.match(/<<#.+?#>>\W+function \w+/gm);
    //
    functionComments.forEach((comment) => {
        // now, see if it's a function, contract, event or a unicorn
        let matched = comment.match(/<<#(.+?)#>>\W+function (\w+)/);
        const comments = matched[1];
        const functionName = matched[2];
        outputFunctions.set(functionName, proceedParse(comments));
    });
    return { function: outputFunctions};
};
