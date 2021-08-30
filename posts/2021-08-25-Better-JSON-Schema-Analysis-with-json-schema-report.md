Better JSON Schema Analysis with json-schema-report
2021-08-25 21:58
JavaScript
---

Many times in my career this far I have encountered JSON Schema schemas as a
means of validating JSON data, either as data from some API or from a file. It's
a concise and flexible format with good documentation, and I'm a big fan.

With simple schemas and data, validation is very useful and can give API users
good helpful feedback about why their request failed. But in cases of extremely
large or complex schemas, common validators fail to provide the key details that
help those same users correct their submissions.

In this post, I will detail how such validators are useful, when they are not
so useful, and a tool I've created called
[json-schema-report](https://github.com/c-d-lewis/json-schema-report) that makes
it much easier to debug such large schemas and save a lot of time.

![](assets/media/2021/08/jsr.png)

## A quick intro

If you're not already aware, here's an example JSON Schema schema
describing a car type of object and what it should look like:

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
      "type": "number",
      "minimum": 2
    },
    "topSpeed": {
      "type": "number"
    }
  }
}
</div></pre>

It describes the 'shape' of objects that are a valid 'car' type -
<code>color</code> should be a string, <code>numDoors</code> should be a number
greater than or equal to two - you get the idea. So the following data will be
validated as labelled:

<!-- language="js" -->
<pre><div class="code-block">
// Valid - all properties required are present and correct
const validCar = {
  color: 'red',
  length: 3.4,
  numDoors: 4,
  topSpeed: 105
};

// Invalid - some properties are the wrong type
const invalidCar = {
  color: 'black',
  length: '25m',
  topSpeed: '230kph',
};
</div></pre>

We can use a package such as the popular <code>jsonschema</code> npm module
to build a validator function to check data we might receive:

<!-- language="js" -->
<pre><div class="code-block">
const { validate } = require('jsonschema');

/**
 * Validate data as a car.
 *
 * @param {object} data - The data to validate.
 */
const validateCar = (data) => {
  const { errors } = validate(data, carSchema);
  if (errors.length) {
    console.log(errors.map(p => p.stack));
  }
};

validateCar(invalidCar);
</div></pre>

This shows us some hints about why the data isn't valid:

<!-- language="js" -->
<pre><div class="code-block">
[
  "instance.length is not of a type(s) number",
  "instance.topSpeed is not of a type(s) number"
]
</div></pre>

## Very large (and scary) schemas

This is all fine when the schema is relatively simple - a simple description
of expected properties such as that above for a car for example. However, I
recently had the pleasure of working on a validator for the fearsome schema for
GS1 EPCIS events - objects describing events that happen to consumer products
as they are manufactured and shipped around the world.

Long story short - this format is extremely flexible to encompass all the
possible kinds of events and transformations these products undergo as they make
their way to stores from raw materials, but also
[very strictly defined](https://github.com/gs1/EPCIS/blob/master/JSON/EPCIS-JSON-Schema-single-event.json).

When we test candidate EPCIS events against the same validator for this large
format, the nature of the schema (it uses many layers of abstractions and
advanced JSON Schema features such as <code>oneOf</code>, <code>anyOf</code>,
and <code>allOf</code>), the errors we get back are a lot less helpful both for
us as well as anybody that might want to send us EPCIS events.

<!-- language="text" -->
<pre><div class="code-block">
instance failed to match exactly one schema (matched 0 out of 5)
</div></pre>

Not very useful for debugging...

In this instance, the data failed to match any sub-schema for each of the five
major event types. Out of the 20+ potential properties of all of the event types
we have no way of knowing which type of event was the closest to being correct
(for example, one bad date format can invalidate the entire event type
sub-schema) or which properties caused validation to fail.

## Looking deeper

In debugging these bad events, the usual course of action is to painstakingly
compare the huge EPCIS schema against the failing data after the fact, and use
our eyes to spot the format/data mistakes on a field-by-field basis, which can
take a lot of time. What was needed was a way to see all validation results,
not just the first error encoutered which causes some validator to stop early.

Other kinds of validators go a step further and return all errors for all of the
partually matching sub-schemas for different event types, but this makes both
a poor developer experience in an API response, and doesn't give a quick
indication of which was the closest possible match. For EPCIS events, this was
usually over 100 errors to consider, most of which were not relevant because
they were for types of event other than the one we were trying to send, such as
an <code>AggregationEvent</code> when we were actually sending
<code>ObjectEvent</code>.

I had a quick look around for such a tool or library that gave a detailed
breakdown of schema validation results, but came up with very little or nothing
that was relevant enough, so on a weekend earlier in the year I decided to
have a go at it myself.

## json-schema-report

My approach was this - for each property in the schema, see if it is present
and correct in the provided instance being validated.

- If it is a basic type such as <code>string</code> validate it.

- If it is an object with properties inside, or an array of objects, go one
level deeper and check those child properties recursively.

- If it is a 'multi-schema', such as <code>oneOf</code>, <code>anyOf</code>,
and <code>allOf</code>, check each sub-schema against the data in the same
recursive fashion, and once all are checked, apply the required logic for those
operators. For example, if it's a <code>oneOf</code> only validate if one of
the schemas matched the data and the other candidates did not.

This last part was the most complicated to implement, given that it should be
made relatively easy to see which of many possible sub-schemas is the most
correct one, which can make the difference between seeing only one or two
errors that actually need to be corrected, and a dozed errors that are not
relevant and are then a distraction.

In any case, the structure of the data is shown visually with color coding,
showing which properties validated, which did not, which were missing, and which
were optional in the schema's eyes, but omitted from the data itself.

To demonstrate this improved power to deduce more quickly which properties
should be corrected, here is an example output for an EPCIS event with only one
actual error, in the more helpful color-coded summary style, expressing also the
structure of the schema:

![](assets/media/2021/08/jsr-objectevent.png)

We can see from the top level down to <code>onlyValidEvent</code> that if we
intended to send an <code>objectEvent</code> then the only issue is that we
forgot to include the <code>action</code> property - an easy fix. In addition
we are warned that at the top document level that <code>schemaVersion</code>
is not a string, but in fact was a number - another easy fix.

To contrast, if we were not sure what the intended event type was, a look at the
section of the output for <code>transformationEvent</code> tells us visually
and in detail that it is very unlikely that the data contained an attempted
event of that type due to the large number of missing required properties. This
example also shows the complex nature of the schema itself, with many layers of
'multi-schema' clauses:

![](assets/media/2021/08/jsr-transformationevent.png)

## Conclusion

The first version was quickly thrown together and then left alone after the
initial need for it went away, but I recently finished it up and made it much
more useful for these kinds of complex schemas. Hopefully it will assist me in
my future EPCIS-related endevours when data is not valid and time to spend
debugging it is short.

As a visual aid, it does the job well. But where the true value lies is in
bringing the same improvements in ease-of-debugging to API users. Instead of
a single unhelpful statement, or a list of 100+ possibly-relevant errors,
perhaps some future version could act as a library that buckets errors based on
each sub-schema, and provides some measure of probability of completeness to
help determine where to focus debugging efforts and time spent.

Check out the
[project repository](https://github.com/C-D-Lewis/json-schema-report) for all
the code and documentation in case you want to use it yourself! It also includes
a set of unit tests that give examples of all the types of schema supported.

You can also install it directly from npm:

<!-- language="text" -->
<pre><div class="code-block">
npm i -g json-schema-report
</div></pre>

And then use it with a schema file and data instance file:

<!-- language="text" -->
<pre><div class="code-block">
$ jsr ./car-schema.json carSample.json
</div></pre>
