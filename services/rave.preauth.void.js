var morx = require('morx');
var q = require('q');

var spec = morx.spec()
                .build('id', 'required:true,validators:isNumeric, eg:7345')
				.build('action', 'required:true, eg:void')
                .end();
                
function service(data, _rave) {
    var d = q.defer();

        q.fcall(() => {
            var validated = morx.validate(data, spec, _rave.MORX_DEFAULT);
            var params = validated.params;

            params.action = params.action || 'void';

            return params;
        })
        .then(params => {
            params.SECKEY = _rave.getSecretKey();
            return _rave.request('/flwv3-pug/getpaidx/api/refundorvoid', params);
        })
        .then(resp => {
            d.resolve(resp);
        })
        .catch(err => {
            d.reject(err);
        });

        return d.promise;
}
service.morxspc = spec;
module.exports = service;