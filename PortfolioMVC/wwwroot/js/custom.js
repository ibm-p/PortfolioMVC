Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
const epocTicks = 621355968000000000
var defaultExtendOptions = {
	AllowNull: true,
	AllowUndefined: true,
	ExtendOnlySourceNull: false,
	ExtendOnlySourceUndefined: false
};
function getFunctionParamNames (fn)
{
	return fn.toString()
	.replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
	.match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
	.split(/,/);
};
function is_string(obj) {
	return typeof (obj) == "string";
}
function in_quote(item)
{
	if(!is_string(item) || item.length < 2)
		return false;
	return (item.startsWith('"') && item.endsWith('"')) || (item.startsWith('\'') && item.endsWith('\''))

}
function is_callable(item)
{
	return item != undefined && !item != null && (typeof item === 'function');
}
function is_array(item)
{
	return item instanceof Array;
}
function is_object(item)
{
	return !is_array(item) && item instanceof Object;
}
function createAlertFromMessage(messageData, target, source = "#alert_pool")
{
	if(!messageData || !messageData.data)
	{
		createAlert("Error", false, source);
		return;
	}
	let text = messageData.data.Text;
	if(!text) text = messageData.data.Success ? "Success" : "Error"
	createAlert(text, messageData.data.Success, target, source);
}
function createAlert(message, success, target, source = "#alert_pool") {
	let newAlert = $(source).copy();
	newAlert.addClass((success) ? "alert-success" : "alert-danger");
	newAlert.removeAttr("id");
	$(source + "_message", newAlert).removeAttr("id").html(message);
	$(target).empty().append(newAlert);
	newAlert.show();
};
function setvalues(source, target, checkownprop = false, excluded = undefined)
{
	for (let prop in source) {
		if(excluded)
		{
			if(is_array(excluded))
				if(excluded.includes(prop))
					continue;
			if(is_callable(excluded))
				if(excluded.apply(undefined, [prop]))
				continue;
			
		}
		if(!checkownprop || target.hasOwnProperty(prop))
		{
			target[prop] = source[prop]
		}
	}
}
function extend(source, target, checkownprop = false, excluded = undefined, options)
{
	if(!options)
	{
		options = defaultExtendOptions;
	}
	for(let option in defaultExtendOptions){
		if(options[option] === undefined)
		{
			options[option] = defaultExtendOptions[option]
		}
	} 
	for (let prop in target) {
		if(excluded)
		{
			if(is_array(excluded))
				if(excluded.includes(prop))
					continue;
			if(is_callable(excluded))
				if(excluded.apply(undefined, [prop]))
				continue;
			
		}
		if(!checkownprop || source.hasOwnProperty(prop))
		{
			let targetValue = target[prop];
			let sourceValue = source[prop];
			let allowSourceAssing = (!options.ExtendOnlySourceNull  && !options.ExtendOnlySourceUndefined) || (options.ExtendOnlySourceNull && sourceValue === null) || (options.ExtendOnlySourceUndefined && sourceValue === undefined);

			
			
			if(allowSourceAssing && (targetValue || (targetValue !== null && targetValue !== undefined) || (targetValue === null && options.AllowNull) || (targetValue === undefined && options.AllowUndefined)))
			{
				source[prop] = targetValue
			}			
		}
	}
	return source;
}
function seperate(source, props, options) {
	let obj = {};
	let del = options ? options.delete : false;
	for (let i = 0; i < props.length; i++) {
		let prop = props[i];
		if (!source.hasOwnProperty(prop))
			continue;
		obj[prop] = source[prop]
		if (del)
			delete source[prop];
	}
	return obj;
}
function copy(source, deep = false)
{

	let newObj = Object.assign(is_array(source) ? [] : {}, source);
	if(deep)
	{
		if(is_array(newObj))
		{
			for(let i = 0; i < newObj.length; i++)
			{
				newObj[i] = Object.assign(is_array(source[i]) ? [] : {}, source[i])
			}
		}
	}
	return newObj;
}
function dateFromTicks(ticks) {
	let nd = ticks - epocTicks
	return new Date(nd / 10000);
}


function resolveArguments(capitalize = true)
{
	let caller = resolveArguments.caller;
	let args = caller.arguments;
	if(args.length <= 0)
	{
		return undefined;
	}

	
	if(is_object(args[0])){
		return args[0];
	}
	let names = getFunctionParamNames(caller);
	let obj = {};
	for(let i = 0; i < names.length; i++)
	{
		let name;
		if(capitalize)
		{
			name = names[i].capitalizeFirstLetter();

		}
		else	
		{
			name = names[i];
		}
		obj[name] = args[i];
	}
	return obj;

}
Object.defineProperty(Object.prototype, "GetLength", { 
    value: function() {
        if(is_object(this))
		{
			return Object.keys(this).length;
		}
		else if(is_array(this))
		{
			return this.length;
		}
		else if(is_string(this))
		{
			return this.length;
		}
		return undefined;
	},
	writable: true,
    enumerable : false
});
Object.defineProperty(Object.prototype, "GetAny", {
	value: function (props) {
		return _getAny(this, props);
	},
	writable: false,
	enumerable: false
});
function _getAny(object, props) {
	for (let i = 0; i < props.length; i++) {
		let p = props[i];
		let r = object[p];
		if (r)
			return r;
	}
	return undefined;
}
Object.defineProperty(Object.prototype, "Get", { 
    value: function(n) {
        if(is_object(this) || is_array(this))
		{
			return this[n];
		}
		return undefined;
	},
	writable: true,
    enumerable : false
});
Object.defineProperty(Object.prototype, "Set", { 
    value: function(n, v) {
		if(!this)
		{
			return this;
		}
        if(is_object(this) || is_array(this))
		{
			this[n] = v;
		}
		return this;
	},
	writable: true,
    enumerable : false
});
Object.defineProperty(Object.prototype, "SetAllValue", { 
    value: function(v) {
		Object.keys(this).forEach(key => {
		  this[key] = v;
		});
		return this;
	},
	writable: true,
    enumerable : false
});

