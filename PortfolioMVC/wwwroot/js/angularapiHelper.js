class ApiBuilder{
	constructor(props){
		this.$http = props.$http;
		this.apiUtils = props.apiUtils;
		this._apiData = {};
	}
	fileRequest(progress){
		this._apiData.fileRequest = true;
		if(progress)
		{
			this._apiData.uploadEventHandlers = {
				progress: progress
			}
		}
		this.withHeaders({
			'Content-Type': undefined
		});
		return this;
	}
	withQ(q){
		this.$q = q;
		return this;
	}
	withMethod(m) {
		this._apiData.method = m;
		return this;
	}
	withQuery(m) {
		this._apiData.params = m;
		return this;
	}
	withData(m) {
		this._apiData.data = m;
		return this;
	}
	withHeaders(m) {
		this._apiData.headers = m;
		return this;
	}
	withPath(m, query = undefined) {
		return this.withUrl(m, true, query);
	}
	withCredentials(m) {
		this._apiData.withCredentials = m;
		return this;
	}
	withUrl(m, ispath = false, query) {
		if(ispath)
			this._apiData.url = apiUrl(m);
		else
			this._apiData.url = m;
		if(query)
		{
			this._apiData.params = m;
		}
		return this;
	}
	_build() {
		let cloned = this._apiData.Copy();
		if(cloned.method.toLowerCase() == "get"){
			if(!cloned.params)
			{
				cloned.params = cloned.data;
			}
		}
		return cloned;
	}
	send(resultCb) {
		let props = {
			obj: this._build(),
			$http: this.$http,
			$q: this.$q,
			callback: resultCb,
			control: false
		}
		return this.apiUtils._send(props);
	}
	sendControl(resultCb)
	{
		let props = {
			obj: this._build(),
			$http: this.$http,
			$q: this.$q,
			callback: resultCb,
			control: true
		}
		return this.apiUtils._send(props);
	}
}

class _ApiUtils{
	
	constructor(props)
	{
		this._$http = props.$http;
		this._LockItem = {
			count: 0,
			max: 3,
			lt: null
		};
		this.defaultHeaders = async function(){
			return Promise.resolve({});
		};
	}
	async _send(props) {
		let obj = props.obj;
		let $http = props.$http;
		let $q = props.$q;
		let deferred = $q && $q.defer();
		let control = props.control;
		let callback = props.callback;

		//await this._lock();
		let defHeaders = await this.defaultHeaders();
		let newHeaders = obj.headers;
		if (obj.headers && defHeaders)
		  newHeaders = Object.assign(defHeaders, newHeaders);
		else if (defHeaders)
		  newHeaders = defHeaders
		obj.headers = newHeaders;
		let $this = this;

		let httpSender = ($http || this._$http);
		return httpSender(obj, function(r){
			return r;
		}, function(r){
			return r;
		}).catch(function(e){
			return e;
		}).then(function(r){
			let dData = r.data;
			if(control)
			{
				dData = $this.responseControl(r, undefined, true);
			}
			let cr = undefined;
			if(callback)
				cr = callback(dData, r);
			let resp = cr !== undefined ? cr : r;
			deferred && deferred.resolve(resp);
			return resp;
		});;
		return r;
	}
	async _lock() {
		if (this._LockItem.count >= this._LockItem.max) {
		  await new Promise((r) => {
			(async () => {
			  while (this._LockItem.count >= this._LockItem.max) {
				await window.delay(100);
				if ((Date.now() - this._LockItem.lt) > 1000) {
				  this._LockItem.count = 0;
				  continue;
				}
			  }
			  r();
			})();
		  });
		}
		this._LockItem.lt = Date.now();
		this._LockItem.count++;
		return;
	}
	async _release() {
	}
	
	responseControl(response, cache, onlyOk = false) {
		let error = "";

		const checkProps = ["MessageKey", "Message", "message", "Error", "error"]
		let isKey = false;
		let namedArgs;

		if (!response) {
			return {
				Error: cache ? cache.tr("General.ErrorNoRespnseFound") : "Error No Response Found"
			};
		}
		let errorObject;
		if (response.response) {
			errorObject = response;
			response = response.response;
		}
		isKey = response.data && response.data.MessageKey;
		if (isKey)
			namedArgs = response.data.NamedArgs;
		if (response.status == 200) {
			if (onlyOk || (response.data && (response.data.success || response.data.Success))) {
				fixJsonForSerialize(response.data)
				return response.data;
			}
			else {
				if (response.data) {
					for (let i = 0; i < checkProps.length; i++) {
						error = response.data[checkProps[i]];
						if (error) break;
					}
				}
				if (!error) {
					error = cache ? cache.tr("General.ErrorOccurred") : "Error Occurred";
				}
			}
		}
		else {

			if (response.data) {
				error = response.data.GetAny(checkProps);

			}
			if (!error)
				error = errorObject && errorObject.message ? errorObject.message : response.statusText;
		}
		if (isKey) {
			error = cache ? cache.tr("ServerMessage." + error, namedArgs) : error;
		}
		if (!error) {
			error = cache ? cache.tr("General.ErrorOccurred") : "Error Occurred";
		}

		return {
			Error: error,
			Success: false,
			StatusCode: response.status
		};
	}
}

function applyApiHelper(httpProto, $http, $rootScope)
{
	const apiUtils = new _ApiUtils($http);
	httpProto.rest = function(method)
	{
		return new ApiBuilder({
			$http: this,
			apiUtils: apiUtils
		}).withMethod(method);
	}
}

(function(){
	let $rootScope = angular.injector(["ng"]).get("$rootScope")
	let $http = angular.injector(["ng"]).get("$http");
	let httpProto = $http.constructor.prototype;
	applyApiHelper(httpProto, $http, $rootScope);
})()