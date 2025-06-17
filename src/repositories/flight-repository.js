const CrudRepository = require("./crud-repositories");
const { Flight, Airplanes, Airport, City } = require("../../models");
const Sequelize = require("sequelize");
const db = require("../models");
const {addRowLockOnFlights} = require("./queries");
const { add } = require("nodemon/lib/rules");
class FlightRepository extends CrudRepository {
  constructor() {
    super(Flight);
  }

  async getAllFlights(filter, sort) {
    const queryOptions = {
      where: filter,
      order: sort,
      include: [
        {
          model: Airplanes,
          required: true,
          as: "airplaneDetails",
        },
        {
          model: Airport,
          required: true,
          as: "departureAirportDetails",
          on: {
            col1: Sequelize.where(
              Sequelize.col("Flight.departureAirportId"),
              "=",
              Sequelize.col("departureAirportDetails.code")
            ),
          },
          include: [{ model: City, required: true, as: "cityDetails" }],
        },
        {
          model: Airport,
          required: true,
          as: "arrivalAirportDetails",
          on: {
            col1: Sequelize.where(
              Sequelize.col("Flight.arrivalAirportId"),
              "=",
              Sequelize.col("arrivalAirportDetails.code")
            ),
          },
          include: [
            {
              model: City,
              required: true,
              as: "cityDetails",
            },
          ],
        },
      ],
    };

    const response = await Flight.findAll(queryOptions);
    return response;
  }

  async updateRemainingSeats(flightId, seats, dec = true) {
     const transaction  = await db.sequelize.transaction();
    await db.sequelize.query(addRowLockOnFlights(flightId)) ;
    if (+dec) {
      await Flight.decrement("totalSeats", {
        by: seats,
        where: { id: flightId },
      },{transaction: transaction});
    } else {
      await Flight.increment("totalSeats", {
        by: seats,
        where: { id: flightId },
      },{transaction: transaction});
    }
    return await Flight.findByPk(flightId);
  }
}


module.exports = FlightRepository;