Object.defineProperty(Object.prototype, "ToArray", { 
    value: function() {
		if(is_object(this))
		{
			let result= [];
			for(let k in this)
			{
				if(k == "$$hashKey")
					continue;
				result.push({
					key: k,
					value: this[k]
				});
			}
			return result;
		}
		return undefined;
	},
	writable: true,
    enumerable : false
});


Object.defineProperty(Object.prototype, "ForEach", { 
    value: function(fn) {
		if(is_object(this))
		{
			let total = 0;
			for(let k in this)
			{
				fn(k);
				total++;
			}
		}
		if(is_array(this))
		{
			return this.forEach(fn);
		}
		return undefined;
	},
	writable: true,
    enumerable : false
});



Object.defineProperty(Object.prototype, "Extend", { 
    value: function(target, checkownprop = false, excluded = undefined, options) {
        return extend(this, target, checkownprop, excluded, options);
	},
	writable: true,
    enumerable : false
});

Object.defineProperty(Object.prototype, "Include", { 
    value: function(target, allowNull = true) {
        return extend(this, target, false, undefined, {ExtendOnlySourceNull: allowNull, ExtendOnlySourceUndefined: true});
	},
	writable: true,
    enumerable : false
});

Object.defineProperty(Object.prototype, "Seperate", { 
	value: function (props, options) {
		return seperate(this, props, options);
	},
	writable: true,
    enumerable : false
});

Object.defineProperty(Object.prototype, "Copy", { 
    value: function(deep = false) {
        return copy(this, deep);
	},
	writable: true,
	enumerable : false
});

Object.defineProperty(Object.prototype, "setValuesFrom", { 
    value: function(source, checkownprop = false, excluded = undefined) {
		setvalues(source, this, checkownprop, excluded);
        return this;
	},
	writable: false,
    enumerable : false
});
Object.defineProperty(Number.prototype, "IsIn", { 
    value: function() {
		for(let i = 0; i < arguments.length; i++)
			if(arguments[i] == this)
				return true;
        return false;
	},
	writable: false,
    enumerable : false
});
Object.defineProperty(String.prototype, "IsIn", { 
    value: function() {
		for(let i = 0; i < arguments.length; i++)
			if(arguments[i] == this)
				return true;
        return false;
	},
	writable: false,
    enumerable : false
});
Object.defineProperty(String.prototype, "capitalizeFirstLetter", { 
    value: function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
	},
	writable: false,
    enumerable : false
});

Object.defineProperty(Array.prototype, "IsEmpty", { 
    get: function(props) {
		return this.length <= 0;
    },
    enumerable : false
});
Object.defineProperty(Array.prototype, "FindIndex", { 
    value: function(p1, p2) {
		let r = this.FirstWhere(p1, p2, true)
		return r === undefined ? -1 : r;
    },
    enumerable : false
});

Object.defineProperty(HTMLElement.prototype, "Data", { 
    get: function() {
		if(this.__$Proxy)
			return this.__$Proxy;
		return this.__$Proxy = new Proxy(this, {
				get: (elem, prop) => {			
					return $(this).data(prop);
				},
		});
    },
    enumerable : false
});

Object.defineProperty(Event.prototype, "Data", { 
    get: function() {
		return (this.target || {Data: {}}).Data;
    },
    enumerable : false
});
Object.defineProperty(Event.prototype, "DataCT", { 
    get: function() {
		return (this.currentTarget || {Data: {}}).Data;
    },
    enumerable : false
});

