const { StatusCodes } = require('http-status-codes');
const {AirplaneRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const airplaneRepository = new AirplaneRepository();

async function createAirplane(data) {
    try {
        const airplane = await airplaneRepository.create(data);
        return airplane;
    } catch (error) {
        if(error.name=="SequelizeValidationError") {
            let explaination = [];
            error.errors.forEach((err) => {
                explaination.push(err.message);
            });
            throw new AppError(explaination,StatusCodes.BAD_REQUEST)
        }
        throw new AppError(
            'Something went wrong while creating airplane',
            StatusCodes.INTERNAL_SERVER_ERROR
        );  
    }
}   
async function getAirplanes(){
    try {
        const airplanes = await airplaneRepository.getAll();
        return airplanes;
    } catch (error) {
        throw new AppError(
            'Something went wrong while fetching airplanes',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }

}
async function getAirplane(id) {
    try {
        const airplane = await airplaneRepository.get(id);
        return airplane;
        }
       
    catch (error) {   
        if(error.statusCode==StatusCodes.NOT_FOUND){
            throw new AppError('The Airplane you requested is not present', StatusCodes.NOT_FOUND);
        }
        throw new AppError(
            'Something went wrong while fetching airplane',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
        }
    }
    async function destroyAirplane(id) {
        try {
            const response = await airplaneRepository.destroy(id);
            return response;
        } catch (error) {
             if(error.statusCode==StatusCodes.NOT_FOUND){
            throw new AppError('The Airplane you requested is not present', StatusCodes.NOT_FOUND);
        }
            throw new AppError(
                'Something went wrong while deleting airplane',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
    async function updateAirplane(id, data) {
        try {
            const response = await airplaneRepository.update(id, data);
            return response;
        } catch (error) {
            if(error.statusCode==StatusCodes.NOT_FOUND){
                throw new AppError('The Airplane you requested is not present', StatusCodes.NOT_FOUND);
            }}}

module.exports = {
    createAirplane,
    getAirplanes , getAirplane , destroyAirplane , updateAirplane
}