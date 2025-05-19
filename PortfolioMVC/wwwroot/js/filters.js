	 angApp.config(['$httpProvider', function($httpProvider) {
	  $httpProvider.interceptors.push(function($q) {
		return {
		 'request': function(config) {
			 let orig =  config.transformRequest;
			 let dateFn = function(date){
				const offsetMinutes = date.getTimezoneOffset();
				const localDate = new Date(date.getTime() - offsetMinutes * 60000);
				const localISOString = localDate.toISOString().slice(0, 19);
				return localISOString;
			 }
			 let rt = sessionStorage.getItem("Relation");
			 if(rt)
			 {
				config.headers["Relation-Type"] = rt;
			 }
			 config.transformRequest = function(obj, headersGetter)
			 {
				 let content = headersGetter("content-type");
				 if(obj && config.fileRequest)
				 {
					let formData = new FormData();
					angular.forEach(obj, function (value, key) {
						if(value instanceof Date)
						{
							//formData.append(key, new Date(convertLocalDateToUtcDateV2(value)));
							formData.append(key, dateFn(value));
						}
						else{
							formData.append(key, value);
						}
					});
					return formData;
				 }

				 let cloned;
				 if(obj && is_object(obj))
				 {
					cloned = obj.Copy();

					for(let o in cloned)
					{
						let objv = cloned[o]
						if(objv instanceof Date)
						{
							//cloned[o] = new Date(convertLocalDateToUtcDateV2(objv))
							cloned[o] = dateFn(objv); //.toISOString();
							
						}
					}			
				 }
		
				let res = orig[0](cloned);
				return res;
			 }
			 return config;
		  }
		};
	  });
	}])	

	//angApp.config(['$mdDateLocaleProvider', function($mdDateLocaleProvider) {
	//	$mdDateLocaleProvider.months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
	//	$mdDateLocaleProvider.shortMonths = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
	//	$mdDateLocaleProvider.days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
	//	$mdDateLocaleProvider.shortDays = ['Paz', 'Pzt', 'Sa', 'Çar', 'Per', 'Cum', 'Cmt'];
	//	$mdDateLocaleProvider.firstDayOfWeek = 1;
	//}])
	
	
	
	 angApp.config(['$provide', function($provide) {
	  $provide.decorator('dateFilter', ['$delegate', function($delegate) {
		var srcFilter = $delegate;
		var extendsFilter = function(input, v) 
		{
			let dt = arguments[0];
			let presets = {
				"callCenter": "dd.MM.yyyy<br>HH:mm",
				"date": "dd.MM.yyyy",
				"dmy hm": "dd.MM.yyyy HH:mm",
				"hm": "HH:mm",
				"hms": "HH:mm:ss",
				"iade": "dd.MM.yyyy HH:mm",
				"std": "dd.MM.yyyy HH:mm:ss",
				"dmy": "dd.MM.yyyy",
			}
			if(dt && dt.toDate)
			{
				arguments[0] = arguments[0].toDate();
			}
			if(v && presets[v])
				arguments[1] = presets[v];
			let res = srcFilter.apply(this, arguments);

			return arguments[2] ? res + arguments[2] : res;
		}

		return extendsFilter;
	  }])
	}])
	
	
	//angApp.config(['uiMask.ConfigProvider', function(uiMaskConfigProvider) {
	//		uiMaskConfigProvider.defineAlias('hm', "99:99");
	//		uiMaskConfigProvider.defineAlias('dmy hm', "99.99.9999 99:99");
	//		uiMaskConfigProvider.defineAlias('dmy', "99.99.9999");
	//		uiMaskConfigProvider.defineAlias('date', "99.99.9999");


	//	}
	//])
	
	angApp.filter('numbermarket', function($filter) {
		let numberFilter = $filter('number');
		return function(input, v) {
			if(v == 'USDT')
				v = 0;
			else if(v == 'BTC')
				v = undefined;
			return numberFilter(input, v);
		};
	});

	angApp.filter('date2', function($filter) {
		let angularDateFilter = $filter('date');
		let presets = {
			"default": "dd.MM.yyyy HH:mm:ss",
			"detection": "dd MMM yyyy HH:mm",
			"ai": "dd MMM HH:mm"
		}
		let defaultV = presets.default;
		return function(input, v) {
			let p = presets[v];
			if(!p)
				p = defaultV;
			return angularDateFilter(input, p);
		};
	});
	angApp.filter('unsafe', function ($sce) { return $sce.trustAsHtml; });
	angApp.filter("sanitize", ['$sce', '$sanitize', function ($sce, $sanitize) {
        return function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }
    }])
	angApp.filter('exchgUrl', function () {
		let curExchg;
        return function (val) {
			if(!curExchg || curExchg.Name != val)
				curExchg = ExchgUtils.GetExchg(val) 
            return curExchg.UrlName;
        }
    });
	angApp.filter('number2', function() {
		return function(input, amount) {
			if(!amount)
				amount = 8;
			else if(amount == -1)
				amount = undefined
			if(!input)
			{
				 return "";
			}
		  return toFixed2(input, amount);
		};
	});
	angApp.filter('symbol', function() {
		return function(input, itemType) {
			if(!input)
			{
				return input;
			}
			if(itemType == 'Asset' || itemType == 'Short' || itemType == 'ShortName')
			{
				return SymbolUtils.AssetName(input);
			}
			else if(itemType == 'Market')
			{
				return SymbolUtils.MarketName(input);
			}
			return input;
		};
	});
	angApp.filter('abs', function () {
        return function (val) {
            return Math.abs(val);
        }
    });
	angApp.filter('filterPeriod', function() {
		return function(input, itemType) {
			return ExchgUtils.FilterPeriod(input, itemType);
		};
	});

	angApp.filter('humanize', function() {
			humanizeDuration.languages.shortTr = {
            y: () => "y",
            mo: () => "ay",
            w: () => "h",
            d: () => "g",
            h: () => "sa",
            m: () => "dk",
            s: () => "sn",
            ms: () => "ms",
        }
		return function(input, itemType) {

			return humanizeDuration(input * 1000, {language: "shortTr", delimiter: ' ', maxDecimalPoints: 0, spacer: '', largest: 2});
		};
	});
	angApp.filter('propsFilter', function() {
	  return function(items, props) {
		var out = [];

		if (angular.isArray(items)) {
		  var keys = Object.keys(props);

		  items.forEach(function(item) {
			var itemMatches = false;

			for (var i = 0; i < keys.length; i++) {
			  var prop = keys[i];
			  var text = props[prop].toLowerCase();
			  if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
				itemMatches = true;
				break;
			  }
			}

			if (itemMatches) {
			  out.push(item);
			}
		  });
		} else {
		  // Let the output be the input untouched
		  out = items;
		}

		return out;
	  };
	});
	
	
