(function(window, document, $, undefined){
  'use strict';

  window.UpdateFrontPage = function(){
    if ( g_bMarketWindowHidden )
    {
      setTimeout( UpdateFrontPage, g_nMillisPopularRefresh );
      return;
    }

    $J.ajax( {
      url: 'http://steamcommunity.com/market/popular',
      type: 'GET',
      data: {
        country: g_strCountryCode,
        appid: 730,
        language: g_strLanguage,
        currency: typeof( g_rgWalletInfo ) != 'undefined' ? g_rgWalletInfo['wallet_currency'] : 1,
        count: 10
      }
    } ).error( function ( ) {
      setTimeout( UpdateFrontPage, g_nMillisPopularRefresh );
    } ).success( function( data ) {
      if ( data.stop )
      {
        return;
      }

      if ( data.success )
      {
        var nMilliToWaitForRowUpdate = 0;

        data.results_html = data.results_html.filter(function(item, i){
          var ret = item.match('<span class="market_listing_game_name">Counter-Strike: Global Offensive</span>') ? true : false;
          if (ret) {
            data.data.splice(i, 1);
          }
          return ret;
        });

        console.log(data);

        // Build a list of rows to be updated
        var rgElems = [];
        for ( var i = 0; i < data.results_html.length; i++ )
        {
          rgElems.push( i );
        }

        // Update those rows randomly
        rgElems = v_shuffle( rgElems );

        for ( var i = 0; i < rgElems.length; i++ )
        {
          setTimeout( CreatePopularItemClosure(data, rgElems[i]), nMilliToWaitForRowUpdate );
          nMilliToWaitForRowUpdate += ( g_nMillisPopularRefresh / data.results_html.length );
        }

        setTimeout(
          function() {
            g_rgPreviousPopularData = data.data;
            UpdateFrontPage();
          }, nMilliToWaitForRowUpdate
        );
      }
    } );
  }


})(this, this.document, this.$J);
