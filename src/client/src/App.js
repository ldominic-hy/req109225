import React, { useState, memo } from 'react';
import isEmpty from 'lodash/isEmpty';
import './App.css';

import { getListByYear } from './genericFunctions';

const filterType = {
  all: 'ALL',
  geoDesc: 'GEOGRAPHIC_DESCRIPTION',
  fireStatusAndFireCause: 'FIRE_STATUS_AND_FIRE_CAUSE',
};

const getData = (setFilterList, filterBy, year, value1, value2) => {
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
      const listInYear = getListByYear(year, data);
      setFilterList(listInYear);
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

const App = () => {
  const [filterList, setFilterList] = useState([]);
  const [fireStatus, setFireStatus] = useState('');
  const [fireCause, setFireCause] = useState('');
  const [geoDesc, setGeoDesc] = useState('');
  const [year, setYear] = useState(2023);
  const [readOnlyFireStatus, setReadOnlyFireStatus] = useState(false);
  const [readOnlyFireCause, setReadOnlyFireCause] = useState(false);
  const [readOnlyGeoDesc, setReadOnlyGeoDesc] = useState(false);
  const [readOnlyYear, setReadOnlyYear] = useState(true);
  const [csvOrTxt, setCsvOrTxt] = useState('csv');

  const handleYearInputChange = (event) => {
    setYear(event.target.value);
    if (isEmpty(fireStatus) && isEmpty(fireCause) && isEmpty(geoDesc)) {
      setReadOnlyYear(false);
    } else {
      setReadOnlyYear(true);
    }
  };

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
      <p>B.C. experiences 1,600 wildfires per year, on average. While the majority of these fires are put out before they threaten people, homes and communities, it is important to be prepared, especially if living in an area prone to wildfire.  This website is to monitor the status of these wildfires and act accordingly.</p>
      <section>
        <h2>Please choose your filtering option</h2>
        <label>Fire Status: </label>
        <select disabled={readOnlyFireStatus} id="fireStatus" name="fireStatus" onChange={handleFireStatusChange} value={fireStatus}>
          <option value="">Please select</option>
          <option value="Out">Out</option>
          <option value="Under Control">Under Control</option>
        </select>
        &nbsp;
        <label>Fire Not Cause By: </label>
        <select disabled={readOnlyFireCause} id="fireCause" name="fireCause" onChange={handleFireCauseChange} value={fireCause}>
          <option value="">Please select</option>
          <option value="Lightning">Lightning</option>
          <option value="Person">Person</option>
          <option value="Unknown">Unknown</option>
        </select>
        &nbsp;
        <label>Geographic Description: </label>
        <input
          disabled={readOnlyGeoDesc}
          id="geoDesc"
          name="geoDesc"
          onChange={handleGeoDescInputChange}
          type="text"
          value={geoDesc}
        />
        &nbsp;
        <label>Year: </label>
        <input
          disabled={readOnlyYear}
          id="year"
          name="year"
          onChange={handleYearInputChange}
          type="text"
          value={year}
        />
      </section>
      <section>
        <h2>Please choose your view Options</h2>
        <button onClick={() => getData(setFilterList, filterType.all, year)}>View all wildfires</button>&nbsp;
        <button disabled={readOnlyFireCause && readOnlyFireStatus} onClick={() => getData(setFilterList, filterType.fireStatusAndFireCause, year, fireStatus, fireCause)}>View all wildfires by fire status and fire cause</button>&nbsp;
        <button disabled={readOnlyGeoDesc} onClick={() => getData(setFilterList, filterType.geoDesc, year, geoDesc)}>View all wildfires by geogarphic description</button>&nbsp;
        <button onClick={() => getfilterListInCsvOrTxt(filterList, (csvOrTxt === 'csv'))}>Download into CSV or text file formats</button>&nbsp;
        <label>
          <input
            checked={csvOrTxt === 'csv'}
            name="csvOrTxt"
            onChange={handleCsvOrTxtChange}
            type="radio"
            value="csv"
          />
          Csv
        </label>
        <label>
          <input
            checked={csvOrTxt === 'txt'}
            name="csvOrTxt"
            onChange={handleCsvOrTxtChange}
            type="radio"
            value="txt"
          />
          Text
        </label>
      </section>
      <section>
        {filterList && filterList.length > 0 &&
          <div>
            <h2>Summary Table</h2>
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
      </section>
    </div>
  );
};

export default memo(App);
