( function($) {

  'use strict';
  
  $( function() {
    
    if ( window.matchMedia( '( max-width: 600px )' ).matches ) {
      $( '.b-top-gallery .fotorama' ).data( 'fotorama' ).resize({
        height: 473
      });
    }
    
    $( '.b-top-gallery__item .b-btn' ).click( function(e) {
      e.preventDefault();
      e.stopPropagation();
      $.scrollTo( 'about' );
    });
  
    /*if ( window.BX ) {
      BX.addCustomEvent( "onFrameDataReceived", function () {});
    }*/
  });

}( jQuery ));