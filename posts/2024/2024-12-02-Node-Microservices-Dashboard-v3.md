Node Microservices Dashboard v3
2024-12-02 20:35
Integration,Raspberry Pi,TypeScript
---

Since the <code>node-microservices</code> project has been in use for managing
the apps, startup, configuration, and networking of many devices I have found
that while it offers the management functionality I need, it could be better.

Some examples of problems I had with it:

- Crowded appearance and trying to show too much information at once.

- Messy state management leading to inconsistencies after some navigation.

- Some features were rushed, such as metric graphs.

- Some features were never used, such as manually sending inputs to various app Conduit topics.

- No mobile layout, making it hard to use on phones.

It has certainly seen some evolution. Here are some screenshots of various
previous incarnations:

## Version 1

This version just allowed direct input and output to Conduit and not much else.
I wasn't up to speed enough with flexbox to get more advanced.

![](assets/media/2024/12/dashboard-v1-old.png)

![](assets/media/2024/12/dashboard-v1.png)

## Version 2

This version focused on component-based development and providing inputs for all
'useful' topics for each service on each device. It shows too many pieces of
information in the constraints of the layout, making it less intuitive.

![](assets/media/2024/12/dashboard-v2.png)

![](assets/media/2024/12/dashboard-v2-device.png)

## Version 3

So, given how messy and ad-hoc version 2 was, I thought it would be better to
start from scratch for version 3 with some clear goals:

- Cleaner interface.

- Cleaner state management.

- Components own their own data load with Fabricate handlers.

- Better metric graphs using HTML Canvas.

- More logical layout.

- Only offer features that will be used, added to when needed.

- Mobile-first layout, since I usually check metrics and change light colors on my phone.

After some weeks and months of gradual increments I arrived at version 3 as it
is today.

![](assets/media/2024/12/dashboard-v3.png)

The left section allows quick status of each device (is it checking in?) and
the address to connect it to, grouped by public network. For those that report
the <code>caseColor</code> property, it is shown as a left border.

The right section appears once a device is selected. It has some top-level info
at the top such as Git commit, last seen, disk usage, and uptime. Some simple
actions such as reboot and shutdown are also available. 

Below that are groups of widgets that are focused on providing meaninful
functionality instead of just text fields for each topic's inputs. They are:

- HTML Canvas based metric graphs over the course of a last day, using Monitor's metric API. Points are joined up properly and the vertical range adjusts based on min/max values unless it is a percentage value. If a metric exists, it is drawn here.

- Lighting palette. If a device is running Visuals and reports <code>hasLights</code> a selection of colors is shown. Clicking one will cause the connected LED lights to switch to that color.

![](assets/media/2024/12/dashboard-v3-lights.png)

- Running apps connected to the local Conduit. Like version 2 of the dashboard, they may show some controls or extra display. Currently the names and schedules of Monitor plugins is the only one implemented.

The orange bar across the top counts down to a refresh of data every minute,
something the older versions didn't have and is more useful when used to look at
metrics over a long period of time.

## Mobile view

A key improvement is a mobile layout, using Fabricate's
<code>setNarrowStyles()</code>. It mainly arranges all parts of the layout in a
vertical orientation:

![](assets/media/2024/12/dashboard-v3-mobile-1.png)

Since the metric graphs are fixed-width for a single whole day's data, they are
purposefully not expanded like other components in the mobile view:

![](assets/media/2024/12/dashboard-v3-mobile-2.png)

## Conclusion

There we have it - a third refresh of the dashboard for the
<code>node-microservices</code> project. I use it daily, from checking overnight
metrics to executing safe shutdowns for maintenance without needing to SSH in
first. The metric graphs are particularly helpful for monitoring the
aforementioned larger group Minecraft server. I can see since installing the
active cooler that it has not yet breached 60 degrees, a solid result!

Check out the repository in the
[usual place](https://github.com/C-D-Lewis/node-microservices/tree/master/dashboard).

One last improvement is a move from Webpack to Vite. The build is much faster,
and the configuration is much simpler. I'm in the process of moving my other
web projects to Vite as well - a topic for a future post.
