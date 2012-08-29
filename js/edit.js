/**
 * @author ZhangRui
 */

$(function() {

	function ltrim(s) {
		return s.replace(/^\s*/, "");
	}

	// 去右空格;
	function rtrim(s) {
		return s.replace(/\s*$/, "");
	}

	// 去左右空格;
	function trim(s) {
		return rtrim(ltrim(s));
	}

});
