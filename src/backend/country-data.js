// Utilizing World Back REST API
const APIURL = `https://api.worldbank.org/v2/country`;

const indicators = {
  gdp: 'NY.GDP.MKTP.CD',
  gdpGrowth: 'NY.GDP.MKTP.KD.ZG',
  gdpPerCapita: 'NY.GDP.PCAP.CD',
  gdpPPP: 'NY.GDP.MKTP.PP.CD',
  gdpPPPPerCapita: 'NY.GDP.PCAP.PP.CD',
  population: 'SP.POP.TOTL',
  imports: 'NE.IMP.GNFS.CD',
  exports: 'NE.EXP.GNFS.CD',
  inflation: 'FP.CPI.TOTL.ZG',
  unemployment: 'SL.UEM.TOTL.ZS'
};

export async function fetchEconomicData(countryCode, year) {
  try {
    const fetchPromises = Object.entries(indicators).map(async ([key, indicator]) => {
      const response = await fetch(`${APIURL}/${countryCode}/indicator/${indicator}?format=json&date=${year}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok for indicator ${indicator}`);
      }
      const data = await response.json();
      return { key, data: data[1] ? data[1][0] : null };
    });
    const results = await Promise.all(fetchPromises);
    return results;
  } catch (error) {
    console.error('Fetch error:', error);
    return null
  }
}

