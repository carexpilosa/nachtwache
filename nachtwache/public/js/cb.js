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

  matrix: (() => { //TODO: Matrix to fen!
    //administration of position vi FEN String
    let m = [];
    for(let i = 0; i < 8; i++) {
      m[i] = ['','','','','','','',''];
    }
    return m;
  })(),

  imgObjs: {},

  mouseStatus: {},

  FENPosToMatrix: () => {
    let rows = cB.FENPos.split('/');
    $.each(rows, (y, row) => {
      let x = 0,
          pieces = row.split('');
      $.each(pieces, (_, p) => {
        if (p.match(/\d/)) {
          let toX = x+parseInt(p);
          while(x < toX) {
            cB.xyDraw(x++, y, 1, 1);
          }
        } else if (p.match(/[rnbqkpRNBQKP]/)) {
          cB.xyDraw(x, y, 1, 1, p);
          x++;
        } else {
          x++;
        }
      });
    });
  },

  init: () => {
    cB.board = document.querySelector('#board');
    cB.context = cB.board.getContext('2d');
    cB.context.scale(40, 40);
    cB.FENPosToMatrix();
    cB.drawLabels();
    cB.addEvents();
    $('#FENPos').val(cB.FENPos);
  },

  move: (from, to) => { //e.g. 'd4', 'd5'
    let [fromCol, fromRow] = from.split(''),
        [toCol, toRow] = to.split(''),
        fromX = cB.indexForColLetter(fromCol),
        fromY = cB.indexForRowNumber(fromRow),
        toX = cB.indexForColLetter(toCol),
        toY = cB.indexForRowNumber(toRow),
        imgSrc = cB.matrix[fromY][fromX];

    cB.xyDraw(fromX, fromY, 1, 1);
    if (imgSrc) {
      cB.xyDraw(toX, toY, 1, 1, imgSrc);
    }
  },

  getColRowForEvent: (e) => {
    let xPos = e.clientX - parseInt($('#board').css('left')),
        yPos = e.clientY - parseInt($('#board').css('top'));
    return cB.getSquareForPx(xPos, yPos);
  },

  getXYForEvent: (e) => {
    let xPos = e.clientX - parseInt($('#board').css('left')),
        yPos = e.clientY - parseInt($('#board').css('top'));
    return cB.getXYSquareForPx(xPos, yPos);
  },

  getImgKeyForXY: (x, y) => {
    return cB.matrix[y][x];
  },

  addEvents: () => {
    $('#board').on('mousedown', (e) => {
      let [x, y] = cB.getXYForEvent(e),
          moveImgKey = cB.getImgKeyForXY(x, y),
          moveImg = cB.imgObjs[moveImgKey];
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
      cB.xyDraw(x, y, 1, 1);
    });
    $(document).on('mouseup', (e) => {
      let [x, y] = cB.getXYForEvent(e);
      if(x > -1 && x < 8 && y > -1 && y < 8) {
        cB.xyDraw(x, y, 1, 1, cB.mouseStatus.imgKey);
      } else {
        cB.xyDraw(cB.mouseStatus.x, cB.mouseStatus.y, 1, 1, cB.mouseStatus.imgKey);
      }
      $('#mover').css({'left': '350px', 'top': '350px' });
      $('#mover').empty();
      cB.mouseStatus = {mousedown: 0};
    });

    $(document).on('mousemove', (e) => {
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

  rowColDraw: (col, row, w, h, imgkey) => {
    cB.context.fillRect(cB.indexForColLetter(col), cB.indexForRowNumber(row), 1, 1);
    if(imgkey) {
      cB.context.drawImage(cB.imgObjs[imgkey], col, row, w, h);
    }
  },

  xyDraw: (x, y, w, h, imgkey) => {
    if(x > -1 && x < 8 && y > -1 && y < 8 ) {
      cB.context.fillStyle = (x + y) % 2 ? 'lightblue' : 'lightgray';
      cB.context.fillRect(x, y, w, h);
      if(imgkey) {
        let img = cB.imgObjs[imgkey];
        cB.context.drawImage(img, x, y, w, h);
        cB.matrix[y][x] = imgkey;
      } else {
        cB.matrix[y][x] = '';
      }
    }
  },

  indexForColLetter: (colLetter) => {
    return 'abcdefgh'.indexOf(colLetter.toLowerCase());
  },

  indexForRowNumber: (rowNumber) => {
    return 8 - rowNumber;
  },

  colLetterForIndex: (idx) => {
    return 'abcdefgh'.split('')[idx];
  },

  rowNumberForIndex: (idx) => {
    return 8 - idx;
  },

  drawLabels: () => {
    let ctx = cB.context;
    ctx.scale(1/40, 1/40);
    ctx.fillStyle = 'black';
    ctx.font = '32px serif';
    
    $.each('abcdefgh'.split(''), (idx, val) => {
      ctx.fillText(val, idx * 40 + 9, 345);
    });
    
    $.each('12345678'.split(''), (idx, val) => {
      ctx.fillText(val, 329, idx * 40 + 32);
    });
    
    ctx.scale(40, 40);
  },
  getXYSquareForPx: (left, top) => {
    return [Math.floor(left / 40), Math.floor(top / 40)];
  },
  getSquareForPx: (left, top) => {
    let xyArray = cB.getXYSquareForPx(left, top);
    return [cB.colLetterForIndex(xyArray[0]),
            cB.rowNumberForIndex(xyArray[1])];
  },
  
  newFenPos: (posId) => {
    let pos;
    switch(posId) {
      case 1:
        pos = 'r1bqkb1r/1b1n1pp1/p2ppn1p/8/3NP2B/2N2Q2/PPP2PPP/2KR1B1R';
        break;
      case 2:
        pos = 'r3r1k1/2q1bpp1/p1Ppbn1p/np2p3/P3P3/2P2N1P/1PBN1PP1/R1BQR1K1/2KR1B1R';
        break;
      default:
        pos = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
    }
    cB.setFenPos(pos);
  },
  
  setFenPos: (pos) => {
    cB.FENPos = pos;
    $('#FENPos').val(pos);
    cB.FENPosToMatrix();
  },
  

};

for (let key in cB.imgSrcs) {
  let pic = new Image();
  $(pic).attr('src', cB.imgSrcs[key]).
         css({width: '40px', height: '40px'});
  cB.imgObjs[key] = pic;
}