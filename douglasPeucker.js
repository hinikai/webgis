
// square distance from a point to a segment
function getSqSegDist(p, p1, p2) {

    var x = p1['x'],
        y = p1['y'],
        dx = p2["x"] - x,
        dy = p2['y'] - y;

    if (dx !== 0 || dy !== 0) {

        var t = ((p['x'] - x) * dx + (p['y'] - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
            x = p2['x'];
            y = p2['y'];

        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p['x'] - x;
    dy = p['y'] - y;

    return dx * dx + dy * dy;
}

function simplifyDouglasPeucker(points, sqTolerance) {

    var len = points.length,
        MarkerArray = typeof Uint8Array !== 'undefined' ? Uint8Array : Array,
        markers = new MarkerArray(len),
        first = 0,
        last = len - 1,
        stack = [],
        newPoints = [],
        i, maxSqDist, sqDist, index;

    markers[first] = markers[last] = 1;

    while (last) {

        maxSqDist = 0;

        for (i = first + 1; i < last; i++) {
            sqDist = getSqSegDist(points[i], points[first], points[last]);

            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }

        if (maxSqDist > sqTolerance) {
            markers[index] = 1;
            stack.push(first, index, index, last);
        }

        last = stack.pop();
        first = stack.pop();
    }

    for (i = 0; i < len; i++) {
        if (markers[i]) newPoints.push(points[i]);
    }

    return newPoints;
}

function simplify(points, tolerance) {

    if (points.length <= 1) return points;

    var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

    points = simplifyDouglasPeucker(points, sqTolerance);

    return points;
}

function Pixel (x, y) {
    return {
        x: x,
        y: y
    }
}
