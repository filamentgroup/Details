(function(win, undefined){
	win.det = {
		breakpointed : [],
		closedicon : "<span class='icon i-triangle-right-blue'>+</span>",
		openicon : "<span class='icon i-triangle-down-blue'>-</span>",
		support : (function() {
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
		collapseDetails : function() {
			var windowWidth = window.innerWidth;

			for( var i = 0; i < det.breakpointed.length; i++ ) {
				var bkpt = det.breakpointed[i],
					open = win.matchMedia( bkpt.breakpoint ).matches;

				bkpt.el[ ( open ? "set" : "remove" ) + "Attribute" ]( "open", "open" );

				if( !det.support ) {
					var summary = bkpt.el.getElementsByTagName("summary")[0];

					polyfillToggle( summary, open );
				}
				// Update the aria attributes:
				win.det.ariaStates( bkpt.el, open );
			}
		},
		polyfillToggle : function( el, open ) {
			var siblings = function( oEl ) {
					var sibs = [],
					el = oEl.parentNode.firstChild;

				while( el = el.nextSibling ) {
					if( el.nodeType === 1 && el !== oEl ) {
						sibs.push( el );
					}
				}
				return sibs;
			},
			content = siblings( el );

			el.parentNode[ ( !open ? "set" : "remove" ) + "Attribute" ]( "open", "open" );
			el.firstChild.innerHTML = !open ? det.closedicon : det.openicon;

			for( var i = 0; i < content.length; i++ ) {
				content[i].style.display = ( open ? "block" : "none" );
			}
		},
		ariaStates : function( el, open ) {
			// Get first-level contents of the `details` element:
			var contents = el.children;

			// Set the "aria-expanded" true/false value on `details`:
			el.setAttribute( "aria-expanded", open );

			// Set the "aria-hidden" false/true value on all `details` contents except the summary:
			for( var j = 0; j < contents.length; j++ ) {
				contents[j].nodeName !== "SUMMARY" && contents[j].setAttribute( "aria-hidden", !open );
			}
		},
		init : function( ) {
			var details = document.getElementsByTagName("details");

			// Loop through each of the `details` elements.
			for( var i = 0; i < details.length; i++ ) {
				var detail = details[i],
					summary = detail.getElementsByTagName("summary")[0],
					breakpoint = detail.getAttribute( "data-media" ),
					open = detail.getAttribute("open") !== null;

				det.ariaStates( detail, open );

				// If there are breakpoints set, add the elements/details to a `breakpointed` array:
				if( breakpoint !== null ) {
					det.breakpointed.push( { "el" : detail, "breakpoint" : breakpoint } );
				}

				// Make sure we can navigate to the summary via the tab key:
				summary.setAttribute( "tabindex", 0 );

				if( !det.support ) {
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
					tog.innerHTML = !open ? det.openicon : det.closedicon;

					det.polyfillToggle( summary, open );
				}

				summary.addEventListener("click", function(e) {
					var detail = this.parentNode,
						open = detail.getAttribute("open") !== null;

					// Show/hide the `details` content in browsers that don’t support it natively.
					if( !det.support ) {
						det.polyfillToggle( this, open );
						det.ariaStates( detail, open );
					} else {
						// Update the aria attributes:
						det.ariaStates( detail, !open );
					}
					// Now that the user is interacting with the page, stop triggering the breakpointed collapsibles on resize.
					window.removeEventListener( "resize", det.collapseDetails );
				});

				if( !det.support ) {
					// Trigger a click on the `summary` element when focused and enter or the spacebar are pressed:
					summary.addEventListener("keydown", function(e) {
						if( e.keyCode == 32 || e.keyCode == 13 ) {
							var ev = document.createEvent("HTMLEvents");

							ev.initEvent("click", true, true);
							this.dispatchEvent( ev, det.collapseDetails );
						}
					});
				}
			}
			// If we have breakpointed `details` in that array, trigger them now and on window resize.
			if( det.breakpointed.length ) {
				det.collapseDetails();
				window.addEventListener( "resize", det.collapseDetails );
			}
		}
	}

	det.init();

})(this);
