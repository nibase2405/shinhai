export const searchTypes = [
  { value: "all", label: "全部類型" },
  { value: "article", label: "攻略文章" },
  { value: "attraction", label: "景點" },
  { value: "restaurant", label: "美食" },
  { value: "hotel", label: "住宿" }
] as const;

export const shanghaiDistricts = [
  "黃浦區",
  "徐匯區",
  "長寧區",
  "靜安區",
  "普陀區",
  "虹口區",
  "楊浦區",
  "浦東新區",
  "閔行區",
  "寶山區",
  "嘉定區",
  "金山區",
  "松江區",
  "青浦區",
  "奉賢區",
  "崇明區"
] as const;

export type SearchType = (typeof searchTypes)[number]["value"];

export function isSearchType(value: string | undefined): value is SearchType {
  return searchTypes.some((type) => type.value === value);
}

export function isShanghaiDistrict(value: string | undefined): value is (typeof shanghaiDistricts)[number] {
  return shanghaiDistricts.some((district) => district === value);
}
