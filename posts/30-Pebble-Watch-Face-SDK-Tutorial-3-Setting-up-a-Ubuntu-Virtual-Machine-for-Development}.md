---
index: 30
title: Pebble Watch Face SDK Tutorial #3: Setting up a Ubuntu Virtual Machine for Development
postDate: 2013-06-20 19:28:03
original: https://ninedof.wordpress.com/2013/06/20/pebble-watch-face-sdk-tutorial-3-setting-up-a-ubuntu-virtual-machine-for-development/
---

Links to Previous Sections:

Here are links to the previous sections of this tutorial. Read them if you haven't to get up to speed!

 [Part #1: Beginner's Primer to the C Language](http://ninedof.wordpress.com/2013/06/19/pebble-watch-face-sdk-tutorial-1-beginners-primer-to-the-c-language/)

 [Part #2: Applying the Primer to the Pebble SDK](http://ninedof.wordpress.com/2013/06/20/pebble-watch-face-sdk-tutorial-2-applying-the-primer-to-the-pebble-sdk/)

## Introduction

In this section of the tutorial I'll do an almost click by click run-through of how to set up a Virtual Machine running Ubuntu Linux for developing watch faces and apps. This will be without any screenshots because it's a very linear 'click next to continue' sort of process. If you get stuck, there are numerous guides that are Google-able to achieve this goal.

The reason this is done is because the software tools and compilers used are only supported on Linux, and not Windows.

Again, if you would rather prefer not to do this you can use  [cloudpebble.net](http://cloudpebble.net) to write the .c files and compile them, but it's always interesting to see a new facet of computing that you might not have done otherwise. It can also be said that this method of building watch faces and apps grants you more control, but it's up to  you.

An advantage of using cloudpebble instead of installing your own Virtual Machine is that if you wanted only to modify an existing watch face and study the effects, that is a simpler option. You can focus on writing watch face code and compilation. For example, you can make a small modification to an existing watch face to save bothering the developer, but in most case I'd hope they would be happy to help, unless they were inundated with requests!

## Important Downloads

Before you start, make sure you download both these files. You'll need them!
<ol>
	- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
	- [A DVD image file for Ubuntu OS](http://www.ubuntu.com/download/desktop). I'd recommend 12.04 LTS. Pick the architecture version that is applicable. If you're unsure, select 32-bit. If you want to donate, that's great, but you don't have to. On the next page choose 'not now, take me to the download' to go straight there.
</ol>
## Setting Up the Virtual Machine
<ol>
	- Install and open VirtualBox. Click 'New' at the top left corner.
	- Enter a name for your Virtual Machine and select 'Type' as 'Linux' and 'Version' as 'Ubuntu' or 'Ubuntu 64', depending on your preference earlier.
	- Choose a memory size. I'd recommend between 1 GB and 2 GB. (1024 MB - 2048 MB to be more precise)
	- Choose 'Create a virtual hard drive now'.
	- Choose the 'VDI' type.
	- Select 'Dynamically allocated'. An explanation of the difference is given.
	- Name your virtual hard drive and set the capacity. I'd recommend 8 GB if you have that much available, but Ubuntu itself recommends at least 4.5 GB. You'll need extra space for installing the Pebble SDK and tools.
	- You should now be back at the main VirtualBox window you started in. Click 'Start'.
	- When asked for the instal medium, click the 'folder with green arrow' icon on the right of the dialogue and navigate to the Ubuntu .iso you downloaded earlier.
	- Press 'Start' and wait for the 'Welcome' window.
</ol>
## Setting up Ubuntu
<ol>
	- Select your preferred language on the left pane and then choose 'Install Ubuntu'.
	- If you prefer, select the box for 'Download updates while installing'. This will ensure the standard parts of Linux that the SDK may rely on are up-to-date, and I'd strongly recommend it. Press 'Continue'.
	- Select 'Erase Disk and Install Ubuntu'. This is fine, as the whole machine is running on a virtual hard disk, which is merely a single file on your host OS. Your computer is safe!
	- Press 'Continue', then 'Install now'.
	- Wait for the installation to complete and answer the additional locale questions. This should take no more than ten minutes. (I remember waiting almost two hours for Windows XP to install back in the day).
	- Click 'Restart Now' when asked, then press ENTER when asked. There is no CD to eject.
</ol>
## Set Up Toolchain

Now you need to install the software tools and dependencies the SDK requires to work.

I would go though it in detail here, but there really is only one correct way of doing it and that method is documented in fine detail [over on the official Pebble Developer site](http://developer.getpebble.com/1/welcome). Make sure you follow the instructions to the letter and make sure you resolve any problems you encounter before you try and proceed any further, or you'll be wasting your time!

I'd say that only Step 1 and Step 2 on the left hand side are essential right now, then you will be ready for the next section of my tutorial, but if you're interested, a little extra reading is great.

## Next Time

In the next section there will be a detailed look at the key features of a basic watch face source file, and you'll end up with your first custom built watch face!

Best of luck! Remember there are already lots of answered questions and solutions to common problems over on the Pebble  [SDK Install](http://forums.getpebble.com/categories/sdk-install) and  [SDK Help](http://forums.getpebble.com/categories/watchface-sdk-help) forums.
