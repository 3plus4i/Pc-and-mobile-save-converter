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
        main: encode(temp2, outLabel),
        inLabel: outLabel,
        outLabel: temp2.saveOrigin
    }
}


const converter = {
    "pc": function (object) {
        let temp3 = object;
        temp3.rubies = Math.round(object.rubies * 10);
        if ("pendingRaidRubies" in temp3) {
            temp3.pendingRaidRubies = Math.round(object.pendingRaidRubies * 10);
        }
        if ("mercenaries" in temp3.mercenaries) {
            for (let merc in temp3.mercenaries.mercenaries) {
                if (temp3.mercenaries.mercenaries[merc].lastQuestRewardType == 6) {
                    temp3.mercenaries.mercenaries[merc].lastQuestRewardQty = object.mercenaries.mercenaries[merc].lastQuestRewardQty * 10;
                }
            }
        }
        temp3.saveOrigin = "mobile";
        console.log("PC:", temp3.readPatchNumber);
        if (temp3.readPatchNumber.length > 6) {
            temp3.readPatchNumber = "2.7." + temp3.readPatchNumber.slice(-4);
        } else {
            temp3.readPatchNumber = "2.5.0";
        }
        return temp3;
    },
    "mobile": function (object) {
        let temp4 = object;
        temp4.rubies = Math.round(object.rubies / 10);
        if ("pendingRaidRubies" in temp4) {
            temp4.pendingRaidRubies = Math.round(object.pendingRaidRubies / 10);
        }
        if ("mercenaries" in temp4.mercenaries) {
            for (let merc in temp4.mercenaries.mercenaries) {
                if (temp4.mercenaries.mercenaries[merc].lastQuestRewardType == 6) {
                    temp4.mercenaries.mercenaries[merc].lastQuestRewardQty = object.mercenaries.mercenaries[merc].lastQuestRewardQty / 10;
                }
            }
        }
        temp4.saveOrigin = "pc";
        console.log("Mobile:", temp4.readPatchNumber);
        if (temp4.readPatchNumber.length > 5) {
            temp4.readPatchNumber = "1.0e12-" + temp4.readPatchNumber.slice(-4);
        } else {
            temp4.readPatchNumber = "1.0e12";
        }
        return temp4;
    }
}

function encode(data, saveOrigin) {
    console.log("Encoded(n): ", data);
    data = JSON.stringify(data);
    var bytes = new TextEncoder().encode(data);
    var encodedData, hash;

    if(saveOrigin == "pc") {
        hash = "7e8bb5a89f2842ac4af01b3b7e228592";
        encodedData = pako.deflateRaw(bytes);
    } else if(saveOrigin == "mobile") {
        hash = "7a990d405d2c6fb93aa8fbb0ec1a3b23";
        encodedData = pako.deflate(bytes);
    }
    let base64String = btoa(String.fromCharCode.apply(null, encodedData));

    return hash + base64String;
}

function decode(data) {
    let result = Uint8Array.from(atob(data.slice(32)), (c) => c.charCodeAt(0));

    if (data.startsWith("7a990")) {
        data = pako.inflate(result, { to: 'string' });
    } else if(data.startsWith("7e8bb")) {
        data = pako.inflateRaw(result, { to: 'string' });
    }
  
    data = JSON.parse(data);
    console.log("Decoded(n): ", data);
    return data;
}
