( function($) {

  'use strict';
  
  $( function() {
    $( '#filter' ).data({ Filter: new Filter( $( '#filter' )) });
  
    function Filter() {
      var self = this;
      
      init();
      
      function init() {
        initVars();
        initFilter();
        
        //public methods
        self.slideFilter = slideFilter;
        self.setValue = setValue;
      }
      
      function initVars() {
        self.flatsArray = [];
        self.flatsArrayFiltered = [];
        self.$filter = $( '.b-filter' );
        self.$tbody = $( '.b-filter table tbody' );
        self.$reset = $( '#filter-reset' );
        self.$rooms = $( "#filter-rooms" );
        self.$floors = $( "#filter-floors" );
        self.$square = $( "#filter-square" );
        self.$price = $( "#filter-price" );
      }
      
      function initFilter() {        
        getArray();
        setReset();
        setEvents();
        //setModals();
      }
      
      function setValue( obj ) {
        //obj = { rooms: [1,2], floors: [4,6], square: [44,54], price: [10000000,12000000] };
        //rooms
        $( "#filter-rooms" ).slider( "values", 0, obj.rooms[0]);
        $( "#filter-rooms" ).slider( "values", 1, obj.rooms[1]);
        $( "#filter-rooms .ui-slider-handle:eq(0) span" ).text( obj.rooms[0]);
        $( "#filter-rooms .ui-slider-handle:eq(1) span" ).text( obj.rooms[1]);
        //floors
        $( "#filter-floors" ).slider( "values", 0, obj.floors[0]);
        $( "#filter-floors" ).slider( "values", 1, obj.floors[1]);
        $( "#filter-floors .ui-slider-handle:eq(0) span" ).text( obj.floors[0]);
        $( "#filter-floors .ui-slider-handle:eq(1) span" ).text( obj.floors[1]);
        //square
        $( "#filter-square" ).slider( "values", 0, obj.square[0]);
        $( "#filter-square" ).slider( "values", 1, obj.square[1]);
        $( "#filter-square .ui-slider-handle:eq(0) span" ).text( obj.square[0]);
        $( "#filter-square .ui-slider-handle:eq(1) span" ).text( obj.square[1]);
        //price
        $( "#filter-price" ).slider( "values", 0, obj.price[0]);
        $( "#filter-price" ).slider( "values", 1, obj.price[1]);
        $( "#filter-price-value" ).text( obj.price[0] + ' — ' + obj.price[1] + ' руб.' );
        
        slideFilter();
      }
      
      function setReset() {
        self.$reset.click( function() {
          setValue({ rooms:[self.$rooms.slider( "option", "min" ),self.$rooms.slider( "option", "max" )], floors:[self.$floors.slider( "option", "min" ),self.$floors.slider( "option", "max" )], square:[self.$square.slider( "option", "min" ),self.$square.slider( "option", "max" )], price:[self.$price.slider( "option", "min" ),self.$price.slider( "option", "max" )]});
        });        
      }
      
      function setRoomsSlider() {
        
        var minMax = getMinMax( 'FlatRoomsCount' );
        
        self.$rooms.slider({
          range: true,
          min: minMax[0],
          max: minMax[1],
          values: [ minMax[0], minMax[1] ],
          create: function( event, ui ) {
            $( "#filter-rooms .ui-slider-handle:eq(0)" ).append( '<span>' + minMax[0] + '</span>' );
            $( "#filter-rooms .ui-slider-handle:eq(1)" ).append( '<span>' + minMax[1] + '</span>' );
          },
          slide: function( event, ui ) {
            $( "#filter-rooms .ui-slider-handle:eq(0) span" ).text( ui.values[ 0 ]);
            $( "#filter-rooms .ui-slider-handle:eq(1) span" ).text( ui.values[ 1 ]);
          },
          stop: slideFilter
        });
      }
      
      function setFloorsSlider() {
        
        var minMax = getMinMax( 'FloorNumber' );
        
        self.$floors.slider({
          range: true,
          min: minMax[0],
          max: minMax[1],
          values: [ minMax[0], minMax[1] ],
          create: function( event, ui ) {
            $( "#filter-floors .ui-slider-handle:eq(0)" ).append( '<span>' + minMax[0] + '</span>' );
            $( "#filter-floors .ui-slider-handle:eq(1)" ).append( '<span>' + minMax[1] + '</span>' );
          },
          slide: function( event, ui ) {
            $( "#filter-floors .ui-slider-handle:eq(0) span" ).text( ui.values[ 0 ]);
            $( "#filter-floors .ui-slider-handle:eq(1) span" ).text( ui.values[ 1 ]);
          },
          stop: slideFilter
        });
      }
      
      function setSquareSlider() {
        
        var minMax = getMinMax( 'TotalArea' );
        minMax = [ Math.floor( minMax[0] ), Math.ceil( minMax[1] )];
        
        self.$square.slider({
          range: true,
          min: minMax[0],
          max: minMax[1],
          values: [ minMax[0], minMax[1] ],
          create: function( event, ui ) {
            $( "#filter-square .ui-slider-handle:eq(0)" ).append( '<span>' + minMax[0] + '</span>' );
            $( "#filter-square .ui-slider-handle:eq(1)" ).append( '<span>' + minMax[1] + '</span>' );
          },
          slide: function( event, ui ) {
            $( "#filter-square .ui-slider-handle:eq(0) span" ).text( ui.values[ 0 ]);
            $( "#filter-square .ui-slider-handle:eq(1) span" ).text( ui.values[ 1 ]);
          },
          stop: slideFilter
        });
      }
      
      function setPriceSlider() {
        
        var minMax = getMinMax( 'Price' );
        
        self.$price.slider({
          range: true,
          min: minMax[0],
          max: minMax[1],
          step: 100,
          values: [ minMax[0], minMax[1] ],
          create: function( event, ui ) {
            $( '#filter-price-value' ).text( Number( minMax[0] ).toLocaleString('ru-RU') + ' — ' +  Number( minMax[1] ).toLocaleString('ru-RU') + ' руб.' );
          },
          slide: function( event, ui ) {
            $( "#filter-price-value" ).text( Number( ui.values[0] ).toLocaleString('ru-RU') + ' — ' + Number( ui.values[1] ).toLocaleString('ru-RU') + ' руб.' );
          },
          stop: slideFilter
        });
      }
      
      function getMinMax( arrayProp ) {
        var min = 1e15;
        var max = 0;
        
        self.flatsArray.forEach( function( elem ) {
          if ( 1*elem[ arrayProp ] && 1*elem[ arrayProp ] > max ) {
            max = 1*elem[ arrayProp ];
          }
          if ( 1*elem[ arrayProp ] && 1*elem[ arrayProp ] < min ) {
            min = 1*elem[ arrayProp ];
          }
        });
        
        if ( min === 1e15 && max === 0 ) {//when the prop is a string
          min = 0;
          max = 10;
        }
        
        return [ min, max ];
      }
      
      function getArray() {
        $.ajax({
          url: self.$tbody.data( 'json' ),
          type: self.$tbody.data( 'method' ),
          dataType: "json",
          success: function( data ) {
            self.flatsArray = data;
            setRoomsSlider();
            setFloorsSlider();
            setSquareSlider();
            setPriceSlider();
            setTimeout( function() {slideFilter();}, 100);
          },
          error: function() {}
        });
      }
      
      function slideFilter() {
        self.flatsArrayFiltered = self.flatsArray.filter( function( element ) {
          /*self.flatsArray.forEach( function( elem ) {
            if ( typeof elem.FlatRoomsCount === 'string' ) {
              elem.FlatRoomsCount = 1;
            }
          });*/
          var flatRoomsCount = element.FlatRoomsCount;
          if ( typeof flatRoomsCount === 'string' ) {
            flatRoomsCount = 1;
          }
          if ( (flatRoomsCount >= self.$rooms.slider( "values", 0 ) && flatRoomsCount <= self.$rooms.slider( "values", 1 )) &&
               (element.FloorNumber >= self.$floors.slider( "values", 0 ) && element.FloorNumber <= self.$floors.slider( "values", 1 )) &&
               (element.TotalArea >= self.$square.slider( "values", 0 ) && element.TotalArea <= self.$square.slider( "values", 1 )) &&
               (element.Price >= self.$price.slider( "values", 0 ) && element.Price <= self.$price.slider( "values", 1 )) ) {
            return true;
          }
        });
        
        renderResult();
      }
      
      function renderResult() {
        var html = "";
        
        self.flatsArrayFiltered.forEach( function( element ) {
          var cls = '';
          if ( element.Action ) {
            cls = " i-action";
          }
          html += "<tr class=\"modal-trigger" + cls + "\" data-url=\"" + element.URL + "\" ><td>" + element.FloorNumber + " этаж<br></td><td>" + element.TotalArea + "м<sup>2</sup></td><td>" + element.FlatRoomsCount + "</td><td><b>" + element.PriceFormat + " руб.</b></td><td><a href=\"" + self.$tbody.data( 'orderlink' ) + element.ExternalId + "\" class=\"btn\">Оставить заявку</a></td></tr>";
        });
        
        self.$tbody.html( html );
      }
      
      function setEvents() {
        self.$filter.delegate( 'tbody tr', 'click', function() {
          var $tr = $( this );
          window.location = $tr.data( 'url' );          
        });
      }
    
      function setModals() {
        var instance = M.Modal.init( document.querySelector( '#modal1' ));
        //var instance = M.Modal.getInstance(elem);
        
        self.$filter.delegate( 'tbody tr', 'click', function() {
        
          var $tr = $( this );
        
          $( '#modal1 .b-flat-modal__img' ).html( '<img src="' + $tr.data( 'layoutphoto' ) + '" alt="">' );
          
          $( '#modal1 .b-flat-modal__text' ).html( '<b>Количество комнат:&nbsp;</b>' + $tr.data( 'flatroomscount' ) +'<br><b>Этаж:&nbsp;</b>' + $tr.data( 'floornumber' ) + '<br><b>Площадь:&nbsp;</b>' + $tr.data( 'totalarea' ) + 'м<sup>2</sup><div class="b-flat-modal__price">' + $tr.data( 'price' ) + ' руб.</div><div class="b-flat-modal__btn"><a href="' + $( '.b-filter table tbody' ).data( 'orderlink' ) + $tr.data( 'externalid' ) + '" class="btn btn-large">Отправить заявку</a></div><div><a href="/pdf/?id=' + $tr.data( 'externalid' ) + '" class="b-doc">Скачать pdf</a></div><div class="b-flat-modal__close"><a href="#!" class="modal-close">Вернуться к списку</a></div>' );
          
          instance.open();
          
        });
      }
      
      self.$filter.delegate( '.btn', 'click', function(e) {
        e.stopPropagation();
      });
      
    }
    
    $( '#filter-btn' ).click( function(e) {
      e.preventDefault();
      
      if ( $( '#filter-btn span:visible' ).is( '.i-show' )) {
        $( '#filter' ).slideDown();
        $( '#filter-btn span' ).show();
        $( '#filter-btn span.i-show' ).hide();
      } else {
        $( '#filter' ).slideUp();
        $( '#filter-btn span' ).hide();
        $( '#filter-btn span.i-show' ).show();
      }
    });
    
    $( '.b-filter .col.xl9' ).niceScroll();
    
    /*if ( window.BX ) {
      BX.addCustomEvent( "onFrameDataReceived", function () {});
    }*/
  });

}( jQuery ));