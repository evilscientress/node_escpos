var EscPos = require('./commands');
var Concentrate = require("concentrate");

var c = Concentrate();
c.buffer(EscPos.reset());
c.buffer(EscPos.setCharacterSize(2)).buffer(EscPos.setPrintSpeed(1))
for (var i = 0; i < 2; i++) {
  c.buffer(EscPos.selectFont(i)).string('Font ' + i + '\n');
  c.string('ABCDEFGHIJKLMNOPQRSTUVWXYZ\n').string('abcdefghijklmnopqrstuvwxyz\n').string('0123456789\n');
};
c.buffer(EscPos.setUnderline(1)).buffer(EscPos.text('Unterstrichen\n')).buffer(EscPos.setUnderline(0));
c.buffer(EscPos.setEmphasized(1)).buffer(EscPos.text('Fett\n')).buffer(EscPos.setEmphasized(0));


c.buffer(EscPos.cut(250));
process.stdout.write(c.result());
