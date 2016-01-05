/**
 * Cohen-Sutherland线段剪裁算法
 * @param Pixel 线段起点
 * @param Pixel 线段终点
 * @paran Object 像素区域对象，需包含minX、minY、maxX和maxY
 * @return Object 返回JSON对象，包含pixel0、pixel1和一个clip标志位，
 *                表示此线段是否被剪裁，如果线段被抛弃，则返回undefined
 */
function cohenSutherlandLineClip(pixel0, pixel1, pixelBounds) {
    var accept = false;
    var clip = false;
    var done = false;
    var px0 = new Pixel(pixel0.x, pixel0.y);
    var px1 = new Pixel(pixel1.x, pixel1.y);
    var outcode0 = calcOutcode(px0, pixelBounds);
    var outcode1 = calcOutcode(px1, pixelBounds);
    var outcodeOut;
    var x;
    var y;
    var minX = pixelBounds.minX;
    var minY = pixelBounds.minY;
    var maxX = pixelBounds.maxX;
    var maxY = pixelBounds.maxY;
    do {
        if (outcode0.all === 0 && outcode1.all === 0) {
            accept = true;
            done = true;
        } else {
            if ((outcode0.all & outcode1.all) !== 0) {
                done = true;
            } else {
                if (outcode0.all !== 0) {
                    outcodeOut = outcode0;
                } else {
                    outcodeOut = outcode1;
                }
                // 计算交点
                if (outcodeOut.top) {
                    x = px0.x + (px1.x - px0.x) * (minY - px0.y) / (px1.y - px0.y);
                    y = minY;
                } else {
                    if (outcodeOut.bottom) {
                        x = px0.x + (px1.x - px0.x) * (maxY - px0.y) / (px1.y - px0.y);
                        y = maxY;
                    } else {
                        if (outcodeOut.right) {
                            y = px0.y + (px1.y - px0.y) * (maxX - px0.x) / (px1.x - px0.x);
                            x = maxX;
                        } else {
                            if (outcodeOut.left) {
                                y = px0.y + (px1.y - px0.y) * (minX - px0.x) / (px1.x - px0.x);
                                x = minX;
                            }
                        }
                    }
                }
                clip = true;
                if (outcodeOut.all === outcode0.all) {
                    px0.x = Math.round(x);
                    px0.y = Math.round(y);
                    outcode0 = calcOutcode(px0, pixelBounds);
                } else {
                    px1.x = Math.round(x);
                    px1.y = Math.round(y);
                    outcode1 = calcOutcode(px1, pixelBounds);
                }
            }
        }
    } while (!done);
    if (accept) {
        return {
            pixel0: new Pixel(px0.x, px0.y),
            pixel1: new Pixel(px1.x, px1.y),
            clip: clip ? true : false

        };
    }
}

/**
 * 计算外码，Cohen-Sutherland剪裁算法
 * @param Pixel 像素点
 * @param Object 一个JSON对象，描述像素矩形区域，需要包含
 *               minX、minY、maxX和maxY属性
 */
function calcOutcode(pixel, pixelBounds) {
    // 初始化外码
    var code = {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        all: 0

    };
    var x = pixel.x;
    var y = pixel.y;
    if (y < pixelBounds.minY) {
        code.top = 8;
        code.all += code.top;
    } else {
        if (y > pixelBounds.maxY) {
            code.bottom = 4;
            code.all += code.bottom;
        }
    }
    if (x > pixelBounds.maxX) {
        code.right = 2;
        code.all += code.right;
    } else {
        if (x < pixelBounds.minX) {
            code.left = 1;
            code.all += code.left;
        }
    }
    return code;
}

function Pixel (x, y) {
    return {
        x: x,
        y: y
    }
}
