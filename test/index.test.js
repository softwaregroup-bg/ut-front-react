const tap = require('tap');
const ab = 1;

tap.test('test case', async(assert) => {
    assert.ok(ab === 1, 'Test assertion');
});
