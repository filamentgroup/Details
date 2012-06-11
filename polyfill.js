(function(win, undefined){
	var detailsTest = (function() {
			var fakeBody,
				doc = document,
				de = doc.documentElement,
				bod = doc.body || (function() {
					fakeBody = true;
					return de.insertBefore(doc.createElement('body'), de.firstElementChild || de.firstChild);
				}()),
				det = doc.createElement('details'),
				div = doc.createElement('div'),
				txt = doc.createTextNode('W'),
				ret;

			div.style.visibility = 'hidden';
			det.style.display = 'block';
			det.style.fontSize = '7px';
			det.style.lineHeight = '7px';

			div.appendChild(txt);
			det.appendChild(div);	
			bod.appendChild(det);

			ret = div.offsetHeight === 0;

			bod.removeChild(det);
			fakeBody && bod.parentNode.removeChild(bod);

			return ret;
		})(),
		siblings = function( oEl ) {
			var sibs = [],
				el = oEl.parentNode.firstChild;

			while( el = el.nextSibling ) {
				if( el.nodeType === 1 && el !== oEl ) {
					sibs.push( el );
				}
			}
			return sibs;
		},
		collapseDetails = function() {
			var windowWidth = window.innerWidth,
				open = det.getAttribute("open") !== null;

			for( var i = 0; i < breakpointed.length; i++ ) {
				var point = breakpointed[i].breakpoint,
					open = breakpointed[i].dir == "below" ? windowWidth >= point : windowWidth <= point;

				breakpointed[i].el[ ( open ? "set" : "remove" ) + "Attribute" ]( "open", "open" );

				if( !detailsTest ) {
					var summary = breakpointed[i].el.getElementsByTagName("summary")[0];

					polyfillToggle( summary, open );
				}
				// Update the aria attributes:
				ariaStates( breakpointed[i].el, open );
			}
		},
		polyfillToggle = function( el, open ) {
			var content = siblings( el );

			el.parentNode[ ( !open ? "set" : "remove" ) + "Attribute" ]( "open", "open" );
			el.firstChild.innerHTML = !open ? leftarr : downarr;

			for( var i = 0; i < content.length; i++ ) {
				content[i].style.display = ( open ? "block" : "none" );
			}
		},
		ariaStates = function( el, open ) {
			// Get first-level contents of the `details` element:
			var contents = el.children;

			// Set the "aria-expanded" true/false value on `details`:
			el.setAttribute( "aria-expanded", open );

			// Set the "aria-hidden" false/true value on all `details` contents except the summary:
			for( var j = 0; j < contents.length; j++ ) {
				contents[j].nodeName !== "SUMMARY" && contents[j].setAttribute( "aria-hidden", !open );
			}
		},
		details = document.getElementsByTagName("details"),
		leftarr = "+",
		downarr = "-",
		breakpointed = [];
	
	// Loop through each of the `details` elements.
	for( var i = 0; i < details.length; i++ ) {
		var det = details[i],
			summary = det.getElementsByTagName("summary")[0],
			openBelow = det.getAttribute( "data-open-below" ),
			openAbove = det.getAttribute( "data-open-above" ),
			// If a value isn't set, on `data-open-below` and `data-open-above`, use five-hundo.
			breakpoint = openBelow || openAbove || 500,
			open = det.getAttribute("open") !== null;

		ariaStates( det, open );

		// If there are breakpoints set, add the elements/details to a `breakpointed` array:
		if( openBelow !== null || openAbove !== null ) {			
			breakpointed.push( { "el" : det, dir : ( openBelow !== null ? "below" : "above" ), "breakpoint" : breakpoint } );
		}

			// Make sure we can navigate to the summary via the tab key:
			summary.setAttribute( "tabindex", 0 );

			if( !detailsTest ) {
				// Create the little toggle arrow element:
				var tog = document.createElement("div");
			
				tog.style.cssFloat = "left";
				tog.style.paddingRight = ".5em";
				tog.style.fontSize = ".9em";
				tog.style.lineHeight = "1.2em";

				tog.setAttribute("class", "details-toggle");

				// Add the toggle to the start of the `summary`
				summary.insertBefore( tog, summary.firstChild );
			
				// Set the initial indicator arrow dealie.
				tog.innerHTML = !open ? downarr : leftarr;

				polyfillToggle( summary, open );
			}

			summary.addEventListener("click", function(e) {
				var det = this.parentNode,
					open = det.getAttribute("open") !== null;

				// Show/hide the `details` content in browsers that don’t support it natively.
				if( !detailsTest ) {
					polyfillToggle( this, open );
					ariaStates( det, open );
				} else {
					// Update the aria attributes:
					ariaStates( det, !open );
				}
				// Now that the user is interacting with the page, stop triggering the breakpointed collapsibles on resize.
				window.removeEventListener( "resize", collapseDetails );
			});

			if( !detailsTest ) {
				// Trigger a click on the `summary` element when focused and enter or the spacebar are pressed:
				summary.addEventListener("keydown", function(e) {
					if( e.keyCode == 32 || e.keyCode == 13 ) {
						var ev = document.createEvent("HTMLEvents");

						ev.initEvent("click", true, true);
						this.dispatchEvent( ev, collapseDetails );	
					}
				});
			}
	}

	// If we have breakpointed `details` in that array, trigger them now and on window resize.
	if( breakpointed.length ) {
		collapseDetails();
		window.addEventListener( "resize", collapseDetails );
	}

})(this);
