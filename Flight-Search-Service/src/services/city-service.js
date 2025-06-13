const { StatusCodes } = require('http-status-codes');
const {CityRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const cityRepository = new CityRepository();

async function createCity(data) {
    try {
        const city = await cityRepository.create(data);
        return city;
    } catch (error) {
       
        if(error.name=="SequelizeValidationError"||"SequelizeUniqueConstraintError") {
            let explaination = [];
            error.errors.forEach((err) => {
                explaination.push(err.message);
            });
            throw new AppError(explaination,StatusCodes.BAD_REQUEST)
        }
        throw new AppError(
            'Something went wrong while creating city',
            StatusCodes.INTERNAL_SERVER_ERROR
        );  
    }
}

 async function destroyCity(id) {
        try {
            const response = await cityRepository.destroy(id);
            return response;
        } catch (error) {
             if(error.statusCode==StatusCodes.NOT_FOUND){
            throw new AppError('The City you requested is not present', StatusCodes.NOT_FOUND);
        }
            throw new AppError(
                'Something went wrong while deleting city',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
    async function updateCity(id, data) {
        try {
            const response = await cityRepository.update(id, data);
            return response;
        } catch (error) {
            if(error.statusCode==StatusCodes.NOT_FOUND){
                throw new AppError('The City you requested is not present', StatusCodes.NOT_FOUND);
            }}}

module.exports = {
    createCity,
destroyCity,
updateCity
}