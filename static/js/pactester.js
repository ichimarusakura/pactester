
/* Copyright Stephen Vickers (vortex.is.at@gmail.com) 2012 */

var defaultDns = 
		  "www.test.com 192.168.2.100\n"
		+ "www.google.com 1.1.1.1\n";

var defaultPac = 
		  "function FindProxyForURL (url, host) {\n"
		+ "	if (isInNet (host, \"10.0.0.0\", \"255.0.0.0\")\n"
		+ "			|| isInNet (host, \"172.16.0.0\", \"255.240.0.0\")\n"
		+ "			|| isInNet (host, \"192.168.0.0\", \"255.255.0.0\")\n"
		+ "			|| isPlainHostName (host)\n"
		+ "			|| localHostOrDomainIs (host, \"127.0.0.1\")\n"
		+ "			|| shExpMatch (url, \"http://*.test.com*\")\n"
		+ "			|| shExpMatch (url, \"https://*.test.com*\")) {\n"
		+ "		return \"DIRECT\";\n"
		+ "	}\n"
		+ "\n"
		+ "	return \"PROXY 192.168.2.100:8080;\";\n"
		+ "}";

var dnsMaps = {};
var months  = {JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6,
							AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11};
var myIp    = "127.0.0.1";
var wdays   = {SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6};

// Copied from the HTTP::ProxyPAC::Functions CPAN module.
function dateRange () {
	function getMonth (name) {
		if (name in months) {
			return months[name];
		} else {
			return -1;
		}
	}

	var date = new Date ();
	var argc = arguments.length;
	
	if (argc < 1) {
		return false;
	}
	
	var isGMT = (arguments[argc - 1] == 'GMT');
	if (isGMT) {
		argc--;
	}
	
	// function will work even without explict handling of this case
	if (argc == 1) {
		var tmp = parseInt (arguments[0]);
		
		if (isNaN (tmp)) {
			return ((isGMT ? date.getUTCMonth () : date.getMonth ())
					== getMonth (arguments[0]));
		} else if (tmp < 32) {
			return ((isGMT ? date.getUTCDate () : date.getDate ()) == tmp);
		} else {
			return ((isGMT ? date.getUTCFullYear () : date.getFullYear ())
					== tmp);
		}
	}
	
	var year = date.getFullYear ();
	var date1, date2;
	
	date1 = new Date (year,  0,  1,  0,  0,  0);
	date2 = new Date (year, 11, 31, 23, 59, 59);
	
	var adjustMonth = false;
	
	for (var i = 0; i < (argc >> 1); i++) {
		var tmp = parseInt (arguments[i]);
	
		if (isNaN (tmp)) {
			var mon = getMonth (arguments[i]);
			date1.setMonth (mon);
		} else if (tmp < 32) {
			adjustMonth = (argc <= 2);
			date1.setDate (tmp);
		} else {
			date1.setFullYear (tmp);
		}
	}
	
	for (var i = (argc >> 1); i < argc; i++) {
		var tmp = parseInt (arguments[i]);
		
		if (isNaN (tmp)) {
			var mon = getMonth (arguments[i]);
			date2.setMonth (mon);
		} else if (tmp < 32) {
			date2.setDate (tmp);
		} else {
			date2.setFullYear (tmp);
		}
	}
	
	if (adjustMonth) {
		date1.setMonth (date.getMonth ());
		date2.setMonth (date.getMonth ());
	}
	
	if (isGMT) {
		var tmp = date;
		tmp.setFullYear (date.getUTCFullYear ());
		tmp.setMonth (date.getUTCMonth ());
		tmp.setDate (date.getUTCDate ());
		tmp.setHours (date.getUTCHours ());
		tmp.setMinutes (date.getUTCMinutes ());
		tmp.setSeconds (date.getUTCSeconds ());
		date = tmp;
	}
	
	return ((date1 <= date) && (date <= date2));
}

function dnsDomainIs (host, domain) {
	var index = host.indexOf (domain);
	return index >= 0
			? host.length - index == domain.length
					? true
					: false
			: false;
}

function dnsDomainLevels (host) {
	return host.split (".").length - 1;
}

function dnsResolve (host) {
	if (dnsMaps[host]) {
		return dnsMaps[host];
	} else {
		throw "resolve host '" + host + "' failed: NXDOMAIN";
	}
}

function err (html) {
	$("#result")
			.html (html || "")
			.removeClass ("green")
			.addClass ("red");
}

