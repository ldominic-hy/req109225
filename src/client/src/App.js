import React, { useState, memo } from 'react';
import './App.css';

import { getListByYear } from './genericFunctions';

const filterType = {
  all: 'ALL',
  geoDesc: 'GEOGRAPHIC_DESCRIPTION',
  fireStatusAndFireCause: 'FIRE_STATUS_AND_FIRE_CAUSE',
};

const getData = (setFilterList, filterBy, count, value1, value2) => {
  let url;
  switch (filterBy) {
    case filterType.all:
      url = 'https://openmaps.gov.bc.ca/geo/pub/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_PNTS_SP&outputFormat=application%2Fjson';
      break;
    case filterType.fireStatusAndFireCause:
      url = `https://openmaps.gov.bc.ca/geo/pub/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_PNTS_SP&cql_filter=FIRE_CAUSE%3C%3E%27${value2}%27%20AND%20FIRE_STATUS=%27${value1}%27&count=${count}&outputFormat=application%2Fjson`;
      break;
    case filterType.geoDesc:
      url = `https://openmaps.gov.bc.ca/geo/pub/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_PNTS_SP&cql_filter=GEOGRAPHIC_DESCRIPTION=%27${value1}%27&outputFormat=application%2Fjson`;
      break;
    default:
      url = '';
  }
  fetch(url).then(response => {
    if (!response.ok) {
      throw new Error('Error');
    }
    return response.json();
  })
  .then(data => {
    const listIn2023 = getListByYear(2023, data);
    setFilterList(listIn2023);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
};

const App = props => {
  const [filterList, setFilterList] = useState([]);
  const [fireStatus, setFireStatus] = useState('');
  const [fireCause, setFireCause] = useState('');
  const [geoDesc, setGeoDesc] = useState('');
  const [count, setCount] = useState(0);

  const handleInputChange = (event) => {
    setGeoDesc(event.target.value);
  };

  const handleFireStatusChange = (event) => {
    setFireStatus(event.target.value);
  };

  const handleFireCauseChange = (event) => {
    setFireCause(event.target.value);
  };

  const handleInputChange2 = (event) => {
    setCount(event.target.value);
  };

  return (
    <div className="App">
      <h1>Welcome</h1>
      <div>
        <label>Fire Status: </label>
        <select id="fireStatus" name="fireStatus" value={fireStatus} onChange={handleFireStatusChange}>
          <option value="">Please select</option>
          <option value="Out">Out</option>
          <option value="Under Control">Under Control</option>
        </select>
      </div>
      <div>
        <label>Fire Not Cause By: </label>
        <select id="fireCause" name="fireCause" value={fireCause} onChange={handleFireCauseChange}>
          <option value="">Please select</option>
          <option value="Lightning">Lightning</option>
          <option value="Person">Person</option>
          <option value="Unknown">Unknown</option>
        </select>
      </div>
      <div>
        <label>Geographic Description: </label>
        <input
          type="text"
          id="geoDesc"
          name="geoDesc"
          value={geoDesc}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Number of items to display: </label>
        <input
          type="text"
          id="count"
          name="count"
          value={count}
          onChange={handleInputChange2}
        />
      </div>
      <button onClick={() => getData(setFilterList, filterType.all)}>View all wildfires from 2023</button>
      <button onClick={() => getData(setFilterList, filterType.fireStatusAndFireCause, count, fireStatus, fireCause)}>View all wildfires from 2023 by fire status and fire cause</button>
      <button onClick={() => getData(setFilterList, filterType.geoDesc, count, geoDesc)}>View all wildfires from 2023 by geogarphic description</button>
      <button onClick={() => getData(setFilterList)}>Download into CSV or text file formats</button>
      {filterList && filterList.length > 0 &&
        <table>
          <thead>
            <tr>
              <th>Fire Number</th>
              <th>Ignition Date</th>
              <th>Fire Out Date</th>
              <th>Fire Status</th>
              <th>Fire Cause</th>
              <th>Geographic Description</th>
            </tr>
          </thead>
          <tbody>
            {filterList.map(item => (
              <tr>
                <td>{item?.properties?.FIRE_NUMBER}</td>
                <td>{item?.properties?.IGNITION_DATE}</td>
                <td>{item?.properties?.FIRE_OUT_DATE}</td>
                <td>{item?.properties?.FIRE_STATUS}</td>
                <td>{item?.properties?.FIRE_CAUSE}</td>
                <td>{item?.properties?.GEOGRAPHIC_DESCRIPTION}</td>            
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
};

export default memo(App);
