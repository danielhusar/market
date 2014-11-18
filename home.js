(function (window, document, $J, undefined) {
  'use strict';

  $J('body').append('<div id="hold" style="display:none;"></div>');
  var cache = {};

  //get the options
  chrome.runtime.sendMessage('pakdjbidllacainmhhdoejaoeahkjjja', {action: 'getstorage'}, init);
  chrome.runtime.sendMessage('dcfkokhhoohiomnglonbeofjplakiilm', {action: 'getstorage'}, init);


  //main function that is executed after we get our options
  function init (response) {

    var whitelistRegexp = new RegExp(response.weapons.replace(/^\,|\,$/g, '').replace(/\,/gi, '|'), 'gi');

    window.LoadRecentListings = function ( id, type, rows ) {

      $J('#sellListingsMore').css('color', '#171717');
      if (g_bBusyLoadingMore) {
        return;
      }

      var elShowMore = $(id);
      var elRows = $(rows);

      g_bBusyLoadingMore = true;
      new Ajax.Request( 'http://steamcommunity.com/market/recent', {
        method: 'get',
        parameters: {
          country: g_strCountryCode,
          language: g_strLanguage,
          currency: typeof( g_rgWalletInfo ) != 'undefined' ? g_rgWalletInfo['wallet_currency'] : 1
        },
        onSuccess: function( transport ) {
          if ( transport.responseJSON ) {
            var response = transport.responseJSON;

            if ( response.assets.length != 0 ) {
              g_rgRecents[type]['time'] = response.last_time;
              g_rgRecents[type]['listing'] = response.last_listing;


              // start from custom modifications and filtering
              $J('#hold').html(response.results_html);
              $J('#hold .market_listing_row').each(function () {
                var text = $J(this).html();
                var name = $J(this).find('.market_listing_item_name_link').text().trim();
                var price = $J(this).find('.market_listing_price').text().trim();
                var ID = (name + price).replace(/(\r\n|\n|\r)/gm,'').replace(/\s/g, '-');

                if (!text) {
                  $J(this).remove();
                } else {
                  var csgo = text.match('<span class="market_listing_game_name">Counter-Strike: Global Offensive</span>');
                  var whitelist = name.match(whitelistRegexp);

                  if ((!csgo || !whitelist) || cache[ID]) {
                    $J(this).remove();
                  }

                  cache[ID] = true;
                }
              });
              response.results_html = $J('#hold').html();
              //end of custom modifications

              elRows.insert( { 'bottom' : response.results_html } );
              MergeWithAssetArray( response.assets );
              MergeWithListingInfoArray( response.listinginfo );
              MergeWithAppDataArray( response.app_data );
              eval( response.hovers );
            }
          }
        },
        onComplete: function () {
          g_bBusyLoadingMore = false;
          $J('#sellListingsMore').css('color', '#939393');
        }
      });
    };

    $J('.market_tab_well_tab ').removeClass('market_tab_well_tab_active');
    $J('.market_tab_well_tab ').addClass('market_tab_well_tab_inactive');
    $J('#tabRecentSellListings').removeClass('market_tab_well_tab_inactive').addClass('market_tab_well_tab_active');
    $J('.market_content_block').hide();
    $J('#sellListingsTable').show();

    window.LoadRecentListings( 'sellListingsMore', 'sell_new', 'sellListingRows' );
    window.setInterval(function () {
      window.LoadRecentListings( 'sellListingsMore', 'sell_new', 'sellListingRows' );
    }, response.rate);

  }

})(this, this.document, this.$J);
