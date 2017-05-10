'use strict';

var cB = {
  SQUARE_SIZE: 40,
  
  spriteLoaded: false,
  
  initTimer: undefined,
  
  initCounter: 0,
  
  
  spritePositions: {
    b: 0,
    k: 45,
    n: 90,
    p: 135,
    q: 180,
    r: 225,
    B: 270,
    K: 315,
    N: 360,
    P: 405,
    Q: 450,
    R: 495
  },
  
  FENPos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",

  matrix: (() => { //TODO: Matrix to fen!
    //administration of position vi FEN String
    let m = [];
    for(let i = 0; i < 8; i++) {
      m[i] = ['','','','','','','',''];
    }
    return m;
  })(),

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
    if (cB.spriteLoaded) {
      cB.board = document.querySelector('#board');
      cB.context = cB.board.getContext('2d');
      cB.context.scale(cB.SQUARE_SIZE, cB.SQUARE_SIZE);
      cB.FENPosToMatrix();
      cB.drawLabels();
      cB.addEvents();
      $('#FENPos').val(cB.FENPos);
    } else if (cB.initCounter++ > 40) {
      clearTimeout(cB.initTimer);
      $('#content').text('KANN SPRITE NICHT LADEN!');
    } else {
      cB.initTimer = setTimeout(cB.init, 100);
    }
    
    $('#go').on('click', function () {
      cB.setFenPos($('#FENPos').val());
    });
  },

  move: (from, to) => { //e.g. 'd4', 'd5'
    let [fromCol, fromRow] = from.split(''),
        [toCol, toRow] = to.split(''),
        fromX = cB.indexForColLetter(fromCol),
        fromY = cB.indexForRowNumber(fromRow),
        toX = cB.indexForColLetter(toCol),
        toY = cB.indexForRowNumber(toRow),
        imgkey = cB.matrix[fromY][fromX];

    cB.xyDraw(fromX, fromY, 1, 1);
    if (imgkey) {
      cB.xyDraw(toX, toY, 1, 1, imgkey);
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
          moveImgKey = cB.getImgKeyForXY(x, y);
      
      if(moveImgKey) {
        cB.mouseStatus = {
                                   mousedown: 1,
                                   x: x,
                                   y: y,
                                   imgKey: moveImgKey
        };

        e.stopPropagation();

        $('#mover').css({
          'visibility':          'visible',
          'left':                (e.clientX - 20) + 'px',
          'top':                 (e.clientY - 20) + 'px',
          'width':               cB.SQUARE_SIZE + 'px',
          'height':              cB.SQUARE_SIZE + 'px',
          'background':          'url(./img/sprite.png)',
          'background-position': '0 -'+ cB.spritePositions[moveImgKey]  + 'px',
          'overflow':            'hidden'
        });

        cB.xyDraw(x, y, 1, 1);
      }
    });
    $(document).on('mouseup', (e) => {
      let [x, y] = cB.getXYForEvent(e);
      if(x > -1 && x < 8 && y > -1 && y < 8) {
        cB.xyDraw(x, y, 1, 1, cB.mouseStatus.imgKey);
      } else {
        cB.xyDraw(cB.mouseStatus.x, cB.mouseStatus.y, 1, 1, cB.mouseStatus.imgKey);
      }
      $('#mover').
        css({
          'left': '350px',
          'top': '350px',
          'visibility': 'hidden'}).
        empty();
      cB.mouseStatus = {mousedown: 0};
    });

    $(document).on('mousemove', (e) => {
      e.preventDefault();
      if (cB.mouseStatus.mousedown) {
        e.stopPropagation();
        $('#mover').css({'left': (e.clientX - cB.SQUARE_SIZE/2) + 'px',
                         'top': (e.clientY - cB.SQUARE_SIZE/2) + 'px'});
      }
    });
  },

  rowColDraw: (col, row, w, h, imgkey) => {
    let [x, y] = [cB.indexForColLetter(col), cB.indexForRowNumber(row)];
    cB.context.fillRect(x, y, 1, 1);
    if(imgkey) {
      cB.context.drawImage(cB.sprite, 0, cB.spritePositions[imgkey],
                           cB.SQUARE_SIZE, cB.SQUARE_SIZE, x, y, w, h);
    }
  },

  xyDraw: (x, y, w, h, imgkey) => {
    if(x > -1 && x < 8 && y > -1 && y < 8 ) {
      cB.context.fillStyle = (x + y) % 2 ? 'lightblue' : 'lightgray';
      cB.context.fillRect(x, y, w, h);
      if(imgkey) {
        cB.context.drawImage(cB.sprite, 0, cB.spritePositions[imgkey], 
                             cB.SQUARE_SIZE, cB.SQUARE_SIZE, x, y, w, h);
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
    
    ctx.scale(1/cB.SQUARE_SIZE, 1/cB.SQUARE_SIZE);
    ctx.fillStyle = 'black';
    ctx.font = '24px serif';
    
    $.each('abcdefgh'.split(''), (idx, val) => {
      ctx.fillText(val, idx * cB.SQUARE_SIZE + 11, 345);
    });
    
    $.each('12345678'.split(''), (idx, val) => {
      ctx.fillText(val, 329, idx * cB.SQUARE_SIZE + 32);
    });
    
    ctx.scale(cB.SQUARE_SIZE, cB.SQUARE_SIZE);
  },
  getXYSquareForPx: (left, top) => {
    return [Math.floor(left / cB.SQUARE_SIZE), Math.floor(top / cB.SQUARE_SIZE)];
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
      case 3:
        pos = 'rnq2rk1/1pn12bp/p2p2p1/2pPp1PP/P1P1Pp2/2N2N2/1P1B1P2/R2QK2R';
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
  }
  

};

var sprite = new Image();
$(sprite).attr('src', './img/sprite.png').
  css({ 
    width:  cB.SQUARE_SIZE + 'px',
    height: (cB.SQUARE_SIZE * 12) + '480px' });
$(sprite).on('load', () => {
  cB.spriteLoaded = true;
});
cB.sprite = sprite;

$(document).ready(function  () {
  cB.init();
});