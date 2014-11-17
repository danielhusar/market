(function(window, document, $J, undefined){
  'use strict';

  $J('body').append('<div id="hold" style="display:none;"></div>');
  var cache = {};

  chrome.runtime.sendMessage('pakdjbidllacainmhhdoejaoeahkjjja', {action: 'getstorage'}, function(response){

    var whitelistRegexp = new RegExp(response.replace(/^\,|\,$/g, '').replace(/\,/gi, '|'), 'gi');

    window.LoadRecentListings = function ( id, type, rows ) {
      if ( g_bBusyLoadingMore )
      {
        return;
      }

      var elShowMore = $(id);
      var elRows = $(rows);

      $J('#sellListingsMore').css('color', '#171717');

      g_bBusyLoadingMore = true;
      new Ajax.Request( 'http://steamcommunity.com/market/recent', {
        method: 'get',
        parameters: {
          country: g_strCountryCode,
          language: g_strLanguage,
          currency: typeof( g_rgWalletInfo ) != 'undefined' ? g_rgWalletInfo['wallet_currency'] : 1
        },
        onSuccess: function( transport ) {
          if ( transport.responseJSON )
          {
            var response = transport.responseJSON;

            if ( response.assets.length != 0 )
            {
              g_rgRecents[type]['time'] = response.last_time;
              g_rgRecents[type]['listing'] = response.last_listing;


              $J('#hold').html(response.results_html);
              $J('#hold .market_listing_row').each(function () {
                var text = $J(this).html();
                var name = $J(this).find('.market_listing_item_name_link').text().trim();
                var price = $J(this).find('.market_listing_price').text().trim();
                var ident = (name + price).replace(/(\r\n|\n|\r)/gm,'').replace(/\s/g, '-');

                if (!text) {
                  $J(this).remove();
                } else {
                  var csgo = text.match('<span class="market_listing_game_name">Counter-Strike: Global Offensive</span>');
                  var whitelist = name.match(whitelistRegexp);

                  if ((!csgo || !whitelist) || cache[ident]) {
                    $J(this).remove();
                  }

                  cache[ident] = true;
                }
              });
              response.results_html = $J('#hold').html();

              elRows.insert( { 'bottom' : response.results_html } );
              MergeWithAssetArray( response.assets );
              MergeWithListingInfoArray( response.listinginfo );
              MergeWithAppDataArray( response.app_data );
              eval( response.hovers );

              $J('#sellListingsMore').css('color', '#939393');
            }
          }
        },
        onComplete: function() {
          g_bBusyLoadingMore = false;

        }
      });
    };

    $J('.market_tab_well_tab ').removeClass('market_tab_well_tab_active');
    $J('.market_tab_well_tab ').addClass('market_tab_well_tab_inactive');
    $J('#tabRecentSellListings').removeClass('market_tab_well_tab_inactive').addClass('market_tab_well_tab_active');
    $J('.market_content_block').hide();
    $J('#sellListingsTable').show();

    LoadRecentListings( 'sellListingsMore', 'sell_new', 'sellListingRows' );
    setTimeout(function () {
      LoadRecentListings( 'sellListingsMore', 'sell_new', 'sellListingRows' );
    }, 200);
    setTimeout(function () {
      LoadRecentListings( 'sellListingsMore', 'sell_new', 'sellListingRows' );
    }, 300);

  });

})(this, this.document, this.$J);
