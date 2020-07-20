import React, { Component } from 'react';
import {
    message
} from 'antd';
import { fabric } from "fabric"
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

class DrawImage extends Component {
    constructor(props) {
        super();
        props.onRef(this);
    }
    
    setAllCanvas(data,ft,fs,tp,ts) {
        message.loading('二维码生成中...', 0);
        let contain = document.getElementById("contain"), urlArr = [],_it=this;
        contain.innerHTML = '';
        if (data.length == 0) {
            message.warn("暂无设备...");
            return
        }
        data.map((item, i) => {
            let cvs = document.createElement("canvas");
            cvs.id = "canvas" + i;
            contain.appendChild(cvs);
            let contains = document.getElementById("canvas" + i);
            let canvas = new fabric.StaticCanvas(contains, {
                backgroundColor: "white",
                selection: false,
                width: 220,
                height: 378
            });
            fabric.Image.fromURL(item.qrCodeUrl, function (oImg) {
                oImg.scale(0.122);
                canvas.add(oImg);
                var text1 = new fabric.Text(item.positionNo, { left: 28, top: tp?tp:230, fontSize: ft?ft:56, textAlign: "center" });
                canvas.add(text1);
                var text2 = new fabric.Text(item.equipmentNo, { left: 28, top: ts?ts:300, fontSize: fs?fs:36, textAlign: "center" });
                canvas.add(text2);
                urlArr.push({
                    base64: dataURLtoBlob(canvas.toDataURL('png')),
                    name: item.equipmentNo + "-" + item.positionNo
                })
                if(urlArr.length==data.length){
                    let zip = new JSZip();
                    message.destroy();
                    urlArr.map((item, i) => {
                        zip.file(`${item.name}.png`, item.base64, { base64: true });
                    })
                    zip.generateAsync({ type: "blob" }).then(function (content) {
                        saveAs(content, _it.props.name+".zip");
                    });
                }
            }, { crossOrigin: '*' });
        })
    }



    render() {

        return (
            <div id='contain' style={{ width: "100%",display:"none" }}>
            </div>
        )
    }

}


export default DrawImage