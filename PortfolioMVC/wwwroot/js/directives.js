	angApp.directive('convertToNumber', function() {
	  return {
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel) {
		  ngModel.$parsers.push(function(val) {
			return val != null ? parseInt(val, 10) : null;
		  });
		  ngModel.$formatters.push(function(val) {
			return val != null ? '' + val : null;
		  });
		}
	  };
	});
	
	angApp.directive('toNumber', function() {
	  return {
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel) {
		  ngModel.$parsers.push(function(val) {
			return val != null ? parseInt(val, 10) : null;
		  });
		  ngModel.$formatters.push(function(val) {
			return val != null ? '' + val : null;
		  });
		}
	  };
	});
	
	angApp.directive('type', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
					if(attributes.type == "submit")
					{
						$(element).on("click", function() {
							$(element).closest("form").submit()
						})
					}
                   // scope.$watch(attributes.type, function (value) {
                       
                    //});
                }
            };
        })
	angApp.directive('ngVisible', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    scope.$watch(attributes.ngVisible, function (value) {
                        element.css('visibility', value ? 'visible' : 'hidden');
                    });
                }
            };
        })
	angApp.directive('ngBindHtmlUnsafe', function ($compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
					let doChange = function(value)
					{
						if($(element).is("[line-br]") && value)
						{
							value = value.replace(/\\r\\n|\\r|\\n/g, '<br />');
						}
						$(element).html(value)
						if($(element).is("[compile]"))
						{
							AngularUtils.CompileElement($(element).contents(), {
								scope: scope,
								compile: $compile
							})
						}
					}
					doChange(scope.$eval(attributes.ngBindHtmlUnsafe))
                    scope.$watch(attributes.ngBindHtmlUnsafe, function (value) {
						//doChange(value);

                    });
                }
            };
        })
	angApp.directive('headerTitle', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
					let el = element.closest('table').find('th').eq(element.index());
                    if(el && !el.data("_htApplied"))
					{
						el.data("_htApplied", "1");
						el.attr("title", attributes.headerTitle);

					}
                }
            };
	})
	angApp.directive('ngEnter', function () {
		return function (scope, element, attrs) {
			if(attrs.ngEnter)
			{
				element.bind("keydown keypress", function (event) {
					if (event.which === 13) {
						scope.$apply(function () {
							scope.$eval(attrs.ngEnter);
						});
						event.preventDefault();
					}
				});
			}

		};
	})
	angApp.directive('spinner', function ($compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
					if($(element).hasAttr("spinner"))
					{
						attributes["spinner"] = "true";
					}
                    scope.$watch(attributes.spinner, function (value) {
						/*
						<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
						
						*/
						let spinElement =  $(element);
						spinElement.addClass("spinner-border");
						//$compile(spinElement)(scope);
                    });
                }
            };
        })	
		
		angApp.directive('hoverPopup', function ($compile) {
			return {
				restrict: 'A',
				link: function (scope, element, attributes) {	
					//Daha önceden ayarlama yapıldısya ataması tekrar yapılmayacak.
					if($(element).data("hoverPopupSet"))
						return;
					//exchg, symbol ve period bunları daima izlemeye alıyoruz değiştikleri anda ilgili chartı tekrar yüklüyoruz.
					$(element).data("hoverPopupSet", true);
					let hoverId = scope.$eval(attributes.hoverPopup);
					let hoverProps = {
						ElementId: hoverId,
						Allowed: function()
						{
							if(attributes.hoverPopupAllowed === undefined)
								return true;
							let r = scope.$eval(attributes.hoverPopupAllowed);
							return r;
						},
						OnShown: function(el)
						{
							if(attributes.hoverPopupOnshown)
							{
								scope.$eval(attributes.hoverPopupOnshown);
							}
						}
					};
					scope.$watchGroup([attributes.hoverPopup, attributes.hoverPopupMinWidth], function(newValues, oldValues, scope) {
						hoverProps.ElementId = newValues[0];
						hoverProps.MinWidth = newValues[1];
					});
					HoverPopupUtils.Apply(element, hoverProps);
				}
			};
			}
		)
		
		angApp.directive('el', function ($compile) {
			return {
				restrict: 'A',
				link: function (scope, element, attributes) {	
					if(attributes.elS == "false")
						return;
					let attrName = attributes.el == "true" ? "$element" :  attributes.el;
					scope[attrName] = element;
				}
			};
			}
		)
		
		angApp.directive('elS', function ($compile) {
			return {
				restrict: 'A',
				scope: true,
				link: function (scope, element, attributes) {	
					if(!attributes.elS || attributes.elS == "false")
						return;
					let attrName = attributes.elS == "true" ? "$element" :  attributes.elS;
					scope[attrName] = element;
				}
			};
			}
		)

		
		angApp.directive('select', function ($compile, $timeout, $templateCache) {
            return {
				require: '?ngModel',
                restrict: 'E',
                link: function (scope, element, attributes, ngModelCtrl){
					let extObj;
					let sel2Opt = {};
					if($(element).hasAttr("select2"))
					{
						attributes["select2"] = "true";
					}
					if(attributes.select2)
					{
						if(!extObj) extObj = {};
						if(!extObj.style)
						{
							extObj.style= "min-width: 200px";
						}
					}
					if(extObj)
					{
						attributes.Include(extObj);
					}
					let closeOnSelection = attributes.closeOnSelect ? scope.$eval(attributes.closeOnSelect) : true;
					let tResultAttr = attributes.templateResult ? scope.$eval(attributes.templateResult) : undefined;
					let tSelectionAttr = attributes.templateSelection ? scope.$eval(attributes.templateSelection) : undefined;
					let tResult = tResultAttr ? $templateCache.get(tResultAttr) : Select2Utils.ResolveTemplate(scope, attributes.templateResult);
					let tSelection = tSelectionAttr ? $templateCache.get(tSelectionAttr) :  Select2Utils.ResolveTemplate(scope, attributes.templateSelection);
					let stateFunc = function(state, isResult = false)
					{
						//state._IsResult = isResult;
						
						let fromItem = state.element && $(state.element).data("_fromItem");
						if((tResultAttr && isResult) || (tSelectionAttr && !isResult))
						{
							let tElem = $("<div>").html(isResult ? tResult : tSelection);
							let tempScope = scope.$new();
							tempScope.state = state;
							tempScope.$isResult = isResult;
							tempScope.$fromItem = fromItem;
							let compiled = $compile(tElem)(tempScope);
							scope.$$digest();
							return compiled;
						}
						let titem = isResult ? tResult : tSelection;
						if(is_callable(titem))
						{
							return titem(state, {attributes: attributes, scope: scope});
						}
						else if(is_string(titem))
						{
							
						}
						return state.text;
					}
					if(attributes.select2)
					{
						let ajaxDataParam;
						if(attributes.ajax)
						{
							ajaxDataParam = {
								url: '/Grup/GrupAra',
								data: function (params) {
								  var query = {
									term: params.term
								  }
								  return query;
								},
								processResults: function(data) {
									return {
										results: data.map(d => ({id: d.id, text: d.bilgi}))
									}
								}
							}
						}
						let parentModal = $(element).closest(".modal-dialog");

						let isMultiple = $(element).hasAttr("multiple");
						let theme = !isMultiple ? "bootstrap" : "default";
						let hideSelectedAndMatched = function(params, item) {
						  let currentSelections = $(element).select2('data');
						  if (currentSelections.find(function(selection) {return selection.id === item.id})) {
							return null;
						  }
						  if (!params.term || params.term.trim() === '' 
							  || item.text.indexOf(params.term) > -1) {
							return item;
						  }
						  return null;
						}

						let item = $(element).select2(
							{
								 language: "tr",
								 templateResult: tResult ? function(state) { return stateFunc(state, true); } : undefined,
								 templateSelection: tSelection ? function(state) { return stateFunc(state, false); } : undefined,
								 theme: "bootstrap",
								 dropdownAutoWidth: true,
								 placeholder: attributes.placeholder,
								 dropdownParent: parentModal.length > 0 ? parentModal : undefined,
								 closeOnSelect: closeOnSelection,
								 ajax: ajaxDataParam,
								 //containerCssClass: ':all:',
								 //matcher: hideSelectedAndMatched,
								 ...sel2Opt
							 }
						 );
						 
						
						let lastTrigger;
						scope.$watch(attributes.ngModel, function(value)
						{
							if(!attributes.ngModel)
							{
								return;
							}
							//Arka arkaya çağrı döngünlerini engellemek amacıyla 100ms altındaki istekler de change event' i tetiklenmeyecek.
							if(lastTrigger && (Date.now() - lastTrigger) < 100)
							{
								return;
							}
							lastTrigger = Date.now();
							$timeout(function() {
								item.val(value).trigger('change');
							}, 50);
							
						});

						 item.on("select2:select", function (e) {
							let v = e && e.currentTarget && $(e.currentTarget).val();
							if(attributes.ngSelect2Select)
							{
								scope.$eval(attributes.ngSelect2Select, {$event: e, $value: v});
							}
							if(attributes.ngModel)
							{
								ngModelCtrl.$setViewValue(v)
								ngModelCtrl.$render();
							}		 
							scope.$digest();
														 
							 
						 });
						 item.on("select2:unselect", function(e) {
							let v = e && e.currentTarget && $(e.currentTarget).val();
							if(attributes.ngSelect2Unselect)
							{
								scope.$eval(attributes.ngSelect2Unselect, {$event: e, $value: v});
							}
							if(attributes.ngModel)
							{
								ngModelCtrl.$setViewValue(v)
								ngModelCtrl.$render();
							}	
							scope.$digest();
						 });
					     let dropElement = $(item).data("select2").$dropdown;
						 let commonStyle = $(item).attr("common-style");
						 let commonClass = $(item).attr("common-class");
						 let containerStyle = $(item).attr("container-style");
						 let dropdownStyle = $(item).attr("dropdown-style");
						 let containerClass = $(item).attr("container-class");

						 let selectionStyle = $(item).attr("selection-style");
						 let selectionClass = $(item).attr("selection-class");
						 $(".select2-dropdown", dropElement).appendStyle(commonStyle);
						 $(dropElement).appendStyle(dropdownStyle);
						 $(".select2-selection", $(item).parent()).appendStyle(commonStyle);
						 $(".select2-selection", $(item).parent()).appendStyle(selectionStyle);
						 

						 
						 if(commonClass)
						 {
							$(".select2-dropdown", dropElement).addClass(commonClass);
							$(".select2-selection", $(item).parent()).addClass(commonClass);
						 }
						 if(selectionClass)
						 {
							$(".select2-selection", $(item).parent()).appendStyle(selectionClass);
						 }
						 
						 						
						 $(".select2-container", $(item).parent()).appendStyle(attributes.style);					
						 $(".select2-container", $(item).parent()).appendStyle(containerStyle);					
						 $(".select2-container", $(item).parent()).addClass(attributes.class);
						 $(".select2-container", $(item).parent()).addClass(containerClass);
						 if(!isMultiple)
						 {
								$(".select2-selection", $(item).parent()).css({"display": "flex", 
									"align-items": "center"});	 
						 }

					}
					
					scope.$watch(attributes.ngFrom, function(value){
						if(!value)
						{
							return;
						}
						let idName = attributes.idName ? attributes.idName : "id";
						let textName = attributes.textName ? attributes.textName : "text";
						let textNameOr = attributes.textNameOr ? attributes.textNameOr : "text";
						let ngFilter = scope.$eval(attributes.ngFilter);
						let allValue = attributes.showAllValue ? scope.$eval(attributes.showAllValue) : "0"
						let emptyValue = attributes.showEmptyValue ? scope.$eval(attributes.showEmptyValue) : ""
						let emptyName = attributes.showEmptyText ? scope.$eval(attributes.showEmptyText) : ""

						element.empty();
						if(attributes.showEmpty)
						{
							let opt = $('<option />').
							attr("value", emptyValue).
							html(emptyName).
							appendTo(element);

							$compile(opt)(scope);
						}
						let allOpt;
						if(attributes.showAll && attributes.showAll !== "false")
						{
							allOpt = $('<option>').
							attr("value", allValue).
							html("Tümü").
							appendTo(element);
							$compile(allOpt)(scope);
						}
						scope.$watch(attributes.showAll, function(nv, ov) {
							if(nv === ov)
							{
								return;
							}
							if(!allOpt)
								return;
							if(nv === false)
							{
								$(allOpt).attr("disabled", "disabled");
							}
							else{
								$(allOpt).removeAttr("disabled");
							}

						});
						// if(attributes.showListedinfutures)
						// {
							// let opt = $('<option>').
							// attr("value", "Listed In Futures").
							// html("Listed In Futures").
							// appendTo(element);
							// $compile(opt)(scope);
						// }
						
						let filterSec = 0;
						let checkEq = 0;
						let checkSec = 0;
						let itemType = attributes.filterPeriod;
						if(is_string(itemType))
						{
								if(itemType.startsWith(">="))
								{
									checkEq = 2;
									itemType = itemType.replace(">=", "");
									checkSec = ExchgUtils.PeriodToSeconds(itemType);
								}
								else if(itemType.startsWith(">"))
								{
									checkEq = 1;
									itemType = itemType.replace(">", "");
									checkSec = ExchgUtils.PeriodToSeconds(itemType);
								}
						}
						
						for(let i = 0; i < value.length; i++)
						{
							let item = value[i];
							let state = {};
							if(is_string(item))
							{
								state.id = item;
								state.text = item;
							}
							else if(is_object(item))
							{
								state.id =  item[idName];
								state.text =  item[textName] || item[textNameOr];
							}
							else if(is_array(item))
							{
								state.id =  item[idName];
								state.text =  item[textName] || item[textNameOr];
							}
							if(ngFilter)
							{
								if(is_string(ngFilter))
								{
									if(ngFilter.ValidForObject())
									{
										if(ngFilter != state.id)
										{
											continue;
										}
									}
									else{
										let r = scope.$eval(ngFilter, {$state: state, $item: item})
										if(r === false)
											continue;
									}

								}
								else if(is_array(ngFilter))
								{
									if(!ngFilter.Contains(state.id))
										continue;
								}
									
							}
							if(checkEq != 0)
							{
								let curSec = ExchgUtils.PeriodToSeconds(state.id);
								if((checkEq == 1 && curSec > checkSec) || (checkEq == 2 && curSec >= checkSec))
								{
									//out.push(cur);
								}
								else{
									continue;
								}
							}
							let opt = $("<option />").
							attr("value", state.id).
							html(state.text).
							data("_fromItem", item).
							appendTo(element);
							$compile(opt)(scope);
						}
					});
                }
            };
        })
	


