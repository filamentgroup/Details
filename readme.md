:warning: This project is archived and the repository is no longer maintained.

# Details, details.

This is a feature test and polyfill for the HTML5 `details`/`summary` markup pattern, with a couple of extras:

* Allows you to expand and collapse the `details` content above/below specified screen sizes
* Adds keyboard navigation and toggling
* Adds a bunch of ARIA goodness

Using the `open` attribute to default `details` to open/closed works as expected, naturally. To have an element only open above/below a certain size, each `details` element accepts a `data-media` attribute with a good ol’ fashioned media query in it.

I’ve included a shim for `indexOf` and `matchMedia`, both of which are required for the breakpoint behavior.

In the event that JavaScript is disabled or otherwise unavailable and `details` isn’t natively supported, the `summary` elements will simply behave like headings and all the content will be available.

It should be noted that <a href="http://github.com/mathiasbynens">mathiasbynens</a> has a simple and especially robust jQuery-based <a href="https://github.com/mathiasbynens/jquery-details">test/polyfill</a> for this markup, as well.

<a href="http://wil.to/det/">Demo</a>
