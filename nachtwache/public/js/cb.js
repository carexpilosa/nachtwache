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
    console.log(from,to);
    let [fromCol, fromRow] = from.split('');
    let [toCol, toRow] = to.split('');
    console.log(fromCol, fromRow, toCol, toRow);
    let fromX = cB.indexForColLetter(fromCol);
    let fromY = cB.indexForRowNumber(fromRow);
    let toX = cB.indexForColLetter(toCol);
    let toY = cB.indexForRowNumber(toRow);
    console.log(fromX,fromY,toX,toY);
    console.table(cB.matrix);
    let imgSrc = cB.matrix[fromY][fromX];
    console.log(imgSrc);
    cB.rawDraw(fromX, fromY, 1, 1);

    console.log(fromX, fromY, imgSrc);
    if (imgSrc) {
      cB.rawDraw(toX, toY, 1, 1, imgSrc);
    }
  },

  getCoords: (e) => {
    let xPos = e.clientX - parseInt($('#board').css('left'));
    let yPos = e.clientY - parseInt($('#board').css('top'));
    return cB.getSquareForCoordinates(xPos, yPos);
  },

  getXY: (e) => {
    let xPos = e.clientX - parseInt($('#board').css('left'));
    let yPos = e.clientY - parseInt($('#board').css('top'));
    return cB.getRawSquareForCoordinates(xPos, yPos);
  },

  getImgKeyForXY: (x, y) => {
    return cB.matrix[y][x];
  },

  addEvents: () => {
    cB.board.addEventListener('mousedown', (e) => {
      let [x, y] = cB.getXY(e);
      let moveImgKey = cB.getImgKeyForXY(x, y);
      let moveImg = cB.imgObjs[moveImgKey];
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
    document.addEventListener('mouseup', (e) => {
      let [x, y] = cB.getXY(e);
      if(x > -1 && x < 8 && y > -1 && y < 8) {
        cB.rawDraw(x, y, 1, 1, cB.mouseStatus.imgKey);
      } else {
        cB.rawDraw(cB.mouseStatus.x, cB.mouseStatus.y, 1, 1, cB.mouseStatus.imgKey);
      }
      $('#mover').css({'left': '350px', 'top': '350px' });
      $('#mover').empty();
      cB.mouseStatus = {mousedown: 0};
    });

    document.addEventListener('mousemove', (e) => {
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

  draw: (col, row, w, h, imgkey) => {
    cB.context.fillRect(cB.indexForColLetter(col), cB.indexForRowNumber(row), 1, 1);
    if(imgkey) {
      cB.context.drawImage(cB.imgObjs[imgkey], col, row, w, h);
    }
  },

  rawDraw: (x, y, w, h, imgkey) => {
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
    ctx.scale(0.025, 0.025);
    ctx.fillStyle = 'black';
    ctx.font = '32px serif';
    'abcdefgh'.split('').forEach((val, idx) => {
      ctx.fillText(val, idx * 40 + 9, 345);
    });
    '12345678'.split('').forEach((val, idx) => {
      ctx.fillText(val, 329, idx * 40 + 32);
    });
    ctx.scale(40, 40);
  },
  getRawSquareForCoordinates: (left, top) => {
    return [Math.floor(left / 40), Math.floor(top / 40)];
  },
  getSquareForCoordinates: (left, top) => {
    let xyArray = cB.getRawSquareForCoordinates(left, top);
    return [cB.colLetterForIndex(xyArray[0]),
            cB.rowNumberForIndex(xyArray[1])];
  },
  newFenPos: (pos) => {
    cB.FENPos = pos;
    $('#FENPos').val(pos);
    cB.FENPosToMatrix();
  }

};

for (let key in cB.imgSrcs) {
  let pic = new Image();
  pic.src = cB.imgSrcs[key];
  pic.style.width = '40px';
  pic.style.height = '40px';
  cB.imgObjs[key] = pic;
}