Object.defineProperty(Array.prototype, "FirstWhere", { 
    value: function(p1, p2, returnIndex = false) {
		if(this.IsEmpty || (!p1 && !p2))
		{
			return undefined;
		}
		let isObject = false;
		if(is_string(p1))
		{
			  isObject = !p1.ValidForObject()
		}
        for(let i = 0; i < this.length; i++)
		{
			let item = this[i];
			let r = false;
			if(p2)
				r = item[p1] == p2;
			else if(is_callable(p1))
				r = p1(item);
			else if(isObject)
				r = execV2(p1, {x: item});
			else
				r = item == p1;
			if(r)
				return returnIndex ? i : item;
		}
		return returnIndex ? -1 : undefined;
    },
    enumerable : false
});
Object.defineProperty(Array.prototype, "Clear", { 
    value: function() {
		if(this.length == 0)
			return this;
		this.splice(0, this.length);
		return this;
    },
    enumerable : false
});
Object.defineProperty(Array.prototype, "RemoveAll", { 
    value: function(fn, v) {
		return this.Remove(fn, v, 0);
    },
    enumerable : false
});
Object.defineProperty(Array.prototype, "Insert", { 
    value: function(index) {
		if(arguments.length < 2)
		{
			return this;
		}
		let newArgs = [index, 0];
		for(let i = 1; i < arguments.length; i++)
		{
			newArgs.push(arguments[i]);
		}
		return this.splice.apply(this, newArgs);
    },
    enumerable : false
});
Object.defineProperty(Array.prototype, "Remove", { 
    value: function(fn, v, limit = 1) {
		if(this.IsEmpty)
		{
			return this;
		}
		let removed = 0;
        for(let i = 0; i < this.length; i++)
		{
			if(is_callable(fn))
			{
				if(fn(this[i]))
				{
					this.splice(i, 1);
					if(limit > 0 && ++removed>limit)
						break;
				}
			}
			else
			{
				if(v !== undefined)
				{
					if(this[i][fn] == v)
					{
						this.splice(i, 1);
						if(limit > 0 && ++removed>limit)
							break;
					}
				}
				else{
					if(this[i] == fn)
					{
						this.splice(i, 1);
						if(limit > 0 && ++removed>limit)
							break;
					}
				}
			}
		}
		return this;
    },
    enumerable : false
});
Object.defineProperty(Array.prototype, "RemoveAt", { 
    value: function(index) {
		if(this.IsEmpty || index < 0 || index >= this.length)
		{
			return undefined;
		}
		return this.splice(index, 1);;
    },
    enumerable : false
});
Object.defineProperty(Array.prototype, "RemoveFirst", { 
    value: function() {
		let index = 0;
		if(this.IsEmpty || index >= this.length)
		{
			return undefined;
		}
		return this.splice(index, 1);
    },
    enumerable : false
});
Object.defineProperty(Array.prototype, "RemoveLast", { 
    value: function() {
		let index = this.length - 1;
		if(this.IsEmpty || index >= this.length)
		{
			return undefined;
		}
		return this.splice(index, 1);
    },
    enumerable : false
});
Object.defineProperty(Array.prototype, "GroupByCount", { 
    value: function(count) {
		  return this.GroupBy((i, m) => Math.floor(i / count));
    },
    enumerable : false
});
Object.defineProperty(Array.prototype, "Repeated", { 
    value: function(key, props) {
		let distinct = props ? props.distinct : true;
		let filtered = this.GroupBy(key, {skipUndefined: true})
		.filter(m => m.length > 1)
		if(distinct)
			return filtered.map(m => m[0]);
		return filtered.SelectMany(m => m);
    },
    enumerable : false
});

Object.defineProperty(Array.prototype, "SelectMany", {
	value: function (collectionSelector, resultSelector) {
		const newList = [];
		for (let i = 0; i < this.length; i++) {
			const item = this[i];
			const collection = is_array(collectionSelector) ? collectionSelector : collectionSelector(item);
			if (collection) {
				for (let j = 0; j < collection.length; j++) {
					const subItem = collection[j];
					const result = resultSelector ? resultSelector(item, subItem) : subItem;
					newList.push(result);
				}
			}
		}
		return newList;
	},
	writable: false,
	enumerable: false
});

Object.defineProperty(Array.prototype, "GroupBy", {
	value: function (key, options) {
		let skipUndefined = options && options.skipUndefined;
		let total = 0;
		let isObject = false;
		let opt = {
			onGroupInit: function(){},
			onAddItem: function() {}
		};
		
		opt.Extend(options);
		if (is_string(key)) {
			isObject = !key.ValidForObject(key)
		}
		let allSuccess = function(key, target)
		{
			if(!is_object(key))
				return key == target;
			for(k in key)
			{
				if(key[k] != target[k])
				{
					return false;
				}
			}
			return true;
		}
		
		return this.reduce(function (rv, x) {
	
			let mkey = is_callable(key) ? (key.length == 1 ? key(x) : key(total, x)) : ((isObject) ? exec(key, { total: total, x: x }) : x[key]);

			if (is_callable(mkey)) {
				mkey = (mkey.length == 1 ? mkey(x) : mkey(total, x));
			}
			if(skipUndefined && mkey === undefined)
				return rv;
			if(is_object(mkey))
			{
			}
			
			let item = rv.Last;
			if (!item || item.key != mkey) {
				item = rv.find(function (i) {
					return i.key == mkey
				})
				if (!item) {
					item = [];
					item.key = mkey;
					rv.push(item);
					opt.onGroupInit({key: key, array: item, item: x});
				}

			}
			total++;
			let r = opt.onAddItem({key: key, array: item, item: x})
			if(r !== false) item.push(x);
			return rv;
		}, []);
	},
	enumerable: false
});



Object.defineProperty(Array.prototype, "RemoveWhere", { 
    value: function(fn) {
		if(this.IsEmpty)
		{
			return this;
		}
        for(let i = 0; i < this.length; i++)
		{
			if(fn(this[i]))
			{
				this.splice(i, 1);
				i--;
			}
		}
		return this;
    },
    enumerable : false
});

Object.defineProperty(Array.prototype, "Each", { 
    value: function(fn) {
		if(this.IsEmpty)
		{
			return this;
		}
        for(let i = 0; i < this.length; i++)
		{
			let r;
			if(fn.length == 1)
			{
				r = fn(this[i]);
			}
			else if(fn.length == 2)
			{
				r = fn(i, this[i]);
			}

			if(r === true)
			{
				break;
			}
		}
		return this;
    },
    enumerable : false
});

