	  // place our admob ad unit id here
  var admobid = {};
  if( /(android)/i.test(navigator.userAgent) ) {
    admobid = { 
      banner: 'ca-app-pub-5071984715788454/8841042127',
    //  banner: 'ca-app-pub-8680824403507387/3121366566',
      interstitial: 'ca-app-pub-5071984715788454/2790848523'
    };
  } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
    admobid = { // for iOS
      banner: 'ca-app-pub-5071984715788454/8841042127',
      interstitial: 'ca-app-pub-5071984715788454/2790848523'
    };
  } else {
    admobid = { // for Windows Phone
      banner: 'ca-app-pub-5071984715788454/8841042127',
      interstitial: 'ca-app-pub-5071984715788454/2790848523'
    };
  }

  function createSelectedBanner(){
    if(AdMob) AdMob.createBanner({

      adId: admobid.banner,
      overlap: $('#overlap').is(':checked'),
      offsetTopBar: $('#offsetTopBar').is(':checked'),
      adSize: $('#adSize').val(),
      position: $('#adPosition').val(),
    });
  }

  function showBannerAtPosition(){
    if(AdMob) AdMob.showBanner( $('#adPosition').val() );
  }

  function onDeviceReady() {
    if (! AdMob) { 
		//alert( 'admob plugin not ready' ); 
		return; 
	}

    initAd();

    // display a banner at startup
    createSelectedBanner();
  }

  function initAd(){
    AdMob.getAdSettings(function(info){
     // console.log('adId: ' + info.adId + '\n' + 'adTrackingEnabled: ' + info.adTrackingEnabled);
    }, function(){
      console.log('failed to get user ad settings');
    });

    AdMob.setOptions({
      // adSize: 'SMART_BANNER',
      position: AdMob.AD_POSITION.BOTTOM_CENTER,
    //  isTesting: false, // set to true, to receiving test ad for testing purpose
      bgColor: 'black', // color name, or '#RRGGBB'
       autoShow: true , // auto show interstitial ad when loaded, set to false if prepare/show
      // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
    });

    // new events, with variable to differentiate: adNetwork, adType, adEvent
    $(document).on('onAdFailLoad', function(e){
      // when jquery used, it will hijack the event, so we have to get data from original event
      if(typeof e.originalEvent !== 'undefined') e = e.originalEvent;
      var data = e.detail || e.data || e;

   /*  alert('error: ' + data.error +
          ', reason: ' + data.reason +
          ', adNetwork:' + data.adNetwork +
          ', adType:' + data.adType +
          ', adEvent:' + data.adEvent); // adType: 'banner', 'interstitial', etc.
		  */
    });
    $(document).on('onAdLoaded', function(e){
    });
    $(document).on('onAdPresent', function(e){
    });
    $(document).on('onAdLeaveApp', function(e){
    });
    $(document).on('onAdDismiss', function(e){
    });

    $('#btn_create').click(createSelectedBanner);
    $('#btn_remove').click(function(){
      AdMob.removeBanner();
    });

    $('#btn_show').click(showBannerAtPosition);
    $('#btn_hide').click(function(){
      AdMob.hideBanner();
    });

    // test interstitial ad
   /* $('#btn_prepare').click(function(){ */
       /* alert($('#autoshow').is(':checked'));*/
      AdMob.prepareInterstitial({
        adId:admobid.interstitial,
        autoShow: true,
      });
   /* });*/

    $('#btn_showfull').click(function(){
      AdMob.showInterstitial();
    });

    // test case for #256, https://github.com/floatinghotpot/cordova-admob-pro/issues/256
    $(document).on('backbutton', function(){
      if(window.confirm('هل انت متأكد ؟')) navigator.app.exitApp();
    });

    // test case #283, https://github.com/floatinghotpot/cordova-admob-pro/issues/283
    $(document).on('resume', function(){
      AdMob.showInterstitial();
    });
  }

  // test the webview resized properly
  $(window).resize(function(){
    $('#textinfo').html('web view: ' + $(window).width() + " x " + $(window).height());
  });

  $(document).ready(function(){
    // on mobile device, we must wait the 'deviceready' event fired by cordova
    if(/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent)) {
      document.addEventListener('deviceready', onDeviceReady, false);
    } else {
      onDeviceReady();
    }
  });
