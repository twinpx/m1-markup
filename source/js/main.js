//sideNav
$( "#slide-out" ).sidenav();

//top menu
$( '.b-header-top-menu a' ).click( function(e) {
  var id = String( $( this ).attr( 'href' )).split( '#' )[1];
  if ( document.getElementById( id )) {
    e.preventDefault();
    $.scrollTo( ($( '#' + id ).offset().top-100) + 'px', 500);
    return;
  }  
});

$( '#slide-out a' ).click( function(e) {
  var instance = M.Sidenav.getInstance( document.querySelector( '.sidenav' ));
  instance.close();
  
  var id = String( $( this ).attr( 'href' )).split( '#' )[1];
  if ( document.getElementById( id )) {
    e.preventDefault();
    $.scrollTo( ($( '#' + id ).offset().top-100) + 'px', 500);
    return;
  }
});

$( '.b-filter .col.xl9' ).niceScroll();