(function(win, undefined){
	win.det = {
		breakpointed : [],
		closedicon : "<span class='details-marker open'>+</span>",
		openicon : "<span class='details-marker close'>-</span>",
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

					det.polyfillToggle( summary, open );
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
				content[i].style.display = open ? "" : "none";
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

				if( !summary ) {
					continue;
				}

				det.ariaStates( detail, open );

				// If there are breakpoints set, add the elements/details to a `breakpointed` array:
				if( breakpoint !== null ) {
					det.breakpointed.push( { "el" : detail, "breakpoint" : breakpoint } );
				}

				// Make sure we can navigate to the summary via the tab key:
				summary.setAttribute( "tabindex", "0" );

				if( !det.support ) {
					// Create the little toggle arrow element:
					var tog = document.createElement("div");

					tog.style.cssFloat = "left";
					tog.style.display = "inline";
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

				var clicked = function( e ) {
					var el = ( win.event ) ? event.srcElement : this,
						detail,
						open;

					while( el.nodeName && el.nodeName !== "SUMMARY" ) {
						el = el.parentNode;
					}

					detail = el.parentNode,
					open = detail.getAttribute("open") !== null;

					// Show/hide the `details` content in browsers that don’t support it natively.
					if( !det.support ) {
						det.polyfillToggle( el, open );
						det.ariaStates( detail, open );
					} else {
						// Update the aria attributes:
						det.ariaStates( detail, !open );
					}

					for( var k = 0; k < det.breakpointed.length; k++ ) {
						var bk = det.breakpointed[ k ];

						if( bk.el == el.parentNode ) {
							det.breakpointed.splice( det.breakpointed.indexOf( bk ), 1 );
						}
					}
				};
				
				if( win.addEventListener ) {
					summary.addEventListener("click", clicked, false );
				} else {
					summary.attachEvent( "onclick", clicked );
				}
		
				if( !det.support && win.addEventListener ) {
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
			if( det.breakpointed.length && win.matchMedia && Array.prototype.indexOf ) {
				det.collapseDetails();
				
				if( !win.addEventListener ) {
					win.addEventListener = function( evt, cb ){
						return win.attachEvent( "on" + evt, cb );
					};
				}
				
				win.addEventListener( "resize", det.collapseDetails );
			}
		}
	}

	det.init();

})(this);