Object.defineProperty(Array.prototype, "First", { 
    get: function(props) {
		if(this.IsEmpty)
		{
			return undefined;
		}
        return this[0];
    },
    enumerable : false
});

Object.defineProperty(Array.prototype, "Last", { 
    get: function() {
		if(this.IsEmpty)
		{
			return undefined;
		}
        return this[this.length - 1];
	},
    enumerable : false
});

Object.defineProperty(Array.prototype, "Min", { 
    value: function(fn) {
		return arrayMin(this, fn);
	},
	writable: false,
    enumerable : false
});
Object.defineProperty(Array.prototype, "Max", { 
    value: function(fn) {
		return arrayMax(this, fn);
	},
	writable: false,
    enumerable : false
});

Object.defineProperty(Array.prototype, "MinBy", { 
    value: function(predicate, returnIndex = false, isMin=true) {
		let maxItem;
		let maxValue;
		let maxI = -1;
		for(let i = 0; i < this.length; i++)
		{
			let cur = this[i];
			let v = cur;
			if(is_string(predicate))
			{
				v = cur[predicate];
			}
			else if(is_callable(predicate))
			{
				v = predicate(cur);
			}
			if(i == 0)
			{
				maxItem = cur;
				maxValue = v;
				maxI = 0;
			}
			else{
				if(!isMin && v > maxValue)
				{
					maxValue = v;
					maxItem = cur;
					maxI = i;
				}
				else if(isMin && v < maxValue)
				{
					maxValue = v;
					maxItem = cur;
					maxI = i;
				}
			}
		}
		return returnIndex ? maxI : maxItem;
	},
	writable: false,
    enumerable : false
});
Object.defineProperty(Array.prototype, "MaxBy", { 
    value: function(predicate, returnIndex=false, isMin=true) {
		return this.MinBy(predicate, returnIndex, false);
	},
	writable: false,
    enumerable : false
});

Object.defineProperty(Array.prototype, "Any", { 
    value: function(fn, v) {
		if(!fn)
		{
			return !this.IsEmpty;
		}
		let isfunc = is_callable(fn);

		for(let i = 0; i < this.length; i++)
		{
			
			if(isfunc)
			{
				if(fn(this[i]))
					return true;
			}
			else
				if(v !== undefined)
				{
					if(this[i][fn] == v)
						return true;
				}
				else{
					if(this[i] == fn)
						return true;
				}
		}
		return false;
	},
	writable: false,
    enumerable : false
});
Object.defineProperty(Array.prototype, "All", { 
    value: function(fn, v) {
		if(this.IsEmpty)
			return false;
		let isfunc = is_callable(fn);
		for(let i = 0; i < this.length; i++)
		{
			if(isfunc)
			{
				if(!fn(this[i]))
					return false;
			}
			else
				if(v !== undefined)
				{
					if(this[i][fn] != v)
						return false;
				}
				else{
					if(this[i] != fn)
						return false;
				}

		}
		return true;
	},
	writable: false,
    enumerable : false
});
Object.defineProperty(Array.prototype, "SetAll", { 
    value: function(fn, v, excludes) {
		if(this.IsEmpty)
			return false;
		let isfunc = is_callable(fn);
		for(let i = 0; i < this.length; i++)
		{
			if(excludes !== undefined)
			{
				if(is_array(excludes))
				{
					if(excludes.includes(this[i])) continue;
				}
				else{
					if(this[i] == excludes) continue;
				}
			}

			
			if(isfunc)
			{
				let v = fn(this[i]);
				this[i] = v;
			}
			else
				if(v !== undefined)
				{
					this[i][fn] = v;
				}
				else{
					this[i] != fn;
				}

		}
		return true;
	},
	writable: false,
    enumerable : false
});

Object.defineProperty(Array.prototype, "GetCount", { 
    value: function(fn, v) {
		let total = 0;
		if(this.IsEmpty)
			return total;
		let isfunc = is_callable(fn);
		for(let i = 0; i < this.length; i++)
		{
			if(isfunc)
			{
				if(fn(this[i]))
					total++;
			}
			else
				if(v !== undefined)
				{
					if(this[i][fn] == v)
						total++;
				}
				else{
					if(this[i] == fn)
						total++;
				}

		}
		return total;
	},
	writable: false,
    enumerable : false
});

Object.defineProperty(String.prototype, "IsLetter", { 
    value: function() {
		return /^([A-Za-z0-9]+)$/.test(this);
	},
	writable: false,
    enumerable : false
});

Object.defineProperty(String.prototype, "ValidForObject", { 
    value: function() {
		let isLetter = this.IsLetter();
		return isLetter && !(/^([0-9]+)/.test(this));
	},
	writable: false,
    enumerable : false
});
Object.defineProperty(String.prototype, "InQuote", { 
    value: function() {
		return this.length > 1 && ((this.startsWith('\'') && this.endsWith('\'')) || (this.startsWith('"') && this.endsWith('"')))
	},
	writable: false,
    enumerable : false
});


Object.defineProperty(Array.prototype, "Filter", { 
    value: function(p1, p2) {

		if(this.IsEmpty || (!p1 && !p2))
		{
			return this;
		}
		let isObject;
		if(is_string(p1))
		{
			isObject = !p1.ValidForObject(p1)
		}
		return this.filter(function(item) {
			if(p2)
				return item[p1] == p2;
			if(is_callable(p1))
				return p1(item);
			if(isObject)
				return execV2(p1, {x: item});
			return item == p1;
		});
    },
    enumerable : false
});


