const CrudRepository = require('./crud-repositories');
const {Airplanes} = require('../../models');

class AirplaneRepository extends CrudRepository {
    constructor(){
        super(Airplanes);
    }
}
module.exports = AirplaneRepository;