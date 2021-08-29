Better JSON Schema Analysis
2021-08-25 21:58
JavaScript
---

Many times in my career this far I have encountered JSON Schema schemas as a
means of validating JSON data, either as data from some API or from a file. It's
a concise and flexible format with good documentation, and I'm a big fan.

If you're not already aware, here's an example schema describing a car:

<!-- language="json" -->
<pre><div class="code-block">
{
  "type": "object",
  "required": ["color", "length", "topSpeed"],
  "properties": {
    "color": {
      "type": "string"
    },
    "length": {
      "type": "number"
    },
    "numDoors": {
      "type": "number"
      "minimum": 2
    },
    "topSpeed": {
      "type": "number"
    }
  }
}
</div></pre>

## Heading

Text

![](assets/media/2021/08/jsr-example.png)

## Conclusion

Text

Check out the
[project repository](https://github.com/C-D-Lewis/json-schema-report) for all
the code and documentation in case you want to use it yourself!
