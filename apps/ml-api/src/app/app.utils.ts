export const enumToJson = (enumObj: any) => {
  let json = {};
  for (const enumMember in enumObj) {
    if (!isNaN(parseInt(enumMember, 10))) {
      continue; // Skip numeric keys to avoid duplicates
    }
    json[enumMember] = enumObj[enumMember];
  }
  return json;
};