Object.defineProperty(String.prototype, "indexOfAny", { 
    value: function(arr) {
		if(is_string(arr))
			arr = Array.from(arr)
		if(is_array(arr))
		{
			for(let i = 0; i < this.length; i++)
				if(arr.includes(this[i])) 
					return i;
		}
		return -1;
	},
	writable: false,
    enumerable : false
});

Object.defineProperty(String.prototype, "firstEnd", { 
    value: function(startLength = 5, endLength = 4, trail = "....") {
        if (this.length <= startLength + endLength) return this;
		return this.substring(0, startLength) +
        trail +
        this.substring(this.length - endLength, this.length);
	},
	writable: false,
    enumerable : false
});

Object.defineProperty(String.prototype, "first", { 
    value: function(length = 5, trail = "....") {
		if (this.length <= length) return this;
		return this.substring(0, length) + trail;
	},
	writable: false,
    enumerable : false
});

Object.defineProperty(String.prototype, "interpolate", { 
    value: function(o) {
        return interpolate(this, o);
	},
	writable: false,
    enumerable : false
});
Object.defineProperty(Array.prototype, "pushif", { 
    value: function(predicate, v) {
		if((is_callable(predicate) && predicate(v)) || (predicate))
			this.push(v);
    },
    enumerable : false
});
Object.defineProperty(Array.prototype, "pushRange", { 
    value: function(v) {
		if(!is_array(v))
			this.push(v);
		else
		{
			let $this = this;
			v.forEach(function(c){$this.push(c)});
		}
		return this;
    },
    enumerable : false
});

Object.defineProperty(Object.prototype, "Coalesce", { 
    value: function() {
		if(this !== null && this !== undefined)
			return this;
		for(let i = 0; i < arguments.length; i++)
			if(arguments[i] !== null && arguments[i] !== undefined)
				return arguments[i];
		return this;
	},
	writable: true,
    enumerable : false
});
Object.defineProperty(Date.prototype, "toLocal", { 
    value: function() {
		return convertUTCDateToLocalDate(this);
	},
	writable: true,
    enumerable : false
});
Object.defineProperty(Date.prototype, "addDays", {
	value: function (days) {
		var date = new Date(this.valueOf());
		this.setDate(date.getDate() + days);
		return this;
	},
	writable: false,
	enumerable: false
});
Object.defineProperty(Date.prototype, "addMonths", {
	value: function (months) {
		var date = new Date(this.valueOf());
		this.setMonth(date.getMonth() + months);
		return this;
	},
	writable: false,
	enumerable: false
});
Object.defineProperty(Date.prototype, "toUnix", {
	value: function () {
		return Math.round(this.getTime() / 1000);
	},
	writable: true,
	enumerable: false
});
Object.defineProperty(Date.prototype, "addSeconds", {
	value: function (seconds) {
		this.setSeconds(this.getSeconds() + seconds);
		return this;
	},
	writable: false,
	enumerable: false
});
Object.defineProperty(Date.prototype, "startOfDay", {
	value: function () {
		let nd = new  Date(this)
		nd.setHours(0, 0, 0, 0)
		return nd;
	},
	writable: false,
	enumerable: false
});
Object.defineProperty(Date.prototype, "endOfDay", {
	value: function () {
		let nd = new Date(this)
		nd.setHours(23, 59, 59, 999)
		return nd;
	},
	writable: false,
	enumerable: false
});
Object.defineProperty(Array.prototype, "OrderByDesc", { 
    value: function(predicate, clone = true) {
		return this.OrderBy(predicate, clone, true)
    },
    enumerable : false
});
Object.defineProperty(Array.prototype, "OrderBy", { 
    value: function(predicate, clone=true, isDescending = false) {
		let isObject;
		let isString;
		if(is_string(predicate))
		{
			isString = true;
			isObject = !predicate.ValidForObject()
		}
		let arrayItem = clone && !this.toSorted ? this.copy() : this;
		let orderFunc = function(a, b) {
			let item1 = a;
			let item2 = b;
			if(isString)
			{
				if(isObject)
				{
					item1 = execV2(predicate, {"$item": a});
					item2 = execV2(predicate, {"$item": b});
				}
				else
				{
					item1 = a[predicate];
					item2 = b[predicate];
				}

			}
			else if(is_callable(predicate))
			{
				item1 = predicate(a);
				item2 = predicate(b);
			}
			if(item1 === undefined && item2 === undefined)
				return 0;
			else if (item1 === undefined)
				return isDescending ? -1 : 1;
			else if (item2 === undefined)
				return isDescending ? 1 : -1;
			
			if(item1 > item2)
				return isDescending ? -1 : 1;
			else if(item1 < item2)
				return isDescending ? 1 : -1;
			return 0;
		};
		if(clone && this.toSorted)
			return arrayItem.toSorted(orderFunc);
		return arrayItem.sort(orderFunc);
    },
    enumerable : false
});

