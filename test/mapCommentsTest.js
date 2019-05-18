const expect = require('expect.js');
const fs = require('fs');

const { mapComments } = require('../src/index');

describe('ERC20', () => {
    const filePath = 'test/contracts/ERC20.sol';
    let comments = '';

    before(() => {
        // read file
        const input = fs.readFileSync(filePath).toString();
        // get filtered comments
        comments = mapComments(input);
    });

    describe('extract @dev comments', () => {
        it('extract single line no param/return valid comments', () => {
            // verify
            expect(comments.function.get('totalSupply').dev).to.be('Total number of tokens in existence');
        });
        it('extract single line w/ param/return valid comments', () => {
            // verify
            expect(comments.function.get('balanceOf').dev).to.be('Gets the balance of the specified address.');
        });
        it('extract multiline line w/ param/return valid comments', () => {
            // verify
            expect(comments.function.get('transferFrom').dev).to.be('Transfer tokens from one address to another. '
                + 'Note that while this function emits an Approval event, this is not required as per the '
                + 'specification, and other compliant implementations may not emit the event.');
        });
        it('extract multiline line w/ code in valid comments', () => {
            // verify
            expect(comments.function.get('decreaseAllowance').dev).to.be('Decrease the amount of tokens that an '
                + 'owner allowed to a spender. approve should be called when '
                + '_allowed[msg.sender][spender] == 0. To decrement allowed value is better '
                + 'to use this function to avoid 2 calls (and wait until the first transaction is '
                + 'mined) From MonolithDAO Token.sol Emits an Approval event.');
        });
        it('extract multiline line w/ link in valid comments', () => {
            // verify
            expect(comments.function.get('approve').dev).to.be('Approve the passed address to spend the '
                + 'specified amount of tokens on behalf of msg.sender. Beware that changing an '
                + 'allowance with this method brings the risk that someone may use both the old '
                + 'and the new allowance by unfortunate transaction ordering. One possible '
                + "solution to mitigate this race condition is to first reduce the spender's "
                + 'allowance to 0 and set the desired value afterwards: https://github.com'
                + '/ethereum/EIPs/issues/20#issuecomment-263524729');
        });
        it('extract single line w/ _ in function name valid comments', () => {
            // verify
            expect(comments.function.get('_transfer').dev).to.be('Transfer token for a specified addresses');
        });
    });
    describe('extract @param comments', () => {
        it('extract two params w/ valid comments', () => {
            // verify
            expect(comments.function.get('allowance').param.get('owner'))
                .to.be('The address which owns the funds.');
            expect(comments.function.get('allowance').param.get('spender'))
                .to.be('The address which will spend the funds.');
        });
        it('extract three params w/ valid comments', () => {
            // verify
            expect(comments.function.get('transferFrom').param.get('from'))
                .to.be('The address which you want to send tokens from');
            expect(comments.function.get('transferFrom').param.get('to'))
                .to.be('The address which you want to transfer to');
            expect(comments.function.get('transferFrom').param.get('value'))
                .to.be('The amount of tokens to be transferred');
        });
    });
});

describe('Tree', () => {
    const filePath = 'test/contracts/Tree.sol';
    let comments = '';

    before(() => {
        // read file
        const input = fs.readFileSync(filePath).toString();
        // get filtered comments
        comments = mapComments(input);
    });

    describe('extract all types of comments from function', () => {
        it('@dev', () => {
            // verify
            expect(comments.function.get('age').dev)
                .to.be('The Alexandr N. Tetearing algorithm could increase precision');
        });
        it('@notice', () => {
            // verify
            expect(comments.function.get('age').notice)
                .to.be('Calculate tree age in years, rounded up, for live trees');
        });
        it('@author', () => {
            // verify
            expect(comments.function.get('age').author)
                .to.be('Mary A. Botanist');
        });
    });

    describe('extract all types of comments from contract', () => {
        it('@dev', () => {
            // verify
            expect(comments.contract.get('Tree').dev)
                .to.be('All function calls are currently implemented without side effects');
        });
        it('@notice', () => {
            // verify
            expect(comments.contract.get('Tree').notice)
                .to.be('You can use this contract for only the most basic simulation');
        });
        it('@author', () => {
            // verify
            expect(comments.contract.get('Tree').author)
                .to.be('Larry A. Gardner');
        });
        it('@title', () => {
            // verify
            expect(comments.contract.get('Tree').title)
                .to.be('A simulator for trees');
        });
    });

    describe('extract @param comments', () => {
        it('extract two params w/ valid comments', () => {
            // verify
            expect(comments.function.get('age').param.get('rings'))
                .to.be('The number of rings from dendrochronological sample');
        });
    });
});

describe('Empty', () => {
    const filePath = 'test/contracts/Empty.sol';
    let comments = '';

    before(() => {
        // read file
        const input = fs.readFileSync(filePath).toString();
        // get filtered comments
        comments = mapComments(input);
    });

    it('should be empty', () => {
        // verify
        expect(JSON.stringify(comments.entries())).to.be('{}');
    });
});

describe('Plane', () => {
    const filePath = 'test/contracts/Plane.sol';
    let comments = '';

    before(() => {
        // read file
        const input = fs.readFileSync(filePath).toString();
        // get filtered comments
        comments = mapComments(input);
    });

    describe('extract all types of comments from event', () => {
        it('@dev', () => {
            // verify
            expect(comments.event.get('Land').dev)
                .to.be('Emitted by land function');
        });
        it('@notice', () => {
            // verify
            expect(comments.event.get('Land').notice)
                .to.be('This is a plane event');
        });
        it('@author', () => {
            // verify
            expect(comments.event.get('Land').author)
                .to.be('Bernardo Vieira');
        });
    });

    describe('extract all types of comments from constructor', () => {
        it('@dev', () => {
            // verify
            expect(comments.constructor.dev)
                .to.be('May flight, or may not');
        });
        it('@notice', () => {
            // verify
            expect(comments.constructor.notice)
                .to.be('This is a plane constructor');
        });
        it('@author', () => {
            // verify
            expect(comments.constructor.author)
                .to.be('Bernardo Vieira');
        });
    });
});
