const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;


describe('date helper', function() {
  const context = { date: '01/20/2019' };

  const runTestCases = testRunner({context});
  const addZeroToDate = (date) => ('0' + date).slice(-2);

  it('should return a default formatted moment date', function(done) {
    const now = new Date();
    runTestCases([
      {
        input: '{{moment date "YYYY-MM-DD"}}',
        output: '2019-01-20',
      },
      {
        input: `{{moment date "YYYY"}}`,
        output: '2019',
      },
      {
        input: `{{moment "YYYY"}}`,
        output: '2020',
      },
      {
        input: `{{moment format="MM DD"}}`,
        output: `${addZeroToDate(now.getMonth() + 1)} ${addZeroToDate(now.getDate())}`,
      },
      {
        input: `{{moment date locale="en" format="MMMM"}}`,
        output: `January`,
      },
    ], done);
  });
});
