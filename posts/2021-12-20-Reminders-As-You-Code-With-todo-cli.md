Reminders As You Code With todo-cli
2021-12-20 20:23
JavaScript,Releases,TypeScript
---

Frequently in my day to day work time I find myself making notes of small things
to do when I have some free time betwen meetings or other tasks. It's time
consuming to be constantly switching contexts to do these at the time they come
up, so I used to write them down on a note pad on my desk to serve as a reminder
for things to do when time was available.

Sadly, that pad is in the office in London, and I don't work there as much
anymore. I'm usually good at remembering things, but if I want to be sure I
won't forget, I'll put it in my calendar, or in Google Keep, etc. But even then
there is a chance that once those one-off reminders come and go I'll still
forget to do the things I was orignally reminding myself of.

I needed a way to repeatedly remind my self what tasks or promises I had
deferred until I had actually done them, in a place where I would be sure to
see them - why not the terminal? So after a little prototyping we have
(probably one of many that already exist) a terminal-based tool to track small
tasks and serve reminders - <code>todo-cli</code>. And I think this is my first
public side-project shipped with TypeScript - I love how it helps me keep track
of complex objects I pass around the code.

![](assets/media/2021/12/cli.png)

It's designed to integrate into my existing setup - using
<code>.bash_profile</code> to remind me again every time I start a new terminal
session which is usually a few times a day.

The commands are simple: 

- <code>todo add $message</code> to add a new item.

- <code>todo list</code> to show all existing items.

- <code>todo update $index $message</code> to update an existing item.

- <code>todo done $index</code> to mark an item as complete and remove it.

Each command has a short-form equivalent too, such as <code>todo l</code> to
list, or <code>todo a $message</code> to add a new item.

![](assets/media/2021/12/cli-items.png)

In this way, I can view, quickly add and check off items as I complete them,
and be reminded once only when I begin a new terminal (when I'm usually
switching) contexts anyway, which could be a suitable time to quickly check
a task off the list.

As you can see above from the example <code>list</code> output, there is a
configurable feature to mark items in red if they exist for too long since they
were added. By default this is three days, but it will be different for
different people. I actually imagine that the time-sensitivity would be unique
to the actual task, but that granularity can be deferred for a future update.

On to the todo list it goes!

## Conclusion

I've been using this successfully for a couple of weeks now, as opposed to other
side projects that are fun to develop but then lay in a repository unused. And
it has genuinely made me better at remembering and fufilling all those small
"I'll do it a bit later" tasks or things I promise to do for my colleagues in
a reasonably timely manner, so I'm confident it will get even more usage into
the new year and beyond.

As always, you can see the [repository](https://github.com/c-d-lewis/todo-cli)
and install it yourself to give it a try and hopefully help you with similar
tasks.

```text
npm i -g @chris-lewis/todo-cli
```
