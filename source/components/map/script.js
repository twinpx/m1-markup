( function($) {

  'use strict';
  
  $( function() {
    
    ymaps.ready(function () {
      var myMap = new ymaps.Map( 'yMap', {
        center: [ 55.751574, 37.573856 ],
        zoom: 12,
        controls: [ 'geolocationControl', 'zoomControl' ]
      }, {
        searchControlProvider: 'yandex#search'
      });
      
      myMap.behaviors.disable( 'scrollZoom' );
      
      //cluster
      var preset = 'islands#blackClusterIcons';
      if ( window.yMapPlacemarksIcons ) {
        preset = 'islands#' + yMapPlacemarksIcons;
      }
      var clusterer = new ymaps.Clusterer({
        preset: preset,
        //clusterNumbers: [10],
        groupByCoordinates: false,
      });
      
      //on load
      $( '.b-map__nav-item.i-active' ).each( function() {
        
        var tab = $( this ).data( 'tab' );
        
        if ( tab ) {
          yMapPlacemarks[ tab ].forEach( function( elem ) {
            clusterer.add( new ymaps.Placemark( elem.coords, {}, {
              iconLayout: 'default#image',
              iconImageHref: elem.icon,
              iconImageSize: [32, 32],
              iconImageOffset: [-16, -16]
            }));
          });
        }
      });
      
      myMap.geoObjects.add( clusterer );
      
      //on click
      $( '.b-map__nav-item' ).click( function() {
        
        var $item = $( this );
        var $map = $( this ).closest( '.b-map' );
        
        if ( $map.data( 'singletab' )) {
          $map.find( '.b-map__nav-item' ).removeClass( 'i-active' );
        }
        $item.toggleClass( 'i-active' );
        
        clusterer.removeAll();
        
        $( '.b-map__nav-item.i-active' ).each( function() {
          
          var tab = $( this ).data( 'tab' );
          
          if ( tab ) {
            yMapPlacemarks[ tab ].forEach( function( elem ) {
              clusterer.add( new ymaps.Placemark( elem.coords, {}, {
                iconLayout: 'default#image',
                iconImageHref: elem.icon,
                iconImageSize: [32, 32],
                iconImageOffset: [-16, -16]
              }));
            });
          }
        });
        
        //myMap.geoObjects.add( clusterer );
        
      });
      
    });
  
    /*if ( window.BX ) {
      BX.addCustomEvent( "onFrameDataReceived", function () {});
    }*/
  });

}( jQuery ));