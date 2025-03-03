Tests With Extra Sweetness
2018-02-17 22:11:28
Integration,JavaScript,Raspberry Pi
---

A quick post about moving my Node app tests to <a href="https://mochajs.org/">Mocha</a> and <a href="http://chaijs.com/">Chai</a>. These are frameworks used where I work, and I figured I may as well learn something new and have more confidence in my Node apps when I deploy them, so how hard can it be?

Turns out, quite easy. These testing frameworks are deigned to be flexible and resemble plain-english test descriptions. In fact, the new testing code looks a lot like my home-grown test framework. Have a look below for a comparison (taken from the <a href="https://github.com/C-D-Lewis/led-server"><code>led-server</code></a> project):

(You can see the implementation of <code>testBed</code> module in the <a href="https://github.com/C-D-Lewis/node-common/blob/master/testBed.js"><code>node-common</code></a> project)

## Home-grown

```js
async function testSetAll(expected) {
  const response = await testBed.sendConduitPacket({
    to: 'LedServer',
    topic: 'setAll',
    message: { all: [ 25, 25, 52 ] }
  });

  testBed.assert(response.status === 200 && response.message.content === 'OK',
    'setAll: response contains status:200 and content:OK');
}

async function testSetPixel(expected) {
  const response = await testBed.sendConduitPacket({
    to: 'LedServer',
    topic: 'setPixel',
    message: {
      '0': [ 25, 25, 52 ],
      '1': [ 100, 100, 100 ]
    }
  });

  testBed.assert(response.status === 200 && response.message.content === 'OK',
    'setPixel: response contains status:200 and content:OK');
}
```

## Mocha/Chai

```js
describe('Conduit topic: setPixel', () => {
  it('should return 200 / OK', async () => {
    const response = await testBed.sendConduitPacket({
      to: 'LedServer',
      topic: 'setPixel',
      message: {
        '0': [ 10, 20, 30],
        '1': [30, 50, 60]
      }
    });

    expect(response.status).to.equal(200);
    expect(response.message.content).to.equal('OK');
  });
});

describe('Conduit topic: setAll', () => {
  it('should return 200 / OK', async () => {
    const response = await testBed.sendConduitPacket({
      to: 'LedServer',
      topic: 'setAll',
      message: { all: [64,64,64] }
    });

    expect(response.status).to.equal(200);
    expect(response.message.content).to.equal('OK');
  });
});
```

As a result, my script to run all the test suites of each Node app (after booting them all together locally) looks like a lot of this - all green, and no red!

![](/assets/import/media/2018/02/screen-shot-2018-02-17-at-22-09-10.png)

Hopefully this new skill will enable me to write better code both personally and professionally in the future - I may even try out TDD for my next project!
