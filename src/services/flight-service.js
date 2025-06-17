const { StatusCodes } = require('http-status-codes');
const {FlightRepository} = require('../repositories');
const {Op} = require('sequelize');
const {compareTime} = require('../utils/helpers/datetime-helpers');
const AppError = require('../utils/errors/app-error');
const flightRepository = new FlightRepository();

async function createFlight(data) {
     if(!compareTime(data.arrivalTime, data.departureTime)) {
            throw new AppError(
                'Arrival time must be greater than departure time',
                StatusCodes.BAD_REQUEST
            );
        }
        if(data.arrivalAirportId === data.departureAirportId) {
            throw new AppError(
                'Arrival and Departure airport cannot be the same',
                StatusCodes.BAD_REQUEST
            );
        }
        if(data.totalSeats <= 0) {
            throw new AppError(
                'Total seats must be greater than 0',
                StatusCodes.BAD_REQUEST
            );
        }
        if(data.price <= 0) {
            throw new AppError(
                'Price must be greater than 0',
                StatusCodes.BAD_REQUEST
            );
        }
    try {
       
        const flight = await flightRepository.create(data);

        return flight;
    } catch (error) {
        if(error.name=="SequelizeValidationError") {
            let explaination = [];
            error.errors.forEach((err) => {
                explaination.push(err.message);
            });
            throw new AppError(explaination,StatusCodes.BAD_REQUEST)
        }
        throw new AppError(
            'Something went wrong while creating flight',
            StatusCodes.INTERNAL_SERVER_ERROR
        );  
    }
}   
// async function getAllFlights(query){
//     const customFilter={};
//     let sortFilter = [];
//     const endTripTime = ' 23:59:59';
// if(query.trips==''){
//      throw new AppError(
//             'Invalid trip format. Expected format: departureAirportId-arrivalAirportId',
//             StatusCodes.BAD_REQUEST
//         );
// }
//     if(query.trips){
//         const[departureAirportId, arrivalAirportId] = query.trips.split('-');
//         if(departureAirportId === arrivalAirportId) {
//             throw new AppError(
//                 'Departure and Arrival airport cannot be the same',
//                 StatusCodes.BAD_REQUEST
//             );
//         }
//         customFilter.departureAirportId = departureAirportId;
//         customFilter.arrivalAirportId = arrivalAirportId;
//     }
//     if(query.price){
//         const [minPrice, maxPrice] = query.price.split('-');
       
//         customFilter.price = {
//             [Op.between]: [minPrice,(maxPrice==undefined ? 999999 : maxPrice)]
//         };
//     }
//     if(query.travellers){
//         customFilter.totalSeats = {
//             [Op.gte]: query.travellers
//         };
//     }
//     if(query.tripDate){

//         customFilter.departureTime = {
//             [Op.between]: [query.tripDate, query.tripDate  + endTripTime]
//         };
//     }
//     if(query.sort){
//         const params = query.sort.split(',');
//         const sortFilters = params.map((param)=>param.split('_'));
//         sortFilter = sortFilters;
//     }
//     try {
//         const flights = await flightRepository.getAllFlights(customFilter,sortFilter);
//         return flights;
//     } catch (error) {
//         throw new AppError(
//             'Something went wrong while getting all flights',
//             StatusCodes.INTERNAL_SERVER_ERROR
//         );  
//     }
// }
async function getAllFlights(query){
    const customFilter = {};
    let sortFilter = [];
    const endTripTime = ' 23:59:59';

 
    if(query.trips !== undefined && query.trips === '') {
        throw new AppError(
            'Invalid trip format. Expected format: departureAirportId-arrivalAirportId',
            StatusCodes.BAD_REQUEST
        );
    }
    
    if(query.trips) {
        const [departureAirportId, arrivalAirportId] = query.trips.split('-');
        

        if(!departureAirportId || !arrivalAirportId) {
            throw new AppError(
                'Invalid trip format. Expected format: departureAirportId-arrivalAirportId',
                StatusCodes.BAD_REQUEST
            );
        }
        
        if(departureAirportId === arrivalAirportId) {
            throw new AppError(
                'Departure and Arrival airport cannot be the same',
                StatusCodes.BAD_REQUEST
            );
        }
        
        customFilter.departureAirportId = departureAirportId;
        customFilter.arrivalAirportId = arrivalAirportId;
    }
    
    if(query.price) {
        const [minPrice, maxPrice] = query.price.split('-');
        customFilter.price = {
            [Op.between]: [minPrice, (maxPrice == undefined ? 999999 : maxPrice)]
        };
    }
    
    if(query.travellers) {
        customFilter.totalSeats = {
            [Op.gte]: query.travellers
        };
    }
    
    if(query.tripDate) {
        customFilter.departureTime = {
            [Op.between]: [query.tripDate, query.tripDate + endTripTime]
        };
    }
    
    if(query.sort) {
        const params = query.sort.split(',');
        const sortFilters = params.map((param) => param.split('_'));
        sortFilter = sortFilters;
    }
    
    try {
        const flights = await flightRepository.getAllFlights(customFilter, sortFilter);
        return flights;
    } catch (error) {
        console.error('Error in getAllFlights:', error); 
        throw new AppError(
            'Something went wrong while getting all flights',
            StatusCodes.INTERNAL_SERVER_ERROR
        );  
    }
}
async function getFlight(id) {
     try {
        const flight = await flightRepository.get(id);
        return flight;
    }
    catch (error) {   
        if(error.statusCode==StatusCodes.NOT_FOUND){
            throw new AppError('The Flight you requested is not present', StatusCodes.NOT_FOUND);
        }
        throw new AppError(
            'Something went wrong while fetching flight',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
        }
}
async function updateSeats(data) {
try {
    const response = await flightRepository.updateRemainingSeats(data.flightId, data.seats, data.dec);
    return response;
    
} catch (error) {
   console.error("Error updating seats:", error);
  throw new AppError("Something went wrong while updating flight seats", 500);
}
}
module.exports = {
    createFlight,
    getAllFlights,
    getFlight,
    updateSeats
}