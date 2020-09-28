$( '.b-tabs' ).each( function() {
  var $tabs = $( this ),
      $nav = $tabs.find( '.b-tabs__nav' ),
      $content = $tabs.find( '.b-tabs__content' ),
      $items = $tabs.find( '.b-tabs__item' );
      
  $content.find( '.b-tabs__item:not( .i-active )' ).hide();
      
  $nav.delegate( 'a', 'click', function(e) {
    e.preventDefault();
    var $a = $( this );
    var $activeTab = $content.find( '.i-active' );
    
    //highlight a
    $nav.find( 'a' ).removeClass( 'i-active' );
    $a.addClass( 'i-active' );
    //show tab
    $activeTab.removeClass( 'i-active' );
    setTimeout( function() {
      $activeTab.hide();
      $content.find( '.b-tabs__item[ data-tab="' + $a.data( 'tab' ) + '" ]' ).show().addClass( 'i-active' );
    }, 500 );
  });
});