Object.defineProperty(Array.prototype, "ClosestItem", { 
    value: function(v1, v2 = undefined, isOrderedAsc = true, returnIndex = false) {
		let isObject;
		let isString;
		if(v2 && is_string(v1))
		{
			isString = true;
			isObject = !v1.ValidForObject()
		}
		let arrayItem = isOrderedAsc ? this : this.OrderBy(undefined, true);
		for(let i = 0; i < arrayItem.length; i++)
		{
			let item = arrayItem[i];
			let cur = item;
			if(v1 && v2)
			{
				if(isString)
				{
					if(isObject)
					{
						cur = execV2(v1, {"$item": cur, "$index": i});
					}
					else
					{
						cur = item[v1];
					}
				}
				else if(is_callable(v1))
				{
					cur = v1(item, i);
				}
				if(v2 <= cur)
					return returnIndex ? i : item;
			}
			else
			{
				if(v1 <= cur)
					return returnIndex ? i : item;
			}
		}
    },
    enumerable : false
});

Object.defineProperty(Array.prototype, "DistinctBy", { 
    value: function(v1) {
		let isObject;
		let isString;
		if(is_string(v1))
		{
			isString = true;
			isObject = !v1.ValidForObject()
		}
		let getCur = function(item, index)
		{
			let cur = item;
			if(isString)
			{
				if(isObject)
				{
					cur = execV2(v1, {"$item": item, "$index": index});
				}
				else
				{
					cur = item[v1];
				}
			}
			else if(is_callable(v1))
			{
				cur = v1(item, index);
			}
			return cur;
		};
		return this.filter(function (item, index, array) {
			let cur = getCur(item, index);
			return array.findIndex(function(item, index) {
				let cur2 = getCur(item, index);
				return cur2 == cur;
			}) === index;
		});
    },
    enumerable : false
});


function Coalesce()
{
	for(let i = 0; i < arguments.length; i++)
			if(arguments[i] !== null && arguments[i] !== undefined)
				return arguments[i];
	return undefined;
}



