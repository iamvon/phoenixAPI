const Point = require('../database').Point

module.exports = {
  getName: async function (_PointID) {
    const point = await Point.findById(_PointID)
    return Promise.resolve(point.dataValues.name)
  }
}