function ipIsValid (ip) {
	var match = ip.match (/^\s*(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\s*$/);
	if (match) {
		for (i = 1; i < 5; i++) {
			if (match[i] < 0 || match[i] > 255) {
				return false;
			}
		}
		return true;
	} else {
		return false;
	}
}

function ipToDecimal (ip) {
	if (ipIsValid (ip)) {
		ipa = ip.split (".");
		return (((parseInt (ipa[0]) << 24) + (parseInt (ipa[1]) << 16)
				+ (parseInt (ipa[2]) << 8) + parseInt (ipa[3])) >>> 0);
	} else {
		throw "invalid IPv4 address '" + ip + "'";
	}
}

function isInNet (host, pattern, mask) {
	var ip = ipIsValid (host)
			? host
			: dnsResolve (host);

	var ipn   = ipToDecimal (ip);
	var netn  = ipToDecimal (pattern);
	var maskn = ipToDecimal (mask);

	return (((ipn & maskn) >>> 0) == ((netn & maskn) >>> 0));
}

function isPlainHostName (host) {
	return ipIsValid (host)
			? false
			: host.indexOf (".") > 0
					? false
					: true;
}

function isResolvable (host) {
	return dnsMaps[host] ? true : false;
}

function localHostOrDomainIs (host, hostdom) {
	return host == hostdom
			? true
			: hostdom.indexOf (host + ".") == 0;
}

function myIpAddress () {
	return myIp;
}

function ok (html) {
	$("#result")
			.html (html || "")
			.removeClass ("red")
			.addClass ("green");
}

// Copied from the HTTP::ProxyPAC::Functions CPAN module.
function shExpMatch(url, pattern) {
	pattern = pattern.replace (/\\./g, '\\\\.');
	pattern = pattern.replace (/\\*/g, '.*');
	pattern = pattern.replace (/\\?/g, '.');
	var newRe = new RegExp ('^'+pattern+'\$');
	return newRe.test (url);
}

function testPac () {
	var my_ip = $("#my_ip").val ();
	var url   = $("#url").val ();
	var host  = $("#host").val ();
	var pac   = $("#pac").val ();
	var dns   = $("#dns").val ();

	if (url.length && host.length && pac.length) {
		try {
			if (my_ip.length) {
				myIp = my_ip;
				ipToDecimal (myIp);
			}
			
			if (dns.length) {
				var regex = /^\s*(\S+)\s+(\S*)$/;
				var lines = dns.split ("\n");
				var maps = {};

				for (var i = 0; i < lines.length; i++) {
					var match = lines[i].match (regex);
					if (match && match.length == 3) {
						ipToDecimal (match[2]);
						maps[match[1]] = match[2];
					}
				}
				
				dnsMaps = maps;
			}
			
			eval (pac);

			if (! url || ! host) {
				throw "URL and Host are required";
			} else {
				var proxy = FindProxyForURL (url, host);
			}

			ok (proxy);
		} catch (e) {
			err (e.toString ());
		}
	} else {
		ok ();
	}
}

// Copied from the HTTP::ProxyPAC::Functions CPAN module.
function timeRange () {
	var argc = arguments.length;
	var date = new Date ();
	var isGMT= false;

	if (argc < 1) {
		return false;
	}
	
	if (arguments[argc - 1] == 'GMT') {
		isGMT = true;
		argc--;
	}

	var hour = isGMT ? date.getUTCHours () : date.getHours ();
	var date1, date2;
	
	date1 = new Date ();
	date2 = new Date ();

	if (argc == 1) {
		return (hour == arguments[0]);
	} else if (argc == 2) {
		return ((arguments[0] <= hour) && (hour <= arguments[1]));
	} else {
		switch (argc) {
			case 6:
				date1.setSeconds (arguments[2]);
				date2.setSeconds (arguments[5]);
			case 4:
				var middle = argc >> 1;
				date1.setHours (arguments[0]);
				date1.setMinutes (arguments[1]);
				date2.setHours (arguments[middle]);
				date2.setMinutes (arguments[middle + 1]);
				if (middle == 2) {
					date2.setSeconds (59);
				}
				break;
			default:
				throw 'timeRange: bad number of arguments'
		}
	}
	
	if (isGMT) {
		date.setFullYear (date.getUTCFullYear ());
		date.setMonth (date.getUTCMonth ());
		date.setDate (date.getUTCDate ());
		date.setHours (date.getUTCHours ());
		date.setMinutes (date.getUTCMinutes ());
		date.setSeconds (date.getUTCSeconds ());
	}
	
	return ((date1 <= date) && (date <= date2));
}

// Copied from the HTTP::ProxyPAC::Functions CPAN module.
function weekdayRange () {
	function getDay (weekday) {
		if (weekday in wdays) {
			return wdays[weekday];
		} else {
			return -1;
		}
	}
	
	var date = new Date ();
	var argc = arguments.length;
	var wday;
	
	if (argc < 1)
		return false;
	
	if (arguments[argc - 1] == 'GMT') {
		argc--;
		wday = date.getUTCDay ();
	} else {
		wday = date.getDay ();
	}
	
	var wd1 = getDay (arguments[0]);
	var wd2 = (argc == 2) ? getDay (arguments[1]) : wd1;
	
	return (wd1 == -1 || wd2 == -1)
			? false
			: (wd1 <= wday && wday <= wd2);
}

$(document).ready (function (){
	$.get ("/version.txt", function (version) {
		$("#version").html ("PAC Tester - " + version);
	}, "html");

	$("#pac").change (function () {
		testPac ();
	}).val (defaultPac).tabby ();

	$("#dns").change (function () {
		testPac ();
	}).val (defaultDns).tabby ();

	$("#my_ip").change (function () {
		testPac ();
	});

	$("#url").change (function () {
		var host = $("#url").val ();
		var i = host.indexOf ("://");
		if (i > 0) {
			host = host.substring (i + 3);
		}
		i = host.indexOf ("/");
		if (i > 0) {
			host = host.substring (0, i);
		}
		$("#host").val (host);
		testPac ();
	});

	$("#host").change (function () {
		testPac ();
	});
});
