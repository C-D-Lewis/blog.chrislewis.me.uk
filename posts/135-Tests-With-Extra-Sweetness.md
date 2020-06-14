---
index: 135
title: Tests With Extra Sweetness
postDate: 2018-02-17 22:11:28
original: https://ninedof.wordpress.com/2018/02/17/tests-with-extra-sweetness/
---

A quick post about moving my Node app tests to [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/). These are frameworks used where I work, and I figured I may as well learn something new and have more confidence in my Node apps when I deploy them, so how hard can it be?

Turns out, quite easy. These testing frameworks are deigned to be flexible and resemble plain-english test descriptions. In fact, the new testing code looks a lot like my home-grown test framework. Have a look below for a comparison (taken from the [<code>led-server</code>](https://github.com/C-D-Lewis/led-server) project):

(You can see the implementation of <code>testBed</code> module in the [<code>node-common</code>](https://github.com/C-D-Lewis/node-common/blob/master/testBed.js) project)

## Home-grown

[code language="js"]
async function testSetAll(expected) {
  const response = await testBed.sendConduitPacket({
    to: 'LedServer',
    topic: 'setAll',
    message: { all: [ 25, 25, 52 ] }
  });

  testBed.assert(response.status === 200 &amp;&amp; response.message.content === 'OK',
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

  testBed.assert(response.status === 200 &amp;&amp; response.message.content === 'OK',
    'setPixel: response contains status:200 and content:OK');
}
[/code]

## Mocha/Chai

[code language="js"]
describe('Conduit topic: setPixel', () =&gt; {
  it('should return 200 / OK', async () =&gt; {
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

describe('Conduit topic: setAll', () =&gt; {
  it('should return 200 / OK', async () =&gt; {
    const response = await testBed.sendConduitPacket({
      to: 'LedServer',
      topic: 'setAll',
      message: { all: [64,64,64] }
    });

    expect(response.status).to.equal(200);
    expect(response.message.content).to.equal('OK');
  });
});
[/code]

As a result, my script to run all the test suites of each Node app (after booting them all together locally) looks like a lot of this - all green, and no red!

![](/assets/media/2018/02/screen-shot-2018-02-17-at-22-09-10.png)

Hopefully this new skill will enable me to write better code both personally and professionally in the future - I may even try out TDD for my next project!
