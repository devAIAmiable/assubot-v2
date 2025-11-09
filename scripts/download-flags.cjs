#!/usr/bin/env node

/**
 * Script to download all country flags from flagsapi.com
 * Saves flags locally to public/flags/ directory
 *
 * Usage: node scripts/download-flags.cjs
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// All country codes from flagsapi.com
const COUNTRY_CODES = [
  'AD',
  'AE',
  'AF',
  'AG',
  'AI',
  'AH',
  'AK',
  'AL',
  'AM',
  'AN',
  'AO',
  'AQ',
  'AR',
  'AS',
  'AT',
  'AU',
  'AW',
  'AX',
  'AZ',
  'BA',
  'BB',
  'BD',
  'BE',
  'BF',
  'BG',
  'BH',
  'BI',
  'BJ',
  'BL',
  'BM',
  'BN',
  'BO',
  'BQ',
  'BR',
  'BS',
  'BT',
  'BV',
  'BW',
  'BY',
  'BZ',
  'CA',
  'CC',
  'CD',
  'CF',
  'CG',
  'CH',
  'CI',
  'CK',
  'CL',
  'CM',
  'CN',
  'CO',
  'CR',
  'CU',
  'CV',
  'CW',
  'CX',
  'CY',
  'CZ',
  'DE',
  'DJ',
  'DK',
  'DM',
  'DO',
  'DZ',
  'EC',
  'EE',
  'EG',
  'EH',
  'ER',
  'ES',
  'ET',
  'EU',
  'FI',
  'FJ',
  'FK',
  'FM',
  'FO',
  'FR',
  'GA',
  'GB',
  'GD',
  'GE',
  'GF',
  'GG',
  'GH',
  'GI',
  'GL',
  'GM',
  'GN',
  'GP',
  'GQ',
  'GR',
  'GS',
  'GT',
  'GU',
  'GW',
  'GY',
  'HK',
  'HM',
  'HN',
  'HR',
  'HT',
  'HU',
  'IC',
  'ID',
  'IE',
  'IL',
  'IM',
  'IN',
  'IO',
  'IQ',
  'IR',
  'IS',
  'IT',
  'JE',
  'JM',
  'JO',
  'JP',
  'KE',
  'KG',
  'KH',
  'KI',
  'KM',
  'KN',
  'KP',
  'KR',
  'KW',
  'KY',
  'KZ',
  'LA',
  'LB',
  'LC',
  'LI',
  'LK',
  'LR',
  'LS',
  'LT',
  'LU',
  'LV',
  'LY',
  'MA',
  'MC',
  'MD',
  'ME',
  'MF',
  'MG',
  'MH',
  'MK',
  'ML',
  'MM',
  'MN',
  'MO',
  'MP',
  'MQ',
  'MR',
  'MS',
  'MT',
  'MU',
  'MV',
  'MW',
  'MX',
  'MY',
  'MZ',
  'NA',
  'NC',
  'NE',
  'NF',
  'NG',
  'NI',
  'NL',
  'NO',
  'NP',
  'NR',
  'NU',
  'NY',
  'NZ',
  'OM',
  'PA',
  'PE',
  'PF',
  'PG',
  'PH',
  'PK',
  'PL',
  'PM',
  'PN',
  'PR',
  'PS',
  'PT',
  'PW',
  'PY',
  'QA',
  'RE',
  'RO',
  'RS',
  'RU',
  'RW',
  'SA',
  'SB',
  'SC',
  'SD',
  'SE',
  'SG',
  'SH',
  'SI',
  'SJ',
  'SK',
  'SL',
  'SM',
  'SN',
  'SO',
  'SR',
  'SS',
  'ST',
  'SV',
  'SX',
  'SY',
  'SZ',
  'TC',
  'TD',
  'TF',
  'TG',
  'TH',
  'TJ',
  'TK',
  'TL',
  'TM',
  'TN',
  'TO',
  'TR',
  'TT',
  'TV',
  'TW',
  'TZ',
  'UA',
  'UG',
  'UM',
  'US',
  'UY',
  'UZ',
  'VA',
  'VC',
  'VE',
  'VG',
  'VI',
  'VN',
  'VU',
  'WF',
  'WS',
  'XK',
  'YE',
  'YT',
  'ZA',
  'ZM',
  'ZW',
];

const STYLES = ['flat'];
const ZONE_TYPE = 'country'; // Flags will be saved to /flags/country/
const SIZE = 64;
const BASE_URL = 'https://flagsapi.com';

// Create directories
const publicDir = path.join(__dirname, '..', 'public');
const flagsDir = path.join(publicDir, 'flags');

if (!fs.existsSync(flagsDir)) {
  fs.mkdirSync(flagsDir, { recursive: true });
}

// Create directory for zone type (country)
const zoneTypeDir = path.join(flagsDir, ZONE_TYPE);
if (!fs.existsSync(zoneTypeDir)) {
  fs.mkdirSync(zoneTypeDir, { recursive: true });
}

/**
 * Download a single flag
 */
function downloadFlag(countryCode, style) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/${countryCode}/${style}/${SIZE}.png`;
    const filePath = path.join(flagsDir, 'country', `${countryCode}.png`);

    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      resolve({ countryCode, status: 'exists' });
      return;
    }

    const file = fs.createWriteStream(filePath);

    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          fs.unlink(filePath, () => {}); // Clean up partial file
          reject(new Error(`Failed to download ${countryCode}: ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          resolve({ countryCode, status: 'downloaded' });
        });
      })
      .on('error', (err) => {
        fs.unlink(filePath, () => {}); // Clean up partial file
        reject(err);
      });
  });
}

/**
 * Download all flags with progress tracking
 */
async function downloadAllFlags() {
  console.log('🏁 Starting flag download...');
  console.log(`📊 Total flags to download: ${COUNTRY_CODES.length}`);
  console.log(`📁 Destination: ${path.join(flagsDir, ZONE_TYPE)}`);
  console.log('');

  let downloaded = 0;
  let existed = 0;
  let failed = 0;

  // Use 'flat' style from the API, but save to country directory
  const style = STYLES[0];
  console.log(`\n📥 Downloading flags for zone type: ${ZONE_TYPE}...`);

  for (let i = 0; i < COUNTRY_CODES.length; i++) {
    const countryCode = COUNTRY_CODES[i];
    try {
      const result = await downloadFlag(countryCode, style);

      if (result.status === 'downloaded') {
        downloaded++;
        process.stdout.write(`✓ ${countryCode} `);
      } else if (result.status === 'exists') {
        existed++;
        process.stdout.write(`○ ${countryCode} `);
      }

      // New line every 10 flags for readability
      if ((i + 1) % 10 === 0) {
        process.stdout.write('\n');
      }
    } catch (error) {
      failed++;
      process.stdout.write(`✗ ${countryCode} `);
      if ((i + 1) % 10 === 0) {
        process.stdout.write('\n');
      }
    }

    // Small delay to avoid overwhelming the API
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  console.log('\n');

  console.log('\n✨ Download complete!');
  console.log(`📊 Summary:`);
  console.log(`   ✓ Downloaded: ${downloaded}`);
  console.log(`   ○ Already existed: ${existed}`);
  console.log(`   ✗ Failed: ${failed}`);
  console.log(`   📁 Location: ${path.join(flagsDir, ZONE_TYPE)}`);
}

// Run the download
downloadAllFlags().catch((error) => {
  console.error('❌ Error during download:', error);
  process.exit(1);
});
