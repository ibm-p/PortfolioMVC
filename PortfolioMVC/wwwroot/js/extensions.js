$.fn.extend({
	serializeObject: function(cb)
	{
		let data = $(this).serializeArray();
		let obj = {};
		$(data).each(function(index, item){
			let vl = is_callable(cb) ? cb(item) : item.value; 
			if(obj.hasOwnProperty(item.name))
			{
				let cv = obj[item.name];
				if(cv instanceof Array)
				{
					cv.push(vl);
				}
				else{
					obj[item.name] = [cv, vl];
				}
			}
			else {
				obj[item.name] = vl;
			}
		});
		return obj;

	},
	appendStyle: function(v)
	{
		if(!v) return this;
		$(this).each(function(i, e) {
			
			let curStyle = $(e).attr("style");
			let newStyle;
			if(!curStyle)
			{
				newStyle = v;
			}
			else{
				newStyle = curStyle;
				if(!curStyle.endsWith(";"))
				{
					newStyle += ";";
				}
				newStyle += v;
			}
			$(e).attr("style", newStyle);
		});
		return this;
	},
	appendAttr: function(n, v)
	{
		if(!n || !v) return this;
		$(this).each(function(i, e) {
			
			let curAttr = $(e).attr(n);
			$(e).attr(n, curAttr + v);
		});
		return this;
	},
	hasAttr: function(n){
		return $(this).attr(n) !== undefined && $(this).attr(n) !== false; 
	},
	clearAttr: function(fn) {
		$(this).each(function(i, e) {	
			for(let i = 0; i < e.attributes.length; i++)
			{
				let a = e.attributes[i];
				let remove = true;
				if(a.name == "id") 
					continue;
				if(is_callable(fn))
				{
					remove = fn(a, e);
				}
				else if(is_array(fn))
				{
					remove = fn.includes(a);
				}
				else if(is_string(fn))
				{
					remove = a == fn;
				}
				if(remove)
				{
					e.removeAttribute(a.name);
					i--;
				}

			}
			
		});
		return this;
	},
	clearData: function(fn) {
		clearElementData(this);
	}
});
function clearElementData(item)
{
	let obj = $(item).data();
	if(!obj)
	{
		return;
	}
	let keys = Object.keys(obj);
	for(let i = 0; i < keys.length; i++)
	{
		$(item).removeData(keys[i]);
	}
}
jQuery.fn.tagName = function() {
  return this.prop("tagName");
};

$.defineClass = function(nameOrContent, content)
{
	let styleId = makeid(8)
	if(content === undefined)
	{
		return $( `<style id="${styleId}">${nameOrContent}</style>` ).appendTo( "head" )
	}
	return $( `<style id="${styleId}">${nameOrContent} { ${content} }</style>` ).appendTo( "head" )
}

$.fn.extend({
	onEvent: function(name, callback)
	{
		return $(this).on(name, function(ev) {
			callback(ev.eventData, ev);
			return $(this);
		})

	},
	triggerEvent: function(name, data) {
		return $(this).trigger({
			type: name,
			eventData: data
		}) 
	},
	offsetRect: function()
	{
		let allRects = [];
		$(this).each(function(index, item) {
			allRects.push(offsetRect(item));
		});
		if(allRects.length == 0)
			return undefined;
		else if(allRects.length == 1)
			return allRects[0];
		else
		{
			let leftMin = allRects.Min(m => m.left);
			let topMin = allRects.Min(m => m.top);
			let wMax = allRects.Max(m => m.width);
			let hMax = allRects.Max(m => m.height);
			return {
				left: leftMin,
				top: topMin,
				width: wMax,
				height: hMax
			};
		}
		
	}
});

function hidePopoverBy(element)
{
	(($(element).closest(".popover").popover('hide').data('bs.popover') || {}).inState || {}).click = false
}
function hidePopover(element)
{
	(($(element).popover('hide').data('bs.popover') || {}).inState || {}).click = false
}

$(document).ready(function(){
	
	
	swal.confirm = function(title, text){
		return new Promise(function(res){
			Swal.fire({
				  title: title,
				  html: text,
				  icon: 'info',
				  showCancelButton: true,
				  confirmButtonText: 'Evet',
				  cancelButtonText: 'Hayır'
				}).then((result) => {
				  if (result.isConfirmed) {
					res(true);
				  } else if (result.isDismissed) {
					res(false);
				  }
				});
		});		
	}

	swal.error = function(title, text, timer=1750)
	{
		return new Promise(function(res){
			Swal.fire({
                title: title,
				html: text,
                icon: 'error',
                timer: timer,
                showCancelButton: false,
                showConfirmButton: false,
				didClose: () => {
					res();
				}
            });
		});
	}
	swal.success = function(title, text, timer=1750)
	{
		return new Promise(function(res){
			Swal.fire({
                title: title,
				html: text,
                icon: 'success',
                timer: timer,
                showCancelButton: false,
                showConfirmButton: false,
				didClose: () => {
					res();
				}
            });
		});
	}
	swal.warning = function(title, text, timer=1750)
	{
		return new Promise(function(res){
			Swal.fire({
                title: title,
				html: text,
                icon: 'warning',
                timer: timer,
                showCancelButton: false,
                showConfirmButton: false,
				didClose: () => {
					res();
				}
            });
		});
	}
	
	
});

Inputmask.extendAliases({
	'hm': {
        mask: "99:99",
        placeholder: "ss:dd",
    },
	'telefon': {
        mask: "(999) 999 99 99",
        placeholder: "(xxx) xxx xx xx",
    },
    'time': {
        alias: "hm"
    },
	'dmy hm': {
        mask: "99.99.9999 99:99",
        placeholder: "gg.aa.yyyy ss:dd",
    },
	'dmy': {
        mask: "99.99.9999",
        placeholder: "gg.aa.yyyy",
    },
	'date': {
        alias: "dmy"
    },
	'datetime': {
        alias: "dmy hm"
    },
});