function interpolate(input, o) {
	if(!o){
		return input;
	}
    return input.replace(/{([^{}]*)}/g,
        function (a, b) {
			if(!o.hasOwnProperty(b))
			{
				return a;
			}
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

function arrayMin(array, fn)
{
	if(!fn)
	{
		return Math.min.apply(Math, array);
	}
	return Math.min.apply(Math, array.map(fn))
}
function arrayMax(array, fn)
{
	if(!fn)
	{
		return Math.max.apply(Math, array);
	}
	return Math.max.apply(Math, array.map(fn))
}

function is_empty(object)
{
	return !!!object; 
}

function ApplyAngularCallBacks(appControllerCallBack, appControllerFuncParamNames, args) {
		if(!is_array(appControllerCallBack))
			appControllerCallBack = [appControllerCallBack];
        for (let i = 0; i < appControllerCallBack.length; i++) {
            let cb = appControllerCallBack[i];
            if (cb) {

                if (is_callable(cb)) {

                    let newitem = {
                        Method: cb,
                    }
                    let names = getFunctionParamNames(cb);
                    let indis = new Array(names.length);
                    for (let j = 0; j < names.length; j++) {
                        indis[j] = appControllerFuncParamNames.indexOf(names[j]);
                    }
                    newitem.Indis = indis;
                    appControllerCallBack[i] = newitem;
                    cb = newitem;
                }
                if (is_object(cb)) {
                    let params = new Array(cb.Indis.length);
                    for (let j = 0; j < cb.Indis.length; j++) {
                        params[j] = args[cb.Indis[j]];
                    }
                    cb.Method.apply(this, params);
                }
            }
        }
}
function fixJsonForSerialize(data, options)
{
	let opt = {
		pre: function(){},
		post: function() {},
		max_recursive: 5
	}
	let max_recursive = opt.max_recursive;
	opt.Extend(options);

	if(is_array(data))
	{
		for(let i = 0; i < data.length; i++)
		{
			fixJsonForSerialize(data[i], opt);
		}
		return data;
	}
	if(!is_object(data))
	{
		return data;
	}
	if(is_callable(data))
		return data;


	for(let key in data)
	{
		let v = data[key];
		opt.pre({item: data ,key: key, value: v, set: function(nv){
			v = data[key] = nv
		}});	
		if(is_callable(v))
			continue;
		if(is_object(v) || is_array(v))
		{
			if(max_recursive == 0)
			{
				continue;
			}
			fixJsonForSerialize(v,  {...opt, max_recursive: max_recursive == -1 ? -1 : max_recursive - 1} );
			continue;
		}
		fixJsonForSerializeItem(data, key);
		opt.post({item: data ,key: key, value: v});
	}
	return data;
}

function fixJsonForSerializeItem(data, key)
{
	let v = data[key];
	if(typeof(v) == "string")
	{
		if(v.match(/^\/Date\(([0-9]+)\)\/$/gi))
		{
			let replaced = v.replace(/\//gi, "");
			let date = eval("new " + replaced);
			let utcDate = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
            date.getUTCDate(), date.getUTCHours(),
            date.getUTCMinutes(), date.getUTCSeconds());
			data[key] = date;
		}
		else if(v.match(/^([0-9]{4})((\.|-)([0-9]){2}){2}T([0-9]){2}\:([0-9]){2}/gi)){
			data[key] = new Date(Date.parse(v.replace("Z", "")));
		}
	}
}

function convertUTCDateToLocalDate(date) {
	var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
	return newDate;
    /*var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);*/
    return newDate;
}
function convertLocalDateToUtcDateV2(date)
{
	 return Date.UTC(date.getFullYear(), date.getMonth(),
                date.getDate(), date.getHours(),
                date.getMinutes(), date.getSeconds());
}

function convertLocalDateToUtcDate(date)
{
	 return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), date.getUTCHours(),
                date.getUTCMinutes(), date.getUTCSeconds());
}

function execFn(code, obj, thisObject)
{
	
	let fargs = [];
	if(is_object(obj))
	{
		fargs = Object.keys(obj);
	}
	fargs.push(code);
	let fn = Function.prototype.constructor.apply(null, fargs);
	return fn.apply(thisObject, is_object(obj) ?  Object.values(obj) : []);
}
function exec(code, obj)
{
	let evalPrefix = "";
	let _tempArg = obj;
	if(is_object(obj))
	{
		for(let k in obj)
		{
			evalPrefix += `let ${k} = _tempArg.${k};`
		}
	}
	let r = eval(evalPrefix + "\r\n" + code);
	return r;
}
function execV2(code, obj, thisObject){
	let keys = [];
	if(obj)
		keys = Object.keys(obj);
	let functInner =  "return " + code;
	let newFunc = new Function(keys, functInner);
	let r = newFunc.apply(thisObject, is_object(obj) ?  Object.values(obj) : []);
	return r;
}

function playSound(file)
{
	let path = baseUrl + "Content/Sound/" + file;
	let mp3Source = '<source src="' + path + '.mp3" type="audio/mpeg">';
	let embedSource = '<embed hidden="true" autostart="true" loop="false" src="' + path +'.mp3">';
	document.getElementById("sound").innerHTML='<audio autoplay="autoplay">' + mp3Source + embedSource + '</audio>';
}

function removeZero(x)
{
	
	let doti = x.indexOf(".");
	if(doti >= 0)
	{
		let ipoint = x.length;
		for(let i = x.length - 1; i > doti; i--)
		{
			if(x[i] != 0)
			{
				break;
			}
			ipoint = i;
		}
		if(ipoint == doti + 1)
		{
			 ipoint--;
		}
		
		let res =  x.substring(0, ipoint);
		return res;
		
	}
	return x;
}

function toFixed2(x, maxdigit = -1) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
		let nextc = (new Array(e)).join('0') + x.toString().substring(2)
        x = '0.' + nextc;
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
    }
  }
  let zeroremoved = removeZero(x.toString(), 2);
  if(maxdigit > -1)
  {
	  let ts = x.toString();
	  let splitted = ts.split('.');
	  if(splitted.length > 1)
	  {
			let sec = splitted[1];
			let totali = sec.length;
			let numStar = sec.indexOfAny("123456789");
			if(numStar >= maxdigit)
			{
				maxdigit = numStar + 2;
			}
			
			if(totali > maxdigit)
			{
				zeroremoved = parseFloat(ts).toFixed(maxdigit);
			}
	  }

  }
  return zeroremoved;
}
function setValue(name, value)
{
	value = JSON.stringify(value);
	return localStorage.setItem(name, value);
}
function removeValue(name)
{
	return localStorage.removeItem(name);
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function toQuery(params)
{
	return new URLSearchParams(params).toString();
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getBaseUrl(url, params = undefined){
	let query = "";
	if(params)
	{
		if(typeof params == "object")
		{
			query = "?" + toQuery(params);
		}
		else
		{
			query = "?" + params.toString();
		}
		
	}
    return baseUrl + url + query;
}
function baseApiUrl(url, params = undefined)
{
	return apiUrl( url, params, -1);
}
function apiUrl(url, params = undefined, overArea = undefined){
	let query = "";
	url = url.replace(/^\//gi, "")
	if(params)
	{
		if(typeof params == "object")
		{
			query = "?" + toQuery(params);
		}
		else
		{
			query = "?" + params.toString();
		}
	}
	return baseUrl +  (baseUrl != "/" ?  "/" : "") + url + query;
}

var defaultParameters = {};
var params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => {
	let r = searchParams.get(prop);
	if (r === undefined || r === null) {
		let newVal = defaultParameters[prop];
		if (newVal) {
			return newVal;
		}
		return "";
	}
	return r;
	},
});
function getValue(name, defaultValue)
{
	let item = localStorage.getItem(name);
	if(item === null || item === undefined)
	{
		return defaultValue
	}

	item = JSON.parse(item);
	if(typeof(defaultValue) == "boolean")
	{
		if(item == true || item == "true")
		{
			item = true;
		}
		else
		{
			item = false;
		}
	}
	return item;
}
function offset(el) {
    var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft, leftReal: rect.left, topReal: rect.top }
}
function offsetRect(el)
{
	var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft, height: rect.height, width: rect.width, leftReal: rect.left, topReal: rect.top }
}
function delay(ms){
	return new Promise(r => setTimeout(r, 2000));
}
function waitObject(callback, delay=250)
{
	let curInterval;
	return new Promise(function(r){
		
		curInterval = setInterval(function(){
			let result = callback();
			if(result)
			{
				window.clearInterval(curInterval);
				r();
			}
		}, delay);
		
	})
}

Object.defineProperty(Array.prototype, "Sum", {
	value: function (key, options) {
		let init = false;
		let total = 0;
		let _op = {...options};
		for (let i = 0; i < this.length;i++)
		{
			let cur = this[i];
			let val;
			if(is_array(cur) && _op.recursive)
			{
				val = cur.Sum(key, options);
			}
			else if(is_callable(key))
			{
				val = key(cur, i)
			}
			else{
				val = key ? cur[key] : cur;
			}
			total += (val || 0);
		}
		return total;
	},
	writable: false,
	enumerable: false
});

