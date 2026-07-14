const Province = require("../../model/area/Province");
const Areas = require("../../model/area/Area");
const City = require("../../model/area/City");
const Street = require("../../model/area/Street");
const Village = require("../../model/area/Village");
const { getData, setData } = require("../../utils/redis");

class LocationService {
  async queryProvinces() {
    const provinces = await Province.findAll();
    return provinces;
  }

  async queryCities(provinceCode) {
    const cities = await City.findAll({ where: { provinceCode } });
    return cities;
  }

  async queryAreas(cityCode) {
    const areas = await Areas.findAll({ where: { cityCode } });
    return areas;
  }

  async queryStreets(areaCode) {
    const streets = await Street.findAll({ where: { areaCode } });
    return streets;
  }

  async queryVillages(streetCode) {
    const villages = await Village.findAll({ where: { streetCode } });
    return villages;
  }

  async queryAllRegions() {
    const cacheKey = "regions_all";
    try {
      const cached = await getData(cacheKey);
      if (cached) {
        return cached;
      }
    } catch (e) {
      console.error("Redis read error for regions_all:", e);
    }

    const provinces = await Province.findAll({ raw: true });
    const cities = await City.findAll({ raw: true });
    const areas = await Areas.findAll({ raw: true });

    const provincesList = provinces.map(p => ({
      id: String(p.code),
      pid: '0',
      deep: '0',
      name: p.name
    }));

    const citiesList = cities.map(c => ({
      id: String(c.code),
      pid: String(c.provinceCode),
      deep: '1',
      name: c.name
    }));

    const areasList = areas.map(a => ({
      id: String(a.code),
      pid: String(a.cityCode),
      deep: '2',
      name: a.name
    }));

    const allRegions = [...provincesList, ...citiesList, ...areasList];

    try {
      // 缓存30天
      await setData(cacheKey, allRegions, 86400 * 30);
    } catch (e) {
      console.error("Redis write error for regions_all:", e);
    }

    return allRegions;
  }
}

module.exports = new LocationService();
