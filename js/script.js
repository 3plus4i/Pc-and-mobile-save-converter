window.onload = function () {
    $("#input").on("change", run);
}


function run() {
    let inText = $("#input").val();
    let converted = convert(inText);
    $("#output").val(converted.main);
    $("#inLabel").val(converted.inLabel);
    $("#outLabel").val(converted.outLabel);
}


function convert(text) {
    let temp = decode(text);
    let outLabel = temp.saveOrigin;
    let temp2 = converter[outLabel](temp);
    console.log(temp.saveOrigin, temp2.saveOrigin);
    return {
        main: encode(temp2),
        inLabel: outLabel,
        outLabel: temp2.saveOrigin
    }
}


const converter = {
    "pc": function (object) {
        let temp3 = object;
        temp3.rubies = Math.round(object.rubies * 10);
        temp3.saveOrigin = "mobile";
        temp3.readPatchNumber = "2.5.0";
        return temp3;
    },
    "mobile": function (object) {
        let temp4 = object;
        temp4.rubies = Math.round(object.rubies / 10);
        temp4.saveOrigin = "pc";
        temp4.readPatchNumber = "1.0e10";
        return temp4;
    }
}

function encode(data) {
    console.log("Encoded(n): ", data);
    let inText = $("#input").val()
    data = JSON.stringify(data);
    var encodedData, hash;
    
    if(inText.startsWith("7a990")) {
        hash = "7e8bb5a89f2842ac4af01b3b7e228592";
        encodedData = pako.deflateRaw(data, { to: 'string' });
    } else if(inText.startsWith("7e8bb")) {
        hash = "7a990d405d2c6fb93aa8fbb0ec1a3b23";
        encodedData = pako.deflate(data, { to: 'string' });
    }
    
    return hash + btoa(encodedData);
}

function decode(data) {
    if (data.startsWith("7a990")) {
        data = pako.inflate(atob(data.slice(32)), { to: 'string' });
    } else if(data.startsWith("7e8bb")) {
        data = pako.inflateRaw(atob(data.slice(32)), { to: 'string' });
    }
  
    data = JSON.parse(data);
    console.log("Decoded(n): ", data);
    return data;
}
