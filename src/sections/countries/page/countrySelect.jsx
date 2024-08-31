/* eslint-disable no-unused-vars */
/* eslint-disable perfectionist/sort-imports */
// eslint-disable-next-line import/no-extraneous-dependencies
import Flag from 'react-flagkit';
import * as React from 'react';

import { Box } from '@mui/material';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import PropTypes from 'prop-types';

export default function CountrySelect({data, selectedData, setSelectedData, withFlags, width, message}) {
  CountrySelect.propTypes = {
    data: PropTypes.array.isRequired,
    selectedData: PropTypes.object,
    setSelectedData: PropTypes.func.isRequired,
    withFlags: PropTypes.bool,
    width: PropTypes.number,
    message: PropTypes.string
  };
  
  return (
    <Autocomplete
      id="country-select-demo"
      sx={{ width: {width} }}
      options={data}
      autoHighlight
      value={selectedData} 
      getOptionLabel={(option) => option.label}
      onChange={(event, newValue) => {
        setSelectedData(newValue); 
      }}
      renderOption={(props, option) => {
        const { ...optionProps } = props;
        return (
          <Box
            component="li"
            sx={{ '& > div': { mr: 2, flexShrink: 0 } }}
            {...optionProps}
          >
            {withFlags && <Flag country={option.value} size={20} style={{ borderRadius: '0.3rem', overflow: 'hidden'}}/>}
            &nbsp;&nbsp;&nbsp;
            {option.label}
          </Box>
        );
      }}
      
      renderInput={(params) => (
        <TextField
          {...params}
          label={message}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
