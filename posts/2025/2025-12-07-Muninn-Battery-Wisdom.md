Muninn: Battery Wisdom
2025-12-07 16:33
Pebble,Releases
---

![](assets/media/2025/12/muninn-banner.png)

It's been a very long time since I've created a brand new watchapp for Pebble.
Sure, in the last year or so I've done plenty of work on resurrecting old
projects and porting watchfaces from Fitbit, but aside from the usual suspects
of News Headlines and Tube Status (Dashboard is away at the moment) I had an
itch to create something new, something useful.

I'm aware that now more than ever the goal of estimating battery life for a
Pebble watch was something only a handful of apps had tried to solve, each with
their own pros and cons. The vast majority limit their scope to current values
or raw event reporting only.

As older Pebbles continue to age (although some get
new batteries for a new lease of battery life) and the new Core devices add a
new category of super long-lived watches, there are a lot of users who have a
very different experience and might need some help knowing if they can forget
their charging cable on that four day weekend, or week (two weeks? three!?)
holiday.

The Pebble firmware does show system uptime, and the current battery level, but
that is just about it. Even for app developers the
<code>BatteryStateService</code> in the SDK provides only the same instantaneous
snapshot of current battery level and if it is plugged in. There's no historical
data or anything that can be directly used to advise the user on when they may
need to charge.

## A Loan From Odin

![](assets/media/2025/12/muninn.jpg)

Enter Muninn! As described in old Norse mythological song, Odin has a pair of
ravens that represent 'thought' and 'mind', or sometimes 'memory', named Huginn
and Muninn. On the hunt for naming concepts that weren't as bland as 'battery
monitor' etc. I came across a number of mythological or legendary figures
associated with watching, observing, or remembering. The idea of using a passive
observer as a metaphor for how the app operates with infrequent observations of
changes in battery level was very appealing.

