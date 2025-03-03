Pebble Watch Face SDK Tutorial #1: Beginner's Primer to the C Language
2013-06-19 17:00:11
Pebble
---

<strong>Introduction

After using the <a title="PebbleKit" href="http://developer.getpebble.com/">Pebble Watch Face SDK (aka PebbleKit)</a> to create a number of my own watch faces, and considering that being able to do so as an owner of one of these marvellous devices is one of it's main unique selling points, I'd like to use this position to help others get their foot on the ladder in terms of getting started creating their own watch faces.

This first part of the tutorial will focus on conveying the basics of the C language, which is the language of choice for writing watch faces, so that hopefully a non-programmer can pick them up and start using them to write a watch face.

At the moment, there are two viable environments for writing a watch face that I'm aware of. If you know your way around a Linux OS, such as <a title="Ubuntu" href="http://www.ubuntu.com/">Ubuntu</a> at a basic level, you can <a title="Pebble SDK Install Steps" href="http://developer.getpebble.com/1/01_GetStarted/01_Step_2">follow the steps provided by the Pebble Team</a> to set up all the tools you'll need to write, compile and install your new watch face. The alternative method is to write the code and upload resources (images, fonts etc) to <a title="cloudpebble" href="https://cloudpebble.net">cloudpebble.net</a>, a site that does all this for you, if you don't want to work with Ubuntu.

In either case, the program code is entered in to a file with the extension '.c', instead of '.jpg' or '.txt' for example. This file is then used by a piece of software supplied by Pebble in the SDK called a 'compiler' that processes your program code and produces a watch install package as a '.pbw', ready for sharing and uploading, to your watch or the web.

## Variables

The C programming language is one of the most widely used and flexible around, because it can be  adapted for almost any purpose (including Pebble Smartwatches!) and allows low level control of whatever hardware it's implemented on.

Like almost any language, C consists of variables, functions and structures. A variable can be thought of as a container for a piece of information, and comes in many types depending on what sort of information you want it to hold. For example, if you want to store a number, such as the number of minutes past the hour, you would use an <code>int</code>. This stands for integer, which is just another name for a number.

If you wanted to store a number with a decimal point, you can use a <code>float</code> type. The decimal point is here called a floating point

Another type is a string of characters, called (you guessed it) a 'string', but it's representation in C is slightly more complex. You can think of the string "Hello, world!" as a collection of individual characters. Due to the low level nature of C, this is stored in a character array. You can think of an array as just such a collection. In C, an array is declared by the number of 'slots' in the array after it's name, or can be left empty if the size is known by what you initially store in it.

Here are a couple of examples:

![](/assets/import/media/2013/06/image-11.png)

Using these types of variable, most kinds of data can be stored.

## Functions

Functions can be thought of as tasks that be started at any time. They're a good way of grouping statements (another word for a line of code or command) to act on data that you're going to be doing frequently. As a very basic example, imagine you wanted to add one to an integer. When your code is running, you don't know what that number will be, but you know where it will be coming from. It could be a literal value, or the result of a function call, so it needs to be supplied to the function.

A function declaration has three main parts:

• The return type, which is the type of data the function will supply us with when we call it to run.

• The name of the function

• The variables we supply to the function for it to work on. These are called arguments. There can be as many arguments as you need.


You can see these parts shown in the 'pseudo-function' below:

![](/assets/import/media/2013/06/image-21.png)

For all intents and purposes, a function must be declared in the file BEFORE it is used.

For our example of adding one to a number, there are two ways of doing it. The first is by specifying the integer as the function argument, and this is known as 'pass by value'. The value is copied from the call argument into the variable supplied in the function declaration ready to be used however you want. So, here is our example. See if you can follow the train of thought.

![](/assets/import/media/2013/06/image-31.png)

The value we use is 'number' and is supplied to the function in the call 'addOne(number)' by putting it in the brackets. The value then 'appears' in the function declaration as 'input', where it is incremented by one, before being returned by the function.

Here's the clever bit: As the function returns an integer type, we can assign it into the integer 'result'! It can be said that the function itself represents the integer type it returns.

I hope you can follow that. If not, look back through the last example image and follow the flow of the value of 'number'.

## Pointers

Imagine a variable came with a tag, like a label on an item at a Lost Property Office. The tag or label would describe what was attached. For example, a lost wallet with a ten pounds inside might have a label attached saying "Lost wallet". By following the string from the label to the wallet, you could then look inside and find the value held within. Another example is Baggage Reclaim at the airport. To find the luggage that belongs to you, you look for the label and flight number you've been given, which leads you to the correct bags.

![](/assets/import/media/2013/06/image-3-51.png)

It is in this way that C can reference variables by their location, but not necessarily by the actual instance of that variable. This type of 'pass by reference' is called a <code>pointer</code>, and is just a number of the memory location of where the variable is actually stored. This is especially useful for strings, where in C a string is often supplied to a function by a <code>pointer</code> to the location of the first slot in the string's character array. The rest of the string can then by read simply by incrementing the <code>pointer</code> to point to the next slot, and so on. An example of the addOne function discussed in the previous section using a pointer to the 'number' and not the actual value itself is shown below. <strong>Note the need for no return type!

![](/assets/import/media/2013/06/image-43.png?w=545)

## Program flow

Especially relevant in the realm of watch faces that change depending on the time, is the control of how the program that is the watch face executes. You might only want an animation to fire on the turn of the hour, for example. Another example is that the watch face will show "14:30" if the user selects 'Time Display 24h' in the watch settings, and "2:30" if they select 'Time Display 12h'. Thankfully, the SDK lets you facilitate this preference in your watch face program using a combination of program flow and a function supplied by the SDK.

The two key statements for controlling program flow are almost self explanatory: <code>if</code> and <code>else</code>. Much like a function call, whatever condition is placed in the brackets after an <code>if</code> decides whether the code following is executed. An example of these types of conditional statements is shown below:<b>
</b>

![](/assets/import/media/2013/06/image-5.png)

So, if the value of 'number' is exactly 5, the top segment of code is executed, but if not, then the lower segment is executed.

As a sneak preview of the next section of this tutorial 'Applying the Primer to the Pebble SDK', see if you can decipher what this code segment does...

![](/assets/import/media/2013/06/image-6.png?w=545)

Thanks for reading! Please ask any questions you have and I'll do my best to answer them!

Stay tuned for the next section of the tutorial!