export async function fetchGdpPerCapitaTimeSeries(countryCode) {
  const indicator = indicators.gdpPerCapita;
  const startYear = 1980;
  const endYear = new Date().getFullYear();
  try {
    const response = await fetch(`${APIURL}/${countryCode}/indicator/${indicator}?format=json&date=${startYear}:${endYear}&per_page=100`);
    if (!response.ok) {
      throw new Error(`Network response was not ok for indicator ${indicator}`);
    }
    const data = await response.json();
    const timeSeriesData = data[1] ? data[1].map((entry) => ({ date: entry.date, value: entry.value })) : [];
    return timeSeriesData;
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export async function fetchSectors(countryCode) {
  const agriculture = "NV.AGR.TOTL.ZS";
  const industry = "NV.IND.TOTL.ZS";
  const services = "NV.SRV.TOTL.ZS";

  try {
    const agricultureResponse = await fetch(`${APIURL}/${countryCode}/indicator/${agriculture}?format=json&date=2020`);
    const agricultureData = await agricultureResponse.json();
    const agricultureValue = agricultureData[1]?.[0]?.value || null;

    const industryResponse = await fetch(`${APIURL}/${countryCode}/indicator/${industry}?format=json&date=2020`);
    const industryData = await industryResponse.json();
    const industryValue = industryData[1]?.[0]?.value || null;

    const servicesResponse = await fetch(`${APIURL}/${countryCode}/indicator/${services}?format=json&date=2020`);
    const servicesData = await servicesResponse.json();
    const servicesValue = servicesData[1]?.[0]?.value || null;

    return {
      agriculture: agricultureValue,
      industry: industryValue,
      services: servicesValue
    };
  } catch (error) {
    console.error("Error fetching sector data:", error);
    return null;
  }
}

// country name codes list 
export const countries = [
  { value: 'CA', label: 'Canada' },
  { value: 'US', label: 'United States' },
  { value: 'CN', label: 'China' },
  { value: 'JP', label: 'Japan' },
  { value: 'DE', label: 'Germany' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'FR', label: 'France' },
  { value: 'IN', label: 'India' },
  { value: 'IT', label: 'Italy' },
  { value: 'KR', label: 'South Korea' },
  { value: 'AU', label: 'Australia' },
  { value: 'BR', label: 'Brazil' },
  { value: 'RU', label: 'Russia' },
  { value: 'AF', label: 'Afghanistan' },
  { value: 'AL', label: 'Albania' },
  { value: 'DZ', label: 'Algeria' },
  { value: 'AO', label: 'Angola' },
  { value: 'AR', label: 'Argentina' },
  { value: 'AM', label: 'Armenia' },
  { value: 'AT', label: 'Austria' },
  { value: 'AZ', label: 'Azerbaijan' },
  { value: 'BS', label: 'Bahamas' },
  { value: 'BH', label: 'Bahrain' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'BB', label: 'Barbados' },
  { value: 'BY', label: 'Belarus' },
  { value: 'BE', label: 'Belgium' },
  { value: 'BZ', label: 'Belize' },
  { value: 'BJ', label: 'Benin' },
  { value: 'BT', label: 'Bhutan' },
  { value: 'BO', label: 'Bolivia' },
  { value: 'BA', label: 'Bosnia and Herzegovina' },
  { value: 'BW', label: 'Botswana' },
  { value: 'BN', label: 'Brunei' },
  { value: 'BG', label: 'Bulgaria' },
  { value: 'BF', label: 'Burkina Faso' },
  { value: 'BI', label: 'Burundi' },
  { value: 'KH', label: 'Cambodia' },
  { value: 'CM', label: 'Cameroon' },
  { value: 'CV', label: 'Cape Verde' },
  { value: 'CF', label: 'Central African Republic' },
  { value: 'TD', label: 'Chad' },
  { value: 'CL', label: 'Chile' },
  { value: 'CO', label: 'Colombia' },
  { value: 'KM', label: 'Comoros' },
  { value: 'CD', label: 'Congo, Dem. Rep.' },
  { value: 'CG', label: 'Congo, Rep.' },
  { value: 'CR', label: 'Costa Rica' },
  { value: 'CI', label: 'Croatia' },
  { value: 'CU', label: 'Cuba' },
  { value: 'CY', label: 'Cyprus' },
  { value: 'CZ', label: 'Czech Republic' },
  { value: 'DK', label: 'Denmark' },
  { value: 'DJ', label: 'Djibouti' },
  { value: 'DM', label: 'Dominica' },
  { value: 'DO', label: 'Dominican Republic' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'EG', label: 'Egypt' },
  { value: 'SV', label: 'El Salvador' },
  { value: 'GQ', label: 'Equatorial Guinea' },
  { value: 'ER', label: 'Eritrea' },
  { value: 'EE', label: 'Estonia' },
  { value: 'SZ', label: 'Eswatini' },
  { value: 'ET', label: 'Ethiopia' },
  { value: 'FJ', label: 'Fiji' },
  { value: 'FI', label: 'Finland' },
  { value: 'GA', label: 'Gabon' },
  { value: 'GM', label: 'Gambia' },
  { value: 'GE', label: 'Georgia' },
  { value: 'GH', label: 'Ghana' },
  { value: 'GR', label: 'Greece' },
  { value: 'GD', label: 'Grenada' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'GN', label: 'Guinea' },
  { value: 'GW', label: 'Guinea-Bissau' },
  { value: 'GY', label: 'Guyana' },
  { value: 'HT', label: 'Haiti' },
  { value: 'HN', label: 'Honduras' },
  { value: 'HU', label: 'Hungary' },
  { value: 'IS', label: 'Iceland' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'IR', label: 'Iran' },
  { value: 'IQ', label: 'Iraq' },
  { value: 'IE', label: 'Ireland' },
  { value: 'IL', label: 'Israel' },
  { value: 'JM', label: 'Jamaica' },
  { value: 'JO', label: 'Jordan' },
  { value: 'KZ', label: 'Kazakhstan' },
  { value: 'KE', label: 'Kenya' },
  { value: 'KI', label: 'Kiribati' },
  { value: 'KP', label: 'North Korea' },
  { value: 'KW', label: 'Kuwait' },
  { value: 'KG', label: 'Kyrgyzstan' },
  { value: 'LA', label: 'Lao PDR' },
  { value: 'LV', label: 'Latvia' },
  { value: 'LB', label: 'Lebanon' },
  { value: 'LS', label: 'Lesotho' },
  { value: 'LR', label: 'Liberia' },
  { value: 'LY', label: 'Libya' },
  { value: 'LI', label: 'Liechtenstein' },
  { value: 'LT', label: 'Lithuania' },
  { value: 'LU', label: 'Luxembourg' },
  { value: 'MG', label: 'Madagascar' },
  { value: 'MW', label: 'Malawi' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'MV', label: 'Maldives' },
  { value: 'ML', label: 'Mali' },
  { value: 'MT', label: 'Malta' },
  { value: 'MH', label: 'Marshall Islands' },
  { value: 'MR', label: 'Mauritania' },
  { value: 'MU', label: 'Mauritius' },
  { value: 'MX', label: 'Mexico' },
  { value: 'FM', label: 'Micronesia' },
  { value: 'MD', label: 'Moldova' },
  { value: 'MC', label: 'Monaco' },
  { value: 'MN', label: 'Mongolia' },
  { value: 'ME', label: 'Montenegro' },
  { value: 'MA', label: 'Morocco' },
  { value: 'MZ', label: 'Mozambique' },
  { value: 'MM', label: 'Myanmar' },
  { value: 'NA', label: 'Namibia' },
  { value: 'NP', label: 'Nepal' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'NI', label: 'Nicaragua' },
  { value: 'NE', label: 'Niger' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'MK', label: 'North Macedonia' },
  { value: 'NO', label: 'Norway' },
  { value: 'OM', label: 'Oman' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'PW', label: 'Palau' },
  { value: 'PA', label: 'Panama' },
  { value: 'PG', label: 'Papua New Guinea' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'PE', label: 'Peru' },
  { value: 'PH', label: 'Philippines' },
  { value: 'PL', label: 'Poland' },
  { value: 'PT', label: 'Portugal' },
  { value: 'QA', label: 'Qatar' },
  { value: 'RO', label: 'Romania' },
  { value: 'RW', label: 'Rwanda' },
  { value: 'WS', label: 'Samoa' },
  { value: 'SM', label: 'San Marino' },
  { value: 'ST', label: 'Sao Tome and Principe' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'SN', label: 'Senegal' },
  { value: 'RS', label: 'Serbia' },
  { value: 'SC', label: 'Seychelles' },
  { value: 'SL', label: 'Sierra Leone' },
  { value: 'SG', label: 'Singapore' },
  { value: 'SK', label: 'Slovakia' },
  { value: 'SI', label: 'Slovenia' },
  { value: 'SB', label: 'Solomon Islands' },
  { value: 'SO', label: 'Somalia' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'SS', label: 'South Sudan' },
  { value: 'ES', label: 'Spain' },
  { value: 'LK', label: 'Sri Lanka' },
  { value: 'SD', label: 'Sudan' },
  { value: 'SR', label: 'Suriname' },
  { value: 'SE', label: 'Sweden' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'SY', label: 'Syria' },
  { value: 'TJ', label: 'Tajikistan' },
  { value: 'TZ', label: 'Tanzania' },
  { value: 'TH', label: 'Thailand' },
  { value: 'TL', label: 'Timor-Leste' },
  { value: 'TG', label: 'Togo' },
  { value: 'TO', label: 'Tonga' },
  { value: 'TT', label: 'Trinidad and Tobago' },
  { value: 'TN', label: 'Tunisia' },
  { value: 'TR', label: 'Turkey' },
  { value: 'TM', label: 'Turkmenistan' },
  { value: 'UG', label: 'Uganda' },
  { value: 'UA', label: 'Ukraine' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'UZ', label: 'Uzbekistan' },
  { value: 'VU', label: 'Vanuatu' },
  { value: 'VE', label: 'Venezuela' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'YE', label: 'Yemen' },
  { value: 'ZM', label: 'Zambia' },
  { value: 'ZW', label: 'Zimbabwe' }
];

export const years = [
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: '2021', label: '2021' },
  { value: '2020', label: '2020' },
  { value: '2019', label: '2019' },
  { value: '2018', label: '2018' },
  { value: '2017', label: '2017' },
  { value: '2016', label: '2016' },
  { value: '2015', label: '2015' },
  { value: '2014', label: '2014' },
  { value: '2013', label: '2013' },
  { value: '2012', label: '2012' },
  { value: '2011', label: '2011' },
  { value: '2010', label: '2010' },
  { value: '2009', label: '2009' },
  { value: '2008', label: '2008' },
  { value: '2007', label: '2007' },
  { value: '2006', label: '2006' },
  { value: '2005', label: '2005' },
  { value: '2004', label: '2004' },
  { value: '2003', label: '2003' },
  { value: '2002', label: '2002' },
  { value: '2001', label: '2001' },
  { value: '2000', label: '2000' },
  { value: '1999', label: '1999' },
  { value: '1998', label: '1998' },
  { value: '1997', label: '1997' },
  { value: '1996', label: '1996' },
  { value: '1995', label: '1995' },
  { value: '1994', label: '1994' },
  { value: '1993', label: '1993' },
  { value: '1992', label: '1992' },
  { value: '1991', label: '1991' },
  { value: '1990', label: '1990' },
  { value: '1989', label: '1989' },
  { value: '1988', label: '1988' },
  { value: '1987', label: '1987' },
  { value: '1986', label: '1986' },
  { value: '1985', label: '1985' },
  { value: '1984', label: '1984' },
  { value: '1983', label: '1983' },
  { value: '1982', label: '1982' },
  { value: '1981', label: '1981' },
  { value: '1980', label: '1980' },
  { value: '1979', label: '1979' },
  { value: '1978', label: '1978' },
  { value: '1977', label: '1977' },
  { value: '1976', label: '1976' },
  { value: '1975', label: '1975' },
  { value: '1974', label: '1974' },
  { value: '1973', label: '1973' },
  { value: '1972', label: '1972' },
  { value: '1971', label: '1971' },
  { value: '1970', label: '1970' },
  { value: '1969', label: '1969' },
  { value: '1968', label: '1968' },
  { value: '1967', label: '1967' },
  { value: '1966', label: '1966' },
  { value: '1965', label: '1965' },
  { value: '1964', label: '1964' },
  { value: '1963', label: '1963' },
  { value: '1962', label: '1962' },
  { value: '1961', label: '1961' },
  { value: '1960', label: '1960' }
];
