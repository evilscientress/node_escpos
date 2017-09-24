/*
 * ESC/POS Commands
 */

var Concentrate = require('concentrate');
var iconv = require('iconv-lite');


var _= {
	"HT": '\x09',
	"LF": '\x0a',
	"FF": '\x0c',
	"CR": '\x0d',
	"DLE": '\x10',
	"CAN": '\x18',
	"ESC": '\x1b',
	"FS": '\x1c',
	"GS": '\x1d',
};

//Print Commands
_.print = {
	"pageReturn": _.FF,
	"page": _.ESC + '\x0c',
	"feed": _.ESC + 'J',
	"printReverseFeed": _.ESC + 'K',
	"printFeedLines": _.ESC + 'd',
	"printReverseFeedLines": _.ESC + 'e',
	"cancel": _.CAN
};

//Line Spacing Commands
_.lines_spaceing = {
	"default": _.ESC + '2',
	"set": _.ESC + '3',
};

//Character Commands
_.character = {
	"setRightSideSpacing": _.ESC + '\x20',
	"selectMode": _.ESC + '!',
	"setUnderline": _.ESC + '-',
	"setEmphasized": _.ESC + 'E',
	"setDoubleStrike": _.ESC + 'G',
	"setRotationCW": _.ESC + 'V',
	"setUpsideDown": _.ESC + '{',
	"setReverseMode": _.GS + 'B',
	"setSmoothingMode": _.GS + 'b',
	"selectFont": _.ESC + 'M',
	"selectCharacterSize": _.GS + '!',
	"selectInternationalCharacterSet": _.ESC + 'R',
	"selectCharacterCodeTable": _.ESC + 't',
	"setJustification": _.ESC + 'a',
};

//Line Justification
_.justification = {
	"left": 0,
	"centered": 1,
	"right": 2
};

_.qr = {
	"model": {
		"1": 0x31,
		"2": 0x32,
		"micro": 0x33
	},
	"errorCorrectionLevel": {
		"L": 48,
		"M": 49,
		"Q": 50,
		"H": 51
	}
};


//functions

_.reset = function() {
	return Concentrate().string(_.ESC + '@\n').result();
};

_.setJustification = function(justification) {
	return Concentrate().string(_.character.setJustification).uint8(justification).result();
};

_.setEmphasized = function(emphasized) {
	return Concentrate().string(_.character.setEmphasized).uint8(emphasized).result();
};

_.setUnderline = function(underline) {
	return Concentrate().string(_.character.setUnderline).uint8(underline).result();
};

_.setDoubleStrike = function(doubleStrike) {
	return Concentrate().string(_.character.setDoubleStrike).uint8(doubleStrike).result();
};

_.setCharacterSize = function(width, height) {
	width -= 1;
	if (typeof height == "undefined") height = width;
	return Concentrate().string(_.character.selectCharacterSize).uint8( ((width & 0x07)<<4) | (height & 0x07)).result();
}

_.selectFont = function(font) {
	return Concentrate().string(_.character.selectFont).uint8(font).result();
}

_.setPrintSpeed = function(speed) {
	if (speed > 13) speed = 13;
  return Concentrate().string(_.GS+'(k').uint8(2).uint8(0).uint8(0x32).uint8(speed).result();	
}

_.text = function(text) {
	return iconv.encode(text, '437');
};

_.cut = function(feed, partial) {
	if (typeof feed == "undefined") feed = 0;
	if (typeof partial == "undefined") partial = 1;
	var c = Concentrate();
	c.string(_.GS + 'V');
	if (feed > 0) {
		if (partial) {
			c.uint8(66);
		} else {
			c.uint8(65);
		}
		c.uint8(feed);
	} else {
		if (partial) {
			c.uint8(49);
		} else {
			c.uint8(48);
		}
	}
	return c.result();
};

_.automaticStatus = function(mode) {
	return Concentrate().string(_.FS+'(e').uint8(2).uint8(0).uint8(51).uint8(n).result();
};

_.automaticStatusEnable = function () {
	return _.automaticStatus(0x08);
};

_.automaticStatusDisable = function () {
	return _.automaticStatus(0x08);
}

_.sendBarcodeCommand = function(cn, fn, parameters) {
	var len = parameters.length + 2;
	return Concentrate().string(_.GS+'(k').uint8(len & 0xff).uint8((len>>8) & 0xff).uint8(cn).uint8(fn).buffer(parameters).result();
};

_.qrSetModel = function(model) {
	return _.sendBarcodeCommand(0x31, 0x41, Concentrate().uint8(model).uint8(0).result());
};
_.qrSetSize = function(size) {
	return _.sendBarcodeCommand(0x31, 0x43, Concentrate().uint8(size).result());
};
_.qrSetErrorCorrectionLevel = function(level) {
	return _.sendBarcodeCommand(0x31, 0x45, Concentrate().uint8(level).result());
};
_.qrStore = function(value) {
	return _.sendBarcodeCommand(0x31, 0x50, Concentrate().uint8(0x30).string(value).result());
};
_.qrPrint = function() {
	return _.sendBarcodeCommand(0x31, 0x51, Concentrate().uint8(48).result()) ;
};

module.exports = _;