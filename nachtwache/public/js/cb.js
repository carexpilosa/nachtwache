/*jshint esversion: 6 */
/* jshint strict: true */
/*globals $:false */
/*globals document:false */
/*globals console:false */
'use strict';

var cB = {
  imgSrcs: {r: './img/bR.png',
            n: './img/bN.png',
            b: './img/bB.png',
            q: './img/bQ.png',
            k: './img/bK.png',
            p: './img/bP.png',
            R: './img/wR.png',
            N: './img/wN.png',
            B: './img/wB.png',
            Q: './img/wQ.png',
            K: './img/wK.png',
            P: './img/wP.png'},

  FENPos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",

  matrix: (function () { //TODO: Matrix to fen!
    //administration of position vi FEN String
    var m = [];
    for(var i = 0; i < 8; i++) {
      m[i] = ['','','','','','','',''];
    }
    return m;
  }()),

  imgObjs: {},

  mouseStatus: {},

  FENPosToMatrix: function () {
    var rows = this.FENPos.split('/');
    rows.forEach(function (row, y) {
      var x = 0;
      var pieces = row.split('');
      pieces.forEach(function (p) {
        if (p.match(/\d/)) {
          var toX = x+parseInt(p);
          while(x < toX) {
            cB.rawDraw(x++, y, 1, 1);
          }
        } else if (p.match(/[rnbqkpRNBQKP]/)) {
          cB.rawDraw(x, y, 1, 1, p);
          x++;
        } else {
          x++;
        }
      });
    });
  },

  init: function () {
    this.board = document.querySelector('#board');
    this.context = this.board.getContext('2d');
    this.context.scale(40, 40);
    this.FENPosToMatrix();
    this.drawLabels();
    this.addEvents();
    $('#FENPos').val(this.FENPos);
  },

  move: function (from, to) { //e.g. 'd4', 'd5'
    console.log(from,to);
    var [fromCol, fromRow] = from.split('');
    var [toCol, toRow] = to.split('');
    console.log(fromCol, fromRow, toCol, toRow);
    var fromX = cB.indexForColLetter(fromCol);
    var fromY = cB.indexForRowNumber(fromRow);
    var toX = cB.indexForColLetter(toCol);
    var toY = cB.indexForRowNumber(toRow);
    console.log(fromX,fromY,toX,toY);
    console.table(cB.matrix);
    var imgSrc = cB.matrix[fromY][fromX];
    console.log(imgSrc);
    cB.rawDraw(fromX, fromY, 1, 1);

    console.log(fromX, fromY, imgSrc);
    if (imgSrc) {
      cB.rawDraw(toX, toY, 1, 1, imgSrc);
    }
  },

  getCoords: function (e) {
    var xPos = e.clientX - parseInt($('#board').css('left'));
    var yPos = e.clientY - parseInt($('#board').css('top'));
    return cB.getSquareForCoordinates(xPos, yPos);
  },

  getXY: function (e) {
    var xPos = e.clientX - parseInt($('#board').css('left'));
    var yPos = e.clientY - parseInt($('#board').css('top'));
    return cB.getRawSquareForCoordinates(xPos, yPos);
  },

  getImgKeyForXY: function (x, y) {
    return cB.matrix[y][x];
  },

  addEvents: function () {
    this.board.addEventListener('mousedown', function (e) {
      var [x, y] = cB.getXY(e);
      var moveImgKey = cB.getImgKeyForXY(x, y);
      var moveImg = cB.imgObjs[moveImgKey];
      cB.mouseStatus = {
                                 mousedown: 1,
                                 x: x,
                                 y: y,
                                 imgKey: moveImgKey
      };

      e.stopPropagation();

      $('#mover').append(moveImg);

      $('#mover').css({
                        'visibility': 'visible',
                        'left': (e.clientX - 20) + 'px',
                        'top': (e.clientY - 20) + 'px'
                      });
      cB.rawDraw(x, y, 1, 1);
    });
    document.addEventListener('mouseup', function (e) {
      var [x, y] = cB.getXY(e);
      if(x > -1 && x < 8 && y > -1 && y < 8) {
        cB.rawDraw(x, y, 1, 1, cB.mouseStatus.imgKey);
      } else {
        cB.rawDraw(cB.mouseStatus.x, cB.mouseStatus.y, 1, 1, cB.mouseStatus.imgKey);
      }
      $('#mover').css({'left': '350px', 'top': '350px' });
      $('#mover').empty();
      cB.mouseStatus = {mousedown: 0};
    });

    document.addEventListener('mousemove', function (e) {
      e.preventDefault();
      if (cB.mouseStatus.mousedown) {
        e.stopPropagation();
        $('#mover').css({
                          'left': (e.clientX - 20) + 'px',
                          'top': (e.clientY - 20) + 'px'
                      });
      }
    });
  },

  draw: function(col, row, w, h, imgkey) {
    this.context.fillRect(this.indexForColLetter(col), this.indexForRowNumber(row), 1, 1);
    if(imgkey) {
      this.context.drawImage(this.imgObjs[imgkey], col, row, w, h);
    }
  },

  rawDraw: function (x, y, w, h, imgkey) {
    if(x > -1 && x < 8 && y > -1 && y < 8 ) {
      this.context.fillStyle = (x + y) % 2 ? 'lightblue' : 'lightgray';
      this.context.fillRect(x, y, w, h);
      if(imgkey) {
        var img = this.imgObjs[imgkey];
        this.context.drawImage(img, x, y, w, h);
        this.matrix[y][x] = imgkey;
      } else {
        this.matrix[y][x] = '';
      }
    }
  },

  indexForColLetter: function (colLetter) {
    return 'abcdefgh'.indexOf(colLetter.toLowerCase());
  },

  indexForRowNumber: function (rowNumber) {
    return 8 - rowNumber;
  },

  colLetterForIndex: function (idx) {
    return 'abcdefgh'.split('')[idx];
  },

  rowNumberForIndex: function (idx) {
    return 8 - idx;
  },

  drawLabels: function () {
    var ctx = this.context;
    ctx.scale(0.025, 0.025);
    ctx.fillStyle = 'black';
    ctx.font = '32px serif';
    'abcdefgh'.split('').forEach(function (val, idx) {
      ctx.fillText(val, idx * 40 + 9, 345);
    });
    '12345678'.split('').forEach(function (val, idx) {
      ctx.fillText(val, 329, idx * 40 + 32);
    });
    ctx.scale(40, 40);
  },
  getRawSquareForCoordinates: function (left, top) {
    return [Math.floor(left / 40), Math.floor(top / 40)];
  },
  getSquareForCoordinates: function (left, top) {
    var xyArray = cB.getRawSquareForCoordinates(left, top);
    return [cB.colLetterForIndex(xyArray[0]),
            cB.rowNumberForIndex(xyArray[1])];
  }
};

for (var key in cB.imgSrcs) {
  var pic = new Image();
  pic.src = cB.imgSrcs[key];
  pic.style.width = '40px';
  pic.style.height = '40px';
  cB.imgObjs[key] = pic;
}