In short, the app uses the
[Wakeup API](https://developer.rebble.io/guides/events-and-services/wakeups/)
instead of the more ongoing
[Background Worker API](https://developer.rebble.io/guides/events-and-services/background-worker/)
to take a different approach to tracking battery discharge and estimating
remaining battery life. The goal here is to drastically reduce the incidental
impact on the battery by having the app run as little as possible which still
achieving its aims. The irony of this task is not lost on me or others.

## Looking Deeper

<table style="margin: auto;">
  <tr>
    <td><img src="assets/media/2025/12/asleep.png" style="margin-right: 30px;" /></td>
    <td><img src="assets/media/2025/12/awaiting.png"/></td>
  </tr>
</table>

After installation, the user is asked to wake Muninn up, so that he may perform
his task. The app itself wakes up every six hours to note the battery level, and
if appropriate make a comparison with the previous observation. The change in
charge and time since the last observed change are stored in a data log along
with a few other pieces of data, and after three seconds the app closes itself
again, pausing only to request another wakeup from the firmware at the next
six-hourly interval.

During the wakeup, the estimation of battery discharge for a whole day is
calculated. The formula for this is quite simple:

```c
const int result = (charge_diff * SECONDS_PER_DAY) / time_diff_s;
```

The data structure for a full sample has all the items needed to calculate
the change, as well as more items that are usesul for debugging:

```c
// A full wakeup sample
typedef struct {
  // This sample
  int timestamp;
  int charge_perc;

  // Previous values used in the calculation
  int last_sample_time;
  int last_charge_perc;

  // Comparison values
  int time_diff;
  int charge_diff;

  // Result - or special status!
  int result;
} Sample;

// History of discharge rate values used for averaging
typedef struct {
  Sample samples[NUM_SAMPLES];
} SampleData;
```

When at least two full samples (at the third wakeup; after the first reading,
and two full comparisons) are gathered, it becomes possible to start averaging
these estimations. At any time, the app has a data log window that can be used
to check each estimation and the change in time and charge level that led to
each result. The log also shows entries for periods where the charge increased
(i.e.: the watch was charged partially or fully) or remained constant if power
use was extremely low on newer watches, or reported only in 10% increments
on older ones.

![](assets/media/2025/12/data-log.png)

To balance the need for a stable estimate that doesn't vary wildly after each
observation with the need for a more realistic estimation if the rate of change
trends upwards sharply is a system of weighting different estimates depending
on their age. In summary:

- The most recent estimate has a 3x weight.

- The three next recent estimates have a 2x weight.

- The oldest four estimates have a 1x weight. 

The code for this is shown below, edited a little for brevity:

```c
int data_calculate_avg_discharge_rate() {
  SampleData *data = data_get_sample_data();
  const int count = data_get_valid_samples_count();

  // Not enough samples yet
  if (count < MIN_SAMPLES) return STATUS_EMPTY;

  int result_x3 = 0;
  int weight_x3 = 0;
  int seen = 0;

  for (int i = 0; i < NUM_SAMPLES; i++) {
    const int v = data->samples[i].result;
    // No discharge in this sample
    if (!util_is_valid(v)) continue;

    seen++;
    if (seen == 1) {
      // first item -> 3x weight
      result_x3 += v * 3;
      weight_x3 += 3;
    } else if (seen <= 4) {
      // next three -> 2x weight
      result_x3 += v * 2;
      weight_x3 += 2;
    } else {
      // rest -> 1x weight
      result_x3 += v * 1;
      weight_x3 += 1;
    }
  }

  // Nothing was counted
  if (weight_x3 == 0) return STATUS_EMPTY;

  return result_x3 / weight_x3;
}
```

Using these log entries the app can make a simple calculation of how many days
remain, and the average rate of discharge, relying on the log data and length
of the history to provide a decent level of accuracy:

```c
int data_calculate_days_remaining() {
  const int rate = data_calculate_avg_discharge_rate();
  const int charge_perc = data_get_last_charge_perc();

  if (!util_is_valid(rate) || !util_is_valid(charge_perc)) return STATUS_EMPTY;

  // Given a 'valid' log entry is only one with a discharging change
  if (rate <= 0) {
    APP_LOG(APP_LOG_LEVEL_INFO, "zero or negative rate: %d charge_perc: %d", rate, charge_perc);
    return STATUS_EMPTY;
  }

  return charge_perc / rate;
}
```

All this combined - after leaving Muninn overnight and half of one day, he can
begin his task of observing and remembering how your Pebble's battery behaves,
given your typical and changing usage, and help you plan your next charge with
confidence!

## Always Some Gotchas

![](assets/media/2025/12/missed.png)

As with usual in software engineering, there are a few small things to bear in
mind when using Muninn, though I've thought hard with solutions, some are not
always perfect:

- If the watch actually dies, or is off precisely at the next wakeup time, it will be missed. In this case the system provides no call to the app, but the user may receive a UI alert. When they next open the app, the wakeup sheduling will begin once more.

- If the battery is so old that it exhibits extreme behavior (such as 100% for two days, then drains to 0 in a few hours) then the estimates will be less accurate, but over time may still produce a number that is believeable.

- There's a chance that a wakeup scheduled will already be reserved for another app. In this case it will retry with another extra minute added, up to a maximum of ten. It feels unlikely that there will be ten more consecutive wakeups...

## More Features!

In addition to telling how many days are left, there are a few other small extra
features that the user may wish to use:

- Vibrate on sample, if they want to take a glance when Muninn does his work.

- Custom threshold, if they want to be told when the battery is approaching some value other than the default firmware definition of 'low'.

- Timeline pins, which will put a timeline pin in the future at noon on the day when Muninn thinks they will run out of charge. This works locally with the Core app's new feature to intercept the call to the timeline API. Else, the Rebble URL is used.

<table style="margin: auto;">
  <tr>
    <td><img src="assets/media/2025/12/pin1.png" style="margin-right: 30px;" /></td>
    <td><img src="assets/media/2025/12/pin2.png"/></td>
  </tr>
</table>

## Conclusion

There we have it! It lived for a couple of weeks before even the UI was begun,
I wanted to be sure the value was there and somewhat reliable before comitting
to building the whole thing. Happily it seems to be doing a good job on a few
other wrists (thank you to those who helped test in the Rebble discord!), and
the bug reports and odd behaviors were invaluable for me to find and fix.

As for the future, I will think of possible new features (such as a fancy graph,
although with the current density of data it would not provide much useful
value) although the core concept is still based on minimalism. I wouldn't want
to bloat it up without reason.

Please give it a try on the
[appstore](https://apps.rebble.io/en_US/application/692b3821d7dcba000a809ba5)
and take a look at the
[source code](https://github.com/C-D-Lewis/pebble-dev/tree/master/watchapps/muninn)
if you are interested!
