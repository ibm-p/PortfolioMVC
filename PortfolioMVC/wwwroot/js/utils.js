var Select2Utils = {
	IsTemplate: function(name){
		return name.startsWith("#");
	},
	GetTemplateFN: function(name){
		if(name.startsWith("#"))
		{
			name = name.substr(1);
		}
		if(!name)
		{
			return undefined;
		}
		return Select2Templates[name];
	},
	ResolveTemplate: function(scope, name){
		if(!name)
		{
			return undefined;
		}
		let r;
		if(this.IsTemplate(name))
		{
			r = this.GetTemplateFN(name);
		}
		else{
			r = scope.$eval(name);
		}
		return r;
	}
}

	
	var HoverPopupUtils = {
			TimeOutPropList: {},
			Apply: function(element, props){
				let elid = "#" + props.ElementId;
				props.HideTimeout = 500;
				let functionEnter = function(event)
				{
					if (HoverPopupUtils.TimeOutPropList[elid])
						window.clearTimeout(HoverPopupUtils.TimeOutPropList[elid]);
					delete HoverPopupUtils.TimeOutPropList[elid]
				}
				let functionHide = function(event)
				{
					hideElement(event);
				}
				let unbindElement = function()
				{
					$(elid).unbind("mouseenter", functionEnter);
					$(elid).unbind("mouseleave", functionHide);
				}
				let bindElement = function()
				{	
					$(elid).on("mouseenter", functionEnter);
					$(elid).on("mouseleave", functionHide);
				}
				let chartAllowed = function(event)
				{
					return props.ElementId && (!props.MinWidth || props.MinWidth <= window.innerWidth) && props.Allowed();
				}
				let hideElement = function(event){
					    if(chartAllowed(event))
						{
							if(props.HideTimeout && props.HideTimeout > 0 && HoverPopupUtils.TimeOutPropList[elid])
							{
								return;
							}
							if(props.HideTimeout && props.HideTimeout > 0)
							{
								HoverPopupUtils.TimeOutPropList[elid] = window.setTimeout(function () {
									$("#" + props.ElementId).hide();
									if(props.OnHide) props.OnHide($("#" + props.ElementId));
									delete HoverPopupUtils.TimeOutPropList[elid]
									unbindElement();
									
								}, 500);
							}
							else
							{
								$("#" + props.ElementId).hide();
								if(props.OnHide) props.OnHide($("#" + props.ElementId));
								unbindElement();
							}
						}
				}
				let leftOfs = 83;
				let topOfs = 33;
				$(element).on("mouseenter", function(event){
						if(chartAllowed(event))
						{
							if (HoverPopupUtils.TimeOutPropList[elid])
								window.clearTimeout(HoverPopupUtils.TimeOutPropList[elid]);
							delete HoverPopupUtils.TimeOutPropList[elid]
							let rect = offset(element.get(0));
							let top = rect.top;
							let left = rect.left;
							let topReal = rect.topReal;
							let leftReal = rect.leftReal;
							$(elid).show();
							if(props.OnShown) props.OnShown($(elid));
							let rectChart = $(elid).offsetRect();
							let topDiff = 0;
							let leftDiff = 0;
							if(rectChart.height + topReal + topOfs > window.innerHeight)
								topDiff = rectChart.height + topReal + topOfs - window.innerHeight;
							if(rectChart.width +  leftReal + leftOfs > window.innerWidth)
								leftDiff = rectChart.width + leftReal + leftOfs - window.innerWidth;
							if(leftDiff > 100 &&  window.innerWidth > rectChart.width + leftOfs)
							{
								leftDiff = rectChart.width + leftOfs;
							}
							$(elid).css("top", top - 50 - topDiff);
							$(elid).css("left", left - 100);
							bindElement();
							
						}
				});
				$(element).on("mouseleave", function(event){
						hideElement(event);
					});
				$(element).on("mousemove", function(event){
						if(chartAllowed(event))
						{
							let elid = "#" + props.ElementId;
							let left = event.pageX;
							let top = event.pageY;
							let rectChart = $(elid).offsetRect();
							let topReal = event.clientY;
							let leftReal = event.clientX;
							let topDiff = 0;
							let leftDiff = 0;
							if(rectChart.height + topReal + topOfs  > window.innerHeight)
								topDiff = rectChart.height + topReal + topOfs - window.innerHeight;
							if(rectChart.width +  leftReal + leftOfs > window.innerWidth)
								leftDiff = rectChart.width + leftReal + leftOfs - window.innerWidth;
							if(leftDiff > 100 &&  window.innerWidth > rectChart.width + leftOfs)
							{
								leftDiff = rectChart.width + leftOfs;
							}
								
							
							
							$(elid).css("top", top - 50 - topDiff);
							$(elid).css("left", left - 100 - leftDiff);
						}
					});
			}
		}