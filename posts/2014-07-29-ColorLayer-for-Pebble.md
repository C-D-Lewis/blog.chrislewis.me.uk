ColorLayer for Pebble
2014-07-29 14:55:30
Pebble,Releases
---

<strong>Edit: 100th post!

Quick post to share  a 'new' <code>Layer</code> type I created for an upcoming project: <code>ColorLayer</code>. It's supposed to be a convenience for adding a simple layer of colour. Problem is, unless I'm missing something very obvious, the two options are to declare a standard <code>Layer</code> and assign it a basic <code>_fill_rect()</code> <code>LayerUpdateProc</code>, or use a <code>TextLayer</code> and modifying the background colours.

I normally choose the latter, so for the umpteenth time of doing so I decided to wrap it up to make it a bit simpler to use. Here's the result!

## ColorLayer.h

```cpp
/**
 * Layer on top of TextLayer used just for coloring areas without using LayerUpdateProc
 * Author: Chris Lewis (@Chris_DL)
 * Version 1.0.0
 */
#include

#ifndef COLOR_LAYER_H
#define COLOR_LAYER_H

typedef struct {
  TextLayer *layer;
} ColorLayer;

ColorLayer* color_layer_create(GRect bounds, GColor fill_color);
void color_layer_destroy(ColorLayer *this);
void color_layer_set_color(ColorLayer *this, GColor fill_color);
void color_layer_set_frame(ColorLayer *this, GRect bounds);
Layer* color_layer_get_layer(ColorLayer *this);

#endif
```

## ColorLayer.c

```cpp
#include "color_layer.h"

ColorLayer* color_layer_create(GRect bounds, GColor fill_color)
{
  ColorLayer *this = malloc(sizeof(ColorLayer));
  this->layer = text_layer_create(bounds);
  text_layer_set_background_color(this->layer, fill_color);

  return this;
}

void color_layer_destroy(ColorLayer *this)
{
  text_layer_destroy(this->layer);
  free(this);
}

void color_layer_set_color(ColorLayer *this, GColor fill_color)
{
  text_layer_set_background_color(this->layer, fill_color);
}

void color_layer_set_frame(ColorLayer *this, GRect bounds)
{
  layer_set_frame(text_layer_get_layer(this->layer), bounds);
}

Layer* color_layer_get_layer(ColorLayer *this)
{
  return text_layer_get_layer(this->layer);
}
```

It could be argued that it's such a thin layer you may as well not bother, but I find it to be sufficiently easier to setup and read (as well as avoiding confusion with <code>TextLayer</code>s that actually show text), so once again I'm glad coding allows a degree of personal preference and style!
