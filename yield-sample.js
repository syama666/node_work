//easy flow controler
function task(n, finish) {

    var recur = function(err, result) {
        
        if (err) {
            finish(err);
            return;
        }

        var ret = g.next(result);

        if (ret.done) {
            finish(err, ret.value);
            return;
        }

        if (typeof ret.value === 'function') {
            ret.value(recur);
            return;
        }
        return ret.value;
    }
    var g = n();
    var next = g.next();

    if (typeof next.value === 'function') {
        next.value(recur);
        return;
    }
    return next.value;
}

//stream read moch function
function read(key) {
    
    return function(callback) {
        callback(null, key +' DA YO!!');
        return;
    }
}


task(function *() {

    var a = yield read('one');
    var b = yield read('two');
    var c = yield read('three');
    
    return [a, b, c];
},
function(err, result) {
    console.log('[END]', err, result);
});

