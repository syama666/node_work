var logger = {info:console.log,debug:console.log,error:console.error};
var ZK = require('zookeeper');
var options = { connect:'zookeeper1:2181, zookeeper3:2181, zookeeper2:2181', debug_level:ZK.ZOO_LOG_LEVEL_INFO, timeout:200000};
var zk = new ZK();
zk.init(options);
function execute(callback) {
        var path = '/test/zkleak_memoryusage';
        zk.a_create(path, 'hoge', 0, function(rc, err , createdPath) {
                if (rc != 0) return callback(err);
                logger.info('create success ' +createdPath);
                zk.a_exists(createdPath, true, function(rc, err, stat) {
                        if (rc != 0) return callback(err);
                        logger.info('a_exists success');
                        zk.a_delete_(createdPath, 0, function(rc, err) {
                                if (rc != 0) return callback(err);
                                logger.info('delete success');
                        });
                });
              zk.aw_exists ( createdPath,function(type, state, path){
                      logger.info('aw_exists watcher called');
                      return callback(null, path);
              }
              , function(rc, err, path) {
                      if (rc != 0) return callback(err);
              });
        });
}
function main() {
        execute(function(err) {
                if (err) logger.error(err);
                execute(function(err) {
                        if (err) logger.error(err);
                        execute(function(err) {
                                if (err) logger.error(err);
                                setTimeout(function() {
                                        main();
                                }, 1000);
                        });
                });
        });
}
zk.on(ZK.on_connected, function(zkk) {
        logger.info('zk.on start');
        logger.info( process.memoryUsage().heapUsed );
        main();
});

