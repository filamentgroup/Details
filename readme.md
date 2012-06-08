# Details, details.

This is a feature test and polyfill for the HTML5 `details`/`summary` markup pattern, with a couple of extras:

* Allows you to expand and collapse the `details` content above/below specified screen sizes
* Adds keyboard navigation and toggling
* Adds a bunch of ARIA goodness

Using the `open` attribute to default `details` to open/closed works as expected, naturally. To have an element open only below a certain screen size, you use the data attribute `data-open-below` with the (pixel-based, for now) breakpoint width as the value. Likewise, to have the element open only above a certain screen size, use `data-open-above` the same way.

If either `data-open-above` or `data-open-above` is used _without_ a value, the default for both is currently 500px — that will soon be settable as a global option.

In the event that JavaScript is disabled or otherwise unavailable and `details` isn’t natively supported, the `summary` elements will simply behave like headings and all the content will be available.

*Note:* The Unicode arrows currently in play are poorly supported on mobile browsers, and will likely be replaced by +/- soon.

It should also be noted that <a href="http://github.com/mathiasbynens">mathiasbynens</a> has an especially robust jQuery-based <a href="https://github.com/mathiasbynens/jquery-details">test/polyfill</a> for this markup, as well.

Updates to come, and <a href="http://wil.to/det/">here is a demo</a>.