window.persis_logger = (function(_w, undefined){

var settings = {
	overrideConsole: false,
	showAlert: false,
	logListLimit: 1024,
	logMsgLimit: 1024,
	syncPeriod: 1000, // ms
	verboseLevel: '',
	storageID: ''
};

var noop = function(){};

var Init, RestoreConsole, OverwriteConsole,
	WriteLog = noop;

var extendSettings,
	makeNoopConsole,
	arrangeSync;

var lcl, scl, origConsole, logList,
	inited = false;

extendSettings = function (s){
	for (var name in settings){
		if (s.hasOwnProperty(name)){
			settings[name] = s[name];
		}
	}
	return settings;
};

makeNoopConsole = function(){
	var func_names = ["debug", "log", "info", "warn", "error",
	    "dir", "group", "groupCollapsed", "groupEnd",
	    "time", "timeEnd", "trace" ]
	var ret = {};
	for(var l = func_names.length - 1; l >= 0; --l) {
		ret[func_names[l]] = noop;
	}
	return ret;
};

OverwriteConsole = function(){
	origConsole = _w.console;
	_w.console = makeNoopConsole();

	if (!inited || !lcl || !scl) {
		return False;
	}
	var _log,
		s = settings,
		stor_id = s.storageID,
		msgLmt = s.logMsgLimit,
		listLmt = s.logListLimit,
		cnsl = _w.console;

	_log = WriteLog = function(msg) {
		msg = (new Date().getTime()) + " " +
			msg.slice(0, msgLmt);
		logList.append(msg);
		if (logList.length > listLmt) {
			logList = logList.slice(logList.length - listLmt);
		}
		arrangeSync();
	};

	switch(s.verboseLevel) {
	case 'info':
	case 'log':
		cnsl.log = _log;
		cnsl.info = function(msg){
			_log("Info: " + msg);
		};
	// fallthrough
	case 'warn':
		cnsl.warn = function(msg){
			_log("WARN!: " + msg);
		};

	// fallthrough
	case 'error':
	default:
		cnsl.error = function(msg){
			_log("!ERROR!: " + msg);
		};
	}
	return true;
};

RestoreConsole = function(){
	if (!inited) {
		return;
	}
	_w.console = origConsole;
	origConsole = undefined;
};

Init = function(settings){
	if (inited) {
		return lcl && scl;
	}
	var s = extendSettings(settings);

	if ( (s.logListLimit > 0 && s.logMsgLimit > 0) ) {
		try {
			lcl = _w.localStorage;
			scl = _w.sessionStorage;
		} except( e ) { }
	}

	inited = true;
	logList = [];
	if (s.overrideConsole) {
		OverwriteConsole();
	}

	if (!lcl || !scl) {
		if (s.showAlert) {
			alert("This browser does not support DOM storage!");
		}
		else if (origConsole) {
			origConsole.log("PersistentLogger: This browser "
				"does not support DOM storage!");
		}
		return false;
	}

	var do_sync = function() {
		var to_save = JSON.stringify(logList);
		try {
			lcl.PersistentLog = to_save;
		} except (e) {}
	}

	if (s.syncPeriod > 0) {
		var sync_timeout;
		arrangeSync = function(){
			if(!sync_timeout) {
				setTimeout(do_sync, s.syncPeriod);
			}
		};
	}
	else {
		arrangeSync = do_sync; // writethrough
	}

	return true;
};


return {
	Init: Init,
	OverwriteConsole: OverwriteConsole,
	RestoreConsole: RestoreConsole,
	WriteLog: WriteLog
};

})(window);
