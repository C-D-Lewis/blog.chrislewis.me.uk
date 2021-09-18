Creating a Miniature Scripting Language
2018-09-29 21:10:48
JavaScript
---

After using a number of proper programming languages for various projects over the last several years, one couple stood out as an interesting concepts - the DCPU-16 language from <a href="https://en.wikipedia.org/wiki/0x10c">0x10c</a>, used to program an in-game computer. This was sadly never fully realised beyond community emulators after the project was abandoned, but the idea was to provide a simple language that players could learn to use to advantage themselves. For example, to tell a weapon how to track another ship, given its bearing and speed.

I'd like to see a game fully utilise such a concept one day, but until then, I'd thought I'd have a go at creating a <strong>very</strong> simple pseudo-language and see what would be involved.

## The Result

Turns out the easiest way to go about it to is to use an existing language as a platform - a <a href="https://en.wikipedia.org/wiki/Source-to-source_compiler">transpiler</a>. For example, languages like TypeScript and Dart that are transformed to JavaScript, a much more portable language (browsers, Node, <a href="https://pebble.github.io/rockyjs/">watches</a>, etc.) that can easily be run in many places.

To this end I set out (in my typically enjoyed 'do it yourself' style) to try and make a simplified language that is converted into JavaScript, line for line. The result is a project unimaginatively dubbed '<a href="https://github.com/C-D-Lewis/islang">islang</a>' (the 'is' language), so called after the simplest possible statement. The aim is to create a 'language' that is easily learned and uses as little symbols or special syntax rules as possible, which I have seen pose a barrier to new programmers who have never seriously used a programming language before, and would say something like 'why does that line only have a curly bracket in?'

## Is

So without further ado, here is a sample program that implements a typical 'greeter' scenario:

```text
task greet gets name
  log 'Hello there, {name}!'
end

task main
  value name is 'Chris'
  run greet with name
end

run main
```

Hopefully you'll notice that there aren't many special characters. Even the indentation isn't really necessary, but as always aids readability. The structure is based on classic variables, sub-routines (here called 'tasks'), and the concepts of assignment and calling those tasks.

Let's break it down:

 • Two tasks are defined, one of which takes a single argument called 'name'.

 • This first task uses 'log' and a simplified version of JavaScript's template strings to log the name as part of a whole sentence.

 • The second task is the 'main' task.

 • The 'main' task defines a variable (called a 'value') which <em>is</em> 'Chris', a string value.

 • The earlier task 'greet' is then called with the 'run' statement, and the variable is passed to it using 'with' to indicate that the two happen together.

 • Finally, 'main' is called from the bottom of the script.

The output is thus:

```text
Hello there, Chris!
```

## Compilation

Take a look at the project on <a href="https://github.com/C-D-Lewis/islang">GitHub</a>, specifically '<a href="https://github.com/C-D-Lewis/islang/blob/master/src/transform.js">transform.js</a>', which uses a sequence of conventional rules to mould the input line (and its 'tokens', the individual words in the line) into the output line of JavaScript. This function is includes by 'index.js' and processes every line in the source '.is' file into one output JavaScript files called 'build.js'. The programmer can then run their program using node as usual.

npm run compile ./my_program.is

```text
node build.js
```

In this manner, more rules can be added, though it is limited right now to one rule per line, and only a few cases where combinations occur (such as returning a function call). This could be made more sophisticated in the future, but I confess as an Electronic Engineering graduate I have never studied how real compilers work!

## A More Complex Example

Here's a slightly more complex example that calculates the result of a series of Fibonacci calculations:

```text
task fibonacci gets input
  when input <= 1
    return input
  end

  // return fib(n-1) + fib(n-2);
  value n_minus_1 is input - 1
  value n_minus_2 is input - 2
  value result_1 is run fibonacci with n_minus_1
  value result_2 is run fibonacci with n_minus_2
  return result_1 + result_2
end

task main
  value fib_output is run fibonacci with 9
  log 'fib_output: {fib_output}'
end

run main
```

The pattern is similar, with tasks set up and called from a 'main' task. Another task performs the 'f(n-1) + f(n-2)' calculation and results the result, using some other features of the language.

Here's the resulting JavaScript:

```js
// compiled from islang source

function fibonacci (input) {
  if (input <= 1) {
    return input;
  }

  // return fib(n-1) + fib(n-2);
  let n_minus_1 = input - 1;
  let n_minus_2 = input - 2;
  let result_1 = fibonacci(n_minus_1);
  let result_2 = fibonacci(n_minus_2);
  return result_1 + result_2;
}

function main () {
  let fib_output = fibonacci(9);
  console.log(`fib_output: ${fib_output}`);
}

main();
```

```text
fib_output: 34
```

Looks familiar, right?

## Language Features

Right now those are:

 • Variables - declaration and assignment using literal numbers and strings, expressions (simple arithmetic etc.) and as function results.

```text
value my_value is 10

my_value is 20

my_value is run increment my_value
```

 • Functions - tasks can take zero or more arguments, and return values.

```text
task increment gets input_value
  return input_value + 1
end
```

 • Control - 'when' and 'until' allow use of 'if' and 'while' loop control statements using ordinary simple JavaScript operators.

```text
when temperature  15
  log 'Might be cold out there'
  temperature is temperature + 1
end
```

 • Objects - 'object' and 'property' keywords allow contruction of simple objects.

```text
object car
car property color is 'red'
car property num_wheels is 4

log 'This {car.color} car has only {car.num_wheels} wheels!'
```

## Wrapping Up

This turned out to be longer than I thought it would be, but the general point is - this is a lot of run, and I hope to add more features in the future, maybe to even use it to teach or provide some more depth or extensibility to another project...

If you're interested, check out some of the <a href="https://github.com/C-D-Lewis/islang/tree/master/examples">example programs</a>, and give the compilation a try!
