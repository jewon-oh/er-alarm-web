import {countries, CountryCode, CountryName} from "@/constants/countries";

function isCountryCode(code: string): code is CountryCode {
  return code in countries;
}

export function country(codeRaw: string | undefined): CountryName | undefined {
  if (!codeRaw) return;
  const code = codeRaw.toLowerCase().trim();
  if (!isCountryCode(code)) return;       // 코드가 map에 없으면 undefined
  return countries[code];
}


/**
 * countryName 으로부터 CountryCode(alpha-2)를 얻어 옵니다.
 * - " United   States " → "us"
 * - 일치하는 이름이 없으면 undefined 반환
 */
export function getCountryCode(nameRaw: string | undefined): CountryCode | undefined {
  if (!nameRaw) return;

  // 1) 연속된 공백을 하나로, 앞뒤 공백 제거
  const name = nameRaw.replace(/\s+/g, " ").trim().toLowerCase();

  // 2) countries 객체(entry)의 [code, displayName] 배열로 접근
  const entry = (Object.entries(countries) as [CountryCode, CountryName][])
      .find(([, displayName]) => displayName.toLowerCase() === name);

  // 3) 찾았으면 코드, 못 찾았으면 undefined
  return entry?.[0];
}