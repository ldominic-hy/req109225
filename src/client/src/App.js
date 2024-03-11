import React, { useState, memo } from 'react';
import isEmpty from 'lodash/isEmpty';
import './App.css';

import { getListByYear } from './genericFunctions';

const filterType = {
  all: 'ALL',
  geoDesc: 'GEOGRAPHIC_DESCRIPTION',
  fireStatusAndFireCause: 'FIRE_STATUS_AND_FIRE_CAUSE',
};

const getData = (setFilterList, filterBy, value1, value2) => {
  let url;
  switch (filterBy) {
    case filterType.all:
      url = 'https://openmaps.gov.bc.ca/geo/pub/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_PNTS_SP&outputFormat=application%2Fjson';
      break;
    case filterType.fireStatusAndFireCause:
      url = `https://openmaps.gov.bc.ca/geo/pub/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_PNTS_SP&cql_filter=FIRE_CAUSE%3C%3E%27${value2}%27%20AND%20FIRE_STATUS=%27${value1}%27&outputFormat=application%2Fjson`;
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

const getfilterListInCsvOrTxt = (filterList, isCsv) => {
  let filterItem = [];
  let csvData = [
    ['Fire Number', 'Ignition Date', 'Fire Out Date', 'Fire Status', 'Fire Cause', 'Geographic Description'],
  ];

  filterList.forEach(item => {
    filterItem.push(item?.properties?.FIRE_NUMBER);
    filterItem.push(item?.properties?.IGNITION_DATE);
    filterItem.push(item?.properties?.FIRE_OUT_DATE);
    filterItem.push(item?.properties?.FIRE_STATUS);
    filterItem.push(item?.properties?.FIRE_CAUSE);
    filterItem.push(item?.properties?.GEOGRAPHIC_DESCRIPTION);
    csvData.push(filterItem);
    filterItem = [];
  });

  const csvContent = csvData.map(row => row.join(',')).join('\n');

  const blob = isCsv? new Blob([csvContent], { type: 'text/csv' }) : new Blob([csvContent], { type: 'text/plain' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = isCsv? 'wildFiresData.csv' : 'wildFiresData.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const App = props => {
  const [filterList, setFilterList] = useState([]);
  const [fireStatus, setFireStatus] = useState('');
  const [fireCause, setFireCause] = useState('');
  const [geoDesc, setGeoDesc] = useState('');
  const [readOnlyFireStatus, setReadOnlyFireStatus] = useState(false);
  const [readOnlyFireCause, setReadOnlyFireCause] = useState(false);
  const [readOnlyGeoDesc, setReadOnlyGeoDesc] = useState(false);
  const [csvOrTxt, setCsvOrTxt] = useState('csv');

  const handleGeoDescInputChange = (event) => {
    setGeoDesc(event.target.value);
    if (isEmpty(event.target.value)) {
      setReadOnlyFireCause(false);
      setReadOnlyFireStatus(false);
    } else {
      setReadOnlyFireCause(true);
      setReadOnlyFireStatus(true);
    }
  };

  const handleFireStatusChange = (event) => {
    setFireStatus(event.target.value);
    if (isEmpty(event.target.value) && isEmpty(fireCause)) {
      setReadOnlyGeoDesc(false);
    } else {
      setReadOnlyGeoDesc(true);
    }
  };

  const handleFireCauseChange = (event) => {
    setFireCause(event.target.value);
    if (isEmpty(event.target.value) && isEmpty(fireStatus)) {
      setReadOnlyGeoDesc(false);
    } else {
      setReadOnlyGeoDesc(true);
    }
  };

  const handleCsvOrTxtChange = (event) => {
    setCsvOrTxt(event.target.value);
  };

  return (
    <div className="App">
      <h1>BC Wildfires Summary</h1>
      <div>
        <label>Fire Status: </label>
        <select id="fireStatus" name="fireStatus" value={fireStatus} onChange={handleFireStatusChange} disabled={readOnlyFireStatus}>
          <option value="">Please select</option>
          <option value="Out">Out</option>
          <option value="Under Control">Under Control</option>
        </select>
      </div>
      <div>
        <label>Fire Not Cause By: </label>
        <select id="fireCause" name="fireCause" value={fireCause} onChange={handleFireCauseChange} disabled={readOnlyFireCause}>
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
          onChange={handleGeoDescInputChange}
          disabled={readOnlyGeoDesc}
        />
      </div>
      <div>
        <button onClick={() => getData(setFilterList, filterType.all)}>View all wildfires from 2023</button>
      </div>
      <div>
        <button disabled={readOnlyFireCause && readOnlyFireStatus} onClick={() => getData(setFilterList, filterType.fireStatusAndFireCause, fireStatus, fireCause)}>View all wildfires from 2023 by fire status and fire cause</button>
      </div>
      <div>
        <button disabled={readOnlyGeoDesc} onClick={() => getData(setFilterList, filterType.geoDesc, geoDesc)}>View all wildfires from 2023 by geogarphic description</button>
      </div>
      <div>
        <button onClick={() => getfilterListInCsvOrTxt(filterList, (csvOrTxt === 'csv'))}>Download into CSV or text file formats</button>
        <label>
          <input
            type="radio"
            name="csvOrTxt"
            value="csv"
            checked={csvOrTxt === 'csv'}
            onChange={handleCsvOrTxtChange}
          />
          Csv
        </label>
        <label>
          <input
            type="radio"
            name="csvOrTxt"
            value="txt"
            checked={csvOrTxt === 'txt'}
            onChange={handleCsvOrTxtChange}
          />
          Text
        </label>
      </div>
      {filterList && filterList.length > 0 &&
        <div>
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
        </div>
      }
    </div>
  );
};

export default memo(App);