.directive('dateRange', function ($compile, $timeout) {
    return {
		require: '?ngModel',
        restrict: 'A',
        link: function (scope, element, attributes, ngModelCtrl) {
			let dValue = ngModelCtrl && ngModelCtrl.$viewValue;
			if(!dValue)
				dValue = {};
			let datePicker;
			const invalidName = "Invalid date";
			let prepare = function()
			{
				let startModel = attributes.startModel;
				let endModel = attributes.endModel;
				if(startModel)
					dValue.startDate = scope.$eval(startModel);
				if(endModel)
					dValue.endDate = scope.$eval(endModel);
				let single = attributes.single && scope.$eval(attributes.single);
				let timePicker = attributes.timePicker && scope.$eval(attributes.timePicker);
				let format = attributes.format && scope.$eval(attributes.format);
				let setPickerInputValue =  function(elem, picker)
				{
					let fmt = picker.locale.format;
					let vStart = picker.startDate ? picker.startDate.format(fmt) : '';
					if(vStart == invalidName)
					{
						vStart = "";
					}
					let vEnd = picker.endDate ? picker.endDate.format(fmt) : '';
					if(vEnd == invalidName)
					{
						vEnd = "";
					}
					let vFormat = (single || vStart == vEnd) ? vStart :  vStart + ' - ' + vEnd;
					$(elem).val(vFormat);

				}
				let parentModal = $(element)
					.closest(".date-picker-parent");
				if(parentModal.length == 0)
					parentModal = $(element)
					.closest(".modal-dialog")
				if(parentModal.length == 0)
					parentModal = $(document.body);
				
				let applyValues = function(picker)
				{
					if(startModel)
						scope.$eval(attributes.startModel + ' = _temp_;', {_temp_: picker.startDate.toDate()})
					if(endModel)
						scope.$eval(attributes.endModel + ' = _temp_;', {_temp_: picker.endDate.toDate()})
					if(attributes.ngModel)
					{
						let sDate = picker.startDate.toDate();
						let eDate = picker.endDate.toDate();
						ngModelCtrl.$setViewValue({
							startDate: sDate == invalidName ? null : sDate,
							endDate: eDate == invalidName ? null : eDate
						})

					}
				}
				datePicker = $(element).daterangepicker({
					parentEl: parentModal,
					startDate: dValue.startDate,
					endDate: dValue.endDate,
					singleDatePicker: single,
					ranges: single ? undefined : {
						'Bugün': [moment(), moment()],
						'Dün': [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
						'1. 10 Gün': [moment().startOf('month'), moment().startOf('month').date(10)],
						'2. 10 Gün': [moment().startOf('month').date(11), moment().startOf('month').date(20)],
						'Son 10 Gün': [moment().startOf('month').date(21), moment().endOf('month')],
						//'Bu Hafta': [moment().startOf('week'), moment().endOf('week')],
						//'Geçen Hafta': [moment().subtract(1, 'weeks').startOf('week'), moment().subtract(1, 'weeks').endOf('week')],
						'Bu Ay': [moment().startOf('month'), moment().endOf('month')],
						'Geçen Ay': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
					},
					locale: {
						applyLabel: 'Uygula',
						cancelLabel: 'İptal',  
						customRangeLabel: 'Aralık Seç',
						format: format ? format : undefined,
						//daysOfWeek: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'], 
						//monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
						firstDay: 1 
					},
					timePicker: timePicker,
					timePicker24Hour: true,
					autoUpdateInput: false
				}
				,
				function(start, end, section)
				{
					/*applyValues({
						startDate: start,
						endDate: end
					});*/
				})
				.on("apply.daterangepicker", function(ev, picker){
					let fmt = picker.locale.format;
					applyValues(picker);
					setPickerInputValue(this, picker)
					
				}).data('daterangepicker');
				//Initial
				setPickerInputValue($(element), datePicker);
				

				let watched = [attributes.ngModel, attributes.startModel, attributes.endModel];
				
				scope.$watchGroup(watched, function(newValues, oldValues, scope) {
					let newStartDate;
					let newEndDate;
					let changed = false;
					let setStart = false;
					let setEnd = false;
					for(let i = 0; i < newValues.length; i++)
					{
						let nv = newValues[i];
						let ov = oldValues[i];
						if(nv != ov)
						{
							if(!changed)
								changed = true;
							//Model
							if(i == 0 && nv)
							{
								newStartDate = nv.startDate;
								newEndDate = nv.endDate;
								setStart = true;
								setEnd = true;
							}
							//Start
							else if(i == 1){
								setStart = true;
								newStartDate = nv;
							}
							else if(i == 2)
							{
								setEnd = true;
								newEndDate = nv;
							}
						}
					}
					if(changed)
					{

						if(setStart)
							datePicker.setStartDate(newStartDate);
						if(setEnd)
							datePicker.setEndDate(newEndDate);
						setPickerInputValue(element, datePicker);
					}
				});
				
			}

			$timeout(prepare);

        }
    };
})

.directive('select2', function ($compile) {
    return {
        restrict: 'E',
        link: function (scope, element, attributes) {
			let newSelect = $("<select />");
			let select2ItemTemplate =  undefined
			let select2Item = $("template-result:first", element);
			if(select2Item.first())
			{
				select2ItemTemplate = select2Item.first().html();
			}
            //var e =$compile(html)(scope);
            let newElement = element.replaceWith(newSelect);
			let templateResult = function(state)
			{
				let tElem = $("<div>").html(select2ItemTemplate);
				let tempScope = scope.$new();
				tempScope.state = state;
				let compiled = $compile(tElem)(tempScope);
				scope.$$digest();
				return compiled;
			}
			var data = [
				{
					id: 0,
					text: 'enhancement'
				},
				{
					id: 1,
					text: 'bug'
				},
				{
					id: 2,
					text: 'duplicate'
				},
				{
					id: 3,
					text: 'invalid'
				},
				{
					id: 4,
					text: 'wontfix'
				}
			];
			$(newSelect).select2(
			{
				data: data,
				language: "tr",
				templateResult: select2ItemTemplate ? templateResult : undefined,
				//templateSelection: tSelection ? function(state) { return stateFunc(state, false); } : undefined,
				theme: "bootstrap",
				dropdownAutoWidth: true,
				containerCssClass: ':all:',
			});
			$compile(newSelect)(scope)
        }
    };
});




angApp.directive('inputMask', function ($compile, $timeout) {
    return {
        restrict: 'A',
		require: '?ngModel',
        link: function (scope, element, attributes, ngModelCtrl) {
			let setModelValue = function(props){
				let unmaskedValue = $(element).inputmask('unmaskedvalue'); 
				if(attributes.ngModel)
				{
					let opt = ngModelCtrl.$options;
					if(props.event == "onincomplete" && !opt.getOption("allowInvalid"))
						return;
					ngModelCtrl.$setViewValue(unmaskedValue)
					ngModelCtrl.$render();
				}	
			}
			if(attributes.inputMask)
			{
				scope.$watch(attributes.inputMask, function(newValue, oldValue){
						$timeout(function(){
							$(element).inputmask(newValue, {
								//clearIncomplete: true,
								oncleared: function(){
									setModelValue({event: "oncleared"});		
								},
								oncomplete: function(){
									setModelValue({event: "oncomplete"});	
								},
								onincomplete: function(){
									setModelValue({event: "onincomplete"});	
		

								}
							});
						}, 100);

				});
			}
        }
    };
});

angApp.directive('interval', function ($compile, $timeout, $interval) {
    return {
        restrict: 'A',
		scope: true,
        link: function (scope, element, attributes) {
			scope.$on("$destroy", function(){
				if(v_interval)
				{
					$interval.cancel(v_interval);
					v_interval = undefined;
				}			
			});
			let v_interval;
			let tick = 0;
			scope.$watchGroup([attributes.interval, attributes.intervalMs, attributes.maxTick], function(newValues, oldValues, scope) {
				if(v_interval)
				{
					$interval.cancel(v_interval);
					v_interval = undefined;
				}
				let interval_enabled = newValues[0];
				if(!interval_enabled)
					return;
				let intervalMs = newValues[1] || 1000;
				let maxTick = newValues[2] || 0;
				scope.$maxTick = maxTick;
				scope.$tick = 0;
				if(maxTick > 0)
				{
					scope.$tickremaining =  maxTick - tick;
				}
				v_interval = $interval(function(){
					scope.$tick = ++tick;
					if(maxTick > 0)
					{
						scope.$tickremaining =  maxTick - tick;
					}
					if(tick >= maxTick && maxTick > 0)
					{
						$interval.cancel(v_interval);
						v_interval = undefined;
					}
				}, intervalMs);
			});
        }
    };
});



angApp.directive('cssProgress', function ($compile, $timeout) {
	const definitions = {
		"green": parseColor("#4fc64f"),
		"danger": parseColor("#ed6b75"),
		"error": parseColor("#ed6b75"),
		"info": parseColor("#659be0"),
		"warning": parseColor("#F1C40F"),
		"gray": parseColor("#eaeaea"),
		"success": parseColor("#36c6d3")
	}
    return {
        restrict: 'A',
		scope: true,
        link: function (scope, element, attributes) {
			
			
				scope.$cssClassName = "_css_p" + makeid(6);
				scope.$on('$destroy', function () {
					if(scope.$cssClass)
					{
						$(scope.$cssClass).remove();
						scope.$cssClass = undefined;
					}
				});
				let calPercent = (v, m) => v / m * 100;
				let applyGradient = function(props, scope)
				{
					let cur = 0;
					let colorsAndStops = [];
					let points = [];
					for(k in props.variants)
					{
						let v = props.variants[k];
						let perc = calPercent(v, props.max);
						let definition = definitions[k] || k;
						let newColorStart = alpha(definition, 0.9 * props.alpha);
						let newColorEnd = alpha(definition, 1 * props.alpha);
					
						colorsAndStops.push(`${newColorStart} ${cur}%`);
						colorsAndStops.push(`${newColorEnd} ${cur + perc}%`);
						
						points.push({
							variant: k,
							start: cur,
							percent: perc
						});

						cur += perc;
					}
					colorsAndStops.push(`rgba(0,0,0,0) ${cur}%`);
					let cssText = `background: linear-gradient(90deg, ${colorsAndStops.join(",")});`;
					if(scope.$cssClass)
					{
						$(scope.$cssClass).remove();
					}
					let w = $(element).width();
					if(w < 100)
						w = 100;
					let classContent = `
						.${scope.$cssClassName}
						{
							${cssText}
							background-repeat: no-repeat;
							animation: kf_${scope.$cssClassName} 1s forwards;
						}
						@keyframes kf_${scope.$cssClassName} {
						  0% {
							background-size: 0%
						  }
						  100% {
							background-size: 100%
						  }
						}
					
					`
					
					
					
					scope.$cssClass = $.defineClass(classContent)
					
					$(element).addClass(scope.$cssClassName);
					scope.$progress = {
						max: props.max,
						value: props.value,
						percent: cur,
						points: points
					}
				}
				
				scope.$watchGroup([attributes.cssProgress, attributes.value, attributes.max, attributes.alpha], function(newValues, oldValues, scope) {
					let cssProgress = newValues[0] || "success";
					let value = newValues[1] || 0;
					let max = newValues[2] || 100;
					let alpha = newValues[3] || 1;
					let variants = {};
					if(is_string(cssProgress))
					{
						variants[cssProgress] = value;
					}
					else{
						variants = cssProgress;
					}
					applyGradient({
						variants,
						max: max,
						alpha: alpha
					}, scope);

				});
			
        }
    };
});


angApp.directive('templateTarget', function ($compile) {
	return {
		restrict: 'A',
		scope: true,
		link: function (scope, element, attributes) {
			let track = [];
			let trackNames = [];
			for (attribute in attributes) {
				if (attribute != "param" && attribute.startsWith("param")) {
					track.push(attributes[attribute]);
					trackNames.push(attribute.replace(/^param/, ""));
				}
			}



			scope.$watch(function () {
				trackNames.forEach(function (item) {
					let v = scope.$parent.$eval(attributes["param" + item]);
					scope[item.toLowerCase()] = v;
				})
				let $tempData = scope.$parent.$eval(attributes.templateData);
				scope.Extend($tempData);
				if (!scope.$$phase) {
					scope.$digest();
				}

			}, function (value) {

			})

			scope.$watch(attributes.templateTarget, function (value) {
				let target = scope.$eval(attributes.templateTarget);
				if (target) {
					$(element).empty();
					let item = $(`script[template='${target}']`);
					item.each(function (item) {
						let elem = $(element).html($(this).html());
						let cloneElem = $(element).contents();
						let $injector = angular.element(this).injector();
						let $tempData = scope.$eval(attributes.templateData);
						trackNames.forEach(function (item) {
							scope[item.toLowerCase()] = scope.$eval(attributes["param" + item]);
						})
						scope.Extend($tempData);
						clearElementData(cloneElem);
						$injector.invoke(function ($rootScope, $compile) {
							$compile(cloneElem)(scope);
						});
						//$(element).append(cloneElem);
					});
					//scope.$apply();
				}
			});




		}
	};
})		

angApp.directive("fileUpload", function ($compile) {
	let msgElement = $("<div />").html("Dosyaları sürükleyebilir veya tıklayarak seçebilirsiniz.");
    return {
		restrict: 'A',
		require: '?ngModel',
		compile: function(element, attributes, ngModelCtrl){
				let inputElement = $("<input type='file' input-file />").css("display", "none");

			if($(element).is("[multiple]"))
			{
				inputElement.attr("multiple", "multiple");
			}
			if(attributes.ngModel){

				inputElement.attr("ng-model", attributes.ngModel);
			}
			if(attributes.ngChange){
				inputElement.attr("ng-change", attributes.ngChange);
			}
			if(attributes.ngDisabled){
				inputElement.attr("ng-disabled", attributes.ngDisabled);
			}
			if(attributes.base64){
				inputElement.attr("base64", attributes.base64);
			}
			$(element)
				//.empty()
				//.append(msgElement)
				.append(inputElement);
			
			$(element).addClass("upload-area ");

			return function(scope){
				$(element).on("dragover", function(e){
					e.preventDefault();
					if(scope.uploadingFile)
						return;
					$(element).addClass("dragover");
				});
				$(element).on("click", function(e){
					if(scope.uploadingFile)
						return;
					if(e.target === this || $(e.target).hasClass("fileselectclick"))
					{
						inputElement[0].click();
					}
					else{
					}
				});
				$(element).on("dragleave", function(){
					$(element).removeClass("dragover");
				});
				$(element).on("drop", function(e){
					e.preventDefault();
					if(scope.uploadingFile)
						return;
					$(element).removeClass("dragover");
					const files = e.originalEvent.dataTransfer.files;
					inputElement[0].files = files;

					$(inputElement).trigger("change");
				});
			}
		
		},
    }
});


angApp.directive("inputFile", [function () {
    return {
		restrict: 'A',
		require: '?ngModel',
        link: function (scope, element, attributes, ngModelCtrl) {
			let setBase64 = attributes.base64 == "true";
            $(element).on("change", function (changeEvent) {
			
				if(attributes.ngModel)
				{
					if($(element).is("[multiple]"))
					{
						ngModelCtrl.$setViewValue(changeEvent.target.files);

					}
					else{
						if(!setBase64)
						{
							ngModelCtrl.$setViewValue(changeEvent.target.files[0])
						}
						else
						{
						
							ngModelCtrl.$setViewValue(changeEvent.target.files[0].ImageData)
						}
					}
					ngModelCtrl.$render();
					for(let i = 0; i < changeEvent.target.files.length; i++)
					{
						let file = changeEvent.target.files[i];
						if(file.type.startsWith("image/"))
						{
							let reader = new FileReader();
							file.IsImage = true;
							reader.onload = function (loadEvent) {
								file.ImageData = loadEvent.target.result;
								if(setBase64 && !$(element).is("[multiple]"))
								{
									ngModelCtrl.$setViewValue(file.ImageData)
								}
								scope.$digest();
							}
							reader.readAsDataURL(file);
						}
					}
				}	
            });
        }
    }
}]);


	angApp.directive('ngEval', function ($compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
					let r = scope.$eval(attributes.ngEval);
                }
            };
        })		