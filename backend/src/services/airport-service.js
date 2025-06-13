const { StatusCodes } = require('http-status-codes');
const {AirportRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const airportRepository = new AirportRepository();

async function createAirport(data) {
    try {
        const airport = await airportRepository.create(data);
        return airport;
    } catch (error) {
        if(error.name=="SequelizeValidationError") {
            let explaination = [];
            error.errors.forEach((err) => {
                explaination.push(err.message);
            });
            throw new AppError(explaination,StatusCodes.BAD_REQUEST)
        }
        throw new AppError(
            'Something went wrong while creating airport',
            StatusCodes.INTERNAL_SERVER_ERROR
        );  
    }
}   
async function getAirports(){
    try {
        const airports = await airportRepository.getAll();
        return airports;
    } catch (error) {
        throw new AppError(
            'Something went wrong while fetching airport',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }

}
async function getAirport(id) {
    try {
        const airport = await airportRepository.get(id);
        return airport;
    }
    catch (error) {   
        if(error.statusCode==StatusCodes.NOT_FOUND){
            throw new AppError('The Airport you requested is not present', StatusCodes.NOT_FOUND);
        }
        throw new AppError(
            'Something went wrong while fetching airport',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
        }
    }
    async function destroyAirport(id) {
        try {
            const response = await airportRepository.destroy(id);
            return response;
        } catch (error) {
             if(error.statusCode==StatusCodes.NOT_FOUND){
            throw new AppError('The Airport you requested is not present', StatusCodes.NOT_FOUND);
        }
            throw new AppError(
                'Something went wrong while deleting airport',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
    async function updateAirport(id, data) {
        try {
            const response = await airportRepository.update(id, data);
            return response;
        } catch (error) {
            if(error.statusCode==StatusCodes.NOT_FOUND){
                throw new AppError('The Airport you requested is not present', StatusCodes.NOT_FOUND);
            }}}

module.exports = {
    createAirport,
    getAirports , getAirport , destroyAirport , updateAirport
}