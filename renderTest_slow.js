// ==UserScript==
// @name         agario_renderTest_slow
// @namespace    ontando.io.agar
// @version      0.1
// @description  Adar.io Test rendering script... Might be werry slow...
// @author       ontando (angal & DiaLight)
// @match        agar.io
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

// ==/UserScript==
if (!unsafeWindow.install) {
    unsafeWindow.install = [];
}
alert("test");

unsafeWindow.install.push(["ontando", "renderTest", function() {
    var Document = unsafeWindow.ontando.script.newDocument;
    var doc = new Document();
    var render = this.tmp_renderData;
    var ent = this.entities;
    this.onRenderCompleteEvent(function (e) {
        var context = e.canvasContext2D;
        var l = context.innerWidth;
        var h = context.innerHeight;
        renderMap(context, render.v, render.y, l, h, render.scale, doc);
        renderInfo(context, render.v, render.y, l, h, render.scale, ent.all, ent.me, doc);
    });
}]);

function renderMap(g, locX, locY, length, height, scale, doc) {
    //var ad = unsafeWindow.angal_data;
    var fieldSize = 11185;
    g.save(); //push matrix
    g.scale(scale, scale);
   
    g.strokeStyle = "#F20000";
    g.lineWidth = 10;
    g.globalAlpha = 0.8;
    g.strokeRect(-locX + length / scale / 2, -locY + height / scale / 2, fieldSize, fieldSize);
   
    g.resetTransform();
    g.strokeStyle = "#B0B000";
    g.fillStyle = "#B0B000";
    g.lineWidth = 1;
    g.globalAlpha = 0.9;
    var x = 5;
    var y = 5;
    var dx = 200;
    var dy = 200;
    var lx = locX / fieldSize * dx;
    var ly = locY / fieldSize * dy;
    g.strokeRect(x, y, dx, dy);
    g.fillRect(x + lx - 3, y + ly - 3, 6, 6);
   
    doc.setColor("gray");
    doc.setSize(20);
    doc.setValue("x: " + (locX/100).toFixed(0)); g.drawImage(doc.render(), x + dx + 10, 10);
    doc.setValue("y: " + (locY/100).toFixed(0)); g.drawImage(doc.render(), x + dx + 10, 30);
    doc.setValue("scale: " +(1 / scale).toFixed(2)); g.drawImage(doc.render(), x + dx + 10, 50);
    //doc.setValue("Total mass: " +(ad.entities.me.total).toFixed(0)); g.drawImage(doc.render(), x + dx + 10, 70);
    //doc.setValue("Max part mass: " +(ad.entities.me.max).toFixed(0)); g.drawImage(doc.render(), x + dx + 10, 90);
    g.restore(); //pop matrix
}

function renderInfo(g, locX, locY, length, height, scale, entities, me, doc) {
    if(me.length == 0 || entities.length == 0) return;
    g.save(); //push matrix
    g.resetTransform();
    g.globalAlpha = 0.8;
   
    var curEnt, curMe, entSkipSize = 0, meSkipSize, curMin, dif, dx, dy, minMe;
    var max = 0;
    for(j = 0; j < me.length; j++) {
        entSkipSize += me[j].mass;
        if (max < me[j].mass) {
            max = me[j].mass;
        }
    }
    //var ad = unsafeWindow.angal_data;
    //ad.entities.me.total = entSkipSize;
    //ad.entities.me.max = max;
    meSkipSize = entSkipSize / me.length * 0.6; //30% from full
    entSkipSize /= me.length * 10; //10% from middle
    for(i = 0; i < entities.length; i++) {
        curEnt = entities[i];
        if(curEnt.isMe || curEnt.isVirus || curEnt.mass < entSkipSize) continue;
        curMin = 1000000000;
        for(j = 0; j < me.length; j++) {
            curMe = me[j];
            if(curMe.mass < meSkipSize) continue;
            dx = curMe.x - curEnt.x;
            dy = curMe.y - curEnt.y;
            dif = dx * dx + dy * dy;
            if(dif < curMin) {
                curMin = dif;
                minMe = curMe;
            }
        }
        
        //k = line / sqrt(M)
        //if k < 40 & 0.33>r>0.27 then ������ ����� �������
        //if k < 45 & 5<r<3 then ������ ������� �����
        g.lineWidth = 1;
        var splitRange_me = Math.sqrt(curMin) / minMe.size;
        var splitRange_en = Math.sqrt(curMin) / curEnt.size;

        var r1 = curEnt.mass / minMe.mass;
        if (r1 < 0.27) { // 0.15
            continue;
        }
        doc.setValue(r1.toFixed(2));
        if(r1 < 0.375) {
            doc.setValue(r1.toFixed(2));
            //var splitRange_old = Math.sqrt(curMin) / Math.sqrt(minMe.mass);
            if(splitRange_me < 4.5) { //splitRange_old < 40
                g.lineWidth = 3;
            }
            drawLine(curEnt, minMe, 'green');
        } else if (r1 < 0.8) {
            drawLine(curEnt, minMe, 'blue');
        } else if(r1 < 1.25) {
            drawLine(curEnt, minMe, 'gray');
        } else if (r1 < 2.66){
            drawLine(curEnt, minMe, 'orange');
        } else {
            doc.setValue(r1.toFixed(0));
            //var splitRange_old = Math.sqrt(curMin) / Math.sqrt(curEnt.mass);
            if(splitRange_en < 6) { //splitRange_old < 45
                g.lineWidth = 3;
            }
            drawLine(curEnt, minMe, 'red');
        }
    }
   
    g.restore(); //push matrix
    function drawLine(from, to, color) {
        g.beginPath();
        g.strokeStyle = color;
        var dx = (from.x - locX) * scale;
        var dy = (from.y - locY) * scale;
        var fx = length / 2 + dx;
        var fy = height / 2 + dy;
        var tx = length / 2 + (to.x - from.x) * scale + dx;
        var ty = height / 2 + (to.y - from.y) * scale + dy;
        g.moveTo(fx, fy);
        g.lineTo(tx - (tx - fx) / 20, ty - (ty - fy) / 20);
        g.stroke();
       
        //doc.setValue(from.mass.toFixed(2) + "/" + to.mass.toFixed(2) + "=" + (from.mass / to.mass).toFixed(2));
        doc.setColor(color);
        g.drawImage(doc.render(), tx - (tx - fx) / 5, ty - (ty - fy) / 5);
    }
}