Object.defineProperty(Date, "FromTicks", {
	value: function (ticks) {
		return dateFromTicks(ticks);
	},
	enumerable: false
});
Object.defineProperty(Array.prototype, "ToObject", {
	value: function (kvs, kvs2) {
		const obj = {}
		for (let i = 0; i < this.length; i++) {
			const item = this[i];
			if (is_callable(kvs)) {
				const r = kvs(item, i)
				if (r)
					obj[r.key] = r.value;
			}
			else {
				obj[item[kvs]] = item[kvs2]
			}

		}
		return obj;
	},
	enumerable: false
});
Object.defineProperty(Object.prototype, "mapObject", {
	value: function (baseObject) {
		return ObjectUtils.toObject(this, baseObject);
	},
	writable: false,
	enumerable: false
});
Object.defineProperty(Array.prototype, "mergeObject", {
	value: function (options) {
		return mergeObject(this, options);
	},
	writable: false,
	enumerable: false
});
Object.defineProperty(Object.prototype, "queryValue", {
	value: function (q) {
		return ObjectUtils.query(this, q);
	},
	writable: false,
	enumerable: false
});
Object.defineProperty(Object.prototype, "queryValueSet", {
	value: function (q, v) {
		return ObjectUtils.querySet(this, q, v);
	},
	writable: false,
	enumerable: false
});

Object.defineProperty(Object.prototype, "DefineProperty", {
	value: function (n, fnOrObj, opts) {

		Object.defineProperty(this, n, {
			get: fnOrObj,
			enumerable: true, 
			configurable: true,
			...opts
		});		
		
	},
	writable: false,
	enumerable: false
});

var ObjectUtils = {
	delimiter: ".",
	query(o, p) {
		if (!o || p === undefined || p === null)
			return;
		const split = p.split(ObjectUtils.delimiter);
		let cur = o;
		for (let i = 0; i < split.length; i++) {
			const s = split[i];
			cur = cur[s];
			if (!cur)
				break;
		}
		return cur;
	},
	querySet(o, p, v) {
		if (!o || p === undefined || p === null)
			return;
		const split = p.split(ObjectUtils.delimiter);
		let cur = o;
		for (let i = 0; i < split.length; i++) {
			const s = split[i];
			if (i == split.length - 1) {
				cur[s] = v;
			}
			else {
				if (!window.is_object(cur[s])) {
					cur[s] = {};
				}
				cur = cur[s];
			}
		}
		return o;
	},
	toObject(strObjectOrArray, baseObject = undefined) {
		if (!strObjectOrArray)
			return;
		const r = baseObject || {};
		const isArray = is_array(strObjectOrArray);
		for (let item in strObjectOrArray) {
			let v = strObjectOrArray[item];
			if (isArray) {
				for (let item2 in v) {
					let v2 = v[item2];
					ObjectUtils.querySet(r, item2, v2)
				}
			}
			else
				ObjectUtils.querySet(r, item, v)
		}
		return r;
	}
}
function TableToObject(table)
{
  let headers = [];
  $('> thead > tr > th', table).each(function() {
    headers.push($(this).text().trim());
  });
  let tableData = [];
  $('> tbody > tr', table).each(function() {
    let rowData = {};
    $(this).find('td').each(function(index) {
      rowData[headers[index]] = $(this).html();
    });
    tableData.push(rowData);
  });
  return tableData;
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function alpha(color, value)
{
	let newA = 1;
	let obj = color.Copy();
	if(is_object(color))
	{
		newA = (color.a || 1) * value; 
		obj.a = newA;
	}
	else
	{
		let parsed = parseColor(color);
		obj = parsed;
		newA = (parsed.a || 1) * value;
		obj.a = newA;
		if(parsed._isHex)
		{
			return rgbToHex(parsed);
		}
	}
	if(obj._hasAlpha)
		return `rgba(${obj.r}, ${obj.g}, ${obj.b}, ${obj.a})`
	return `rgb(${obj.r}, ${obj.g}, ${obj.b})`
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex()
{
	let obj = {};
	if(is_object(arguments[0]))
	{
		obj = arguments[0];
	}
	else{
		obj.r = arguments[0];
		obj.g = arguments[1];
		obj.b = arguments[2];
		obj.a = arguments[2];
	}
	let res = "#" + componentToHex(obj.r) + componentToHex(obj.g) + componentToHex(obj.g) + ((obj.a !== undefined) ? componentToHex(obj.a) : "")
	return res;
}

function parseColor(color) {
  const rgbRegex = /^rgb(a?)\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)$/i;
  const hexRegex = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

  const rgbMatch = color.match(rgbRegex);
  if (rgbMatch) {
    const [, , r, g, b, a] = rgbMatch;
    return {
      r: parseInt(r),
      g: parseInt(g),
      b: parseInt(b),
      a: a ? parseFloat(a) : 1,
	  _hasAlpha: a !== undefined
    };
  }

  const hexMatch = color.match(hexRegex);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = parseInt(hex.slice(6, 8), 16);
    return { r, g, b, a: a ? a / 255 : 1, _isHex: true, _hasAlpha: a !== undefined };
  }

  return null;
}