import type {
  AdPlacement,
  AffiliateLink,
  Article,
  Attraction,
  Category,
  Hotel,
  Restaurant
} from "@/types/content";

const authorId = "11111111-1111-4111-8111-111111111111";

export const categories: Category[] = [
  { id: "20000000-0000-4000-8000-000000000001", name: "自由行", slug: "independent-travel", type: "article" },
  { id: "20000000-0000-4000-8000-000000000002", name: "迪士尼", slug: "disney", type: "article" },
  { id: "20000000-0000-4000-8000-000000000003", name: "住宿", slug: "hotels", type: "article" },
  { id: "20000000-0000-4000-8000-000000000004", name: "景點", slug: "attractions", type: "article" },
  { id: "20000000-0000-4000-8000-000000000005", name: "美食", slug: "food", type: "article" },
  { id: "21000000-0000-4000-8000-000000000001", name: "必去", slug: "must-visit", type: "attraction" },
  { id: "21000000-0000-4000-8000-000000000002", name: "免費", slug: "free", type: "attraction" },
  { id: "22000000-0000-4000-8000-000000000001", name: "本幫菜", slug: "shanghainese", type: "food" },
  { id: "22000000-0000-4000-8000-000000000002", name: "小籠包", slug: "xiaolongbao", type: "food" },
  { id: "23000000-0000-4000-8000-000000000001", name: "外灘", slug: "bund", type: "hotel" }
];

const shanghaiHero =
  "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&w=1200&q=70";
const disneyImage =
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=900&q=65";
const hotelImage =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=65";
const foodImage =
  "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=65";
const bundImage =
  "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&w=900&q=65";

export const articles: Article[] = [
  {
    id: "30000000-0000-4000-8000-000000000001",
    title: "上海自由行完整攻略",
    slug: "shanghai-independent-travel-guide",
    excerpt: "從台灣出發到上海自由行的行程、交通、住宿、美食與預算總整理。",
    content:
      "上海適合第一次中國自由行旅客，市區地鐵密集、景點集中，三到五天就能完成外灘、豫園、南京路、迪士尼與特色美食。建議第一天安排外灘與南京路，第二天走豫園與新天地，第三天預留給迪士尼或近郊水鄉。台灣旅客可先準備行動支付、VPN、地圖 App 與交通卡，住宿優先選人民廣場、南京東路、外灘或陸家嘴。",
    cover_image: shanghaiHero,
    category_id: "20000000-0000-4000-8000-000000000001",
    tags: ["自由行", "第一次上海", "交通", "預算"],
    author_id: authorId,
    status: "published",
    published_at: "2026-05-01T08:00:00.000Z",
    seo_title: "上海自由行完整攻略：行程、交通、住宿、美食一次看",
    seo_description: "台灣旅客上海自由行攻略，整理行程安排、地鐵交通、住宿區域、美食清單與預算建議。",
    og_image: shanghaiHero,
    schema_faq_json: [
      { question: "上海自由行建議玩幾天？", answer: "第一次造訪建議安排 4 到 5 天，可兼顧市區經典景點與上海迪士尼。" },
      { question: "台灣旅客住哪一區最方便？", answer: "人民廣場、南京東路、外灘與陸家嘴交通便利，適合第一次自由行。" }
    ],
    view_count: 1200
  },
  {
    id: "30000000-0000-4000-8000-000000000002",
    title: "上海迪士尼一日遊攻略",
    slug: "shanghai-disneyland-one-day-guide",
    excerpt: "上海迪士尼交通、門票、熱門設施、入園動線與 Klook 票券預訂提醒。",
    content:
      "上海迪士尼建議早到，熱門設施集中在幻想曲旋轉木馬、創極速光輪、加勒比海盜與翱翔飛越地平線。若從市區出發，可搭地鐵 11 號線到迪士尼站。旺季建議先購票並確認入園預約規則，當天使用官方 App 查看排隊時間。",
    cover_image: disneyImage,
    category_id: "20000000-0000-4000-8000-000000000002",
    tags: ["迪士尼", "門票", "親子", "Klook"],
    author_id: authorId,
    status: "published",
    published_at: "2026-05-02T08:00:00.000Z",
    seo_title: "上海迪士尼一日遊攻略：交通、門票、設施與路線",
    seo_description: "整理上海迪士尼一日遊動線、地鐵交通、必玩設施、門票與親子旅遊提醒。",
    og_image: disneyImage,
    schema_faq_json: [
      { question: "上海迪士尼怎麼去？", answer: "可搭上海地鐵 11 號線到迪士尼站，出站後依指示步行入園。" },
      { question: "上海迪士尼門票要先買嗎？", answer: "旺季與假日建議先購票並確認實名制與入園規定。" }
    ],
    view_count: 980
  },
  {
    id: "30000000-0000-4000-8000-000000000003",
    title: "上海住宿推薦區域分析",
    slug: "shanghai-best-hotel-districts",
    excerpt: "外灘、人民廣場、南京路、陸家嘴、迪士尼周邊住宿優缺點比較。",
    content:
      "上海住宿選區會直接影響交通時間。第一次自由行可選人民廣場或南京東路，喜歡夜景選外灘或陸家嘴，安排迪士尼則可住園區附近一晚。預算型旅客可往靜安寺、徐家匯或地鐵 2 號線周邊找房。",
    cover_image: hotelImage,
    category_id: "20000000-0000-4000-8000-000000000003",
    tags: ["住宿", "Agoda", "Booking", "外灘"],
    author_id: authorId,
    status: "published",
    published_at: "2026-05-03T08:00:00.000Z",
    seo_title: "上海住宿推薦區域分析：外灘、南京路、陸家嘴怎麼選",
    seo_description: "上海住宿區域比較，適合台灣自由行旅客快速選出便利、安全且符合預算的飯店位置。",
    og_image: hotelImage,
    schema_faq_json: [
      { question: "上海第一次自由行住哪裡？", answer: "人民廣場、南京東路與外灘最方便，地鐵與景點都集中。" }
    ],
    view_count: 860
  },
  {
    id: "30000000-0000-4000-8000-000000000004",
    title: "上海外灘夜景攻略",
    slug: "the-bund-night-view-guide",
    excerpt: "外灘最佳拍攝點、夜景時間、交通與周邊順遊路線。",
    content:
      "外灘是上海最經典的夜景地標。建議傍晚抵達，先從南京東路步行到外灘，再沿黃浦江畔欣賞陸家嘴天際線。拍照點可選外灘觀景平台、乍浦路橋或北外灘。",
    cover_image: bundImage,
    category_id: "20000000-0000-4000-8000-000000000004",
    tags: ["外灘", "夜景", "攝影", "免費景點"],
    author_id: authorId,
    status: "published",
    published_at: "2026-05-04T08:00:00.000Z",
    seo_title: "上海外灘夜景攻略：最佳拍照點與順遊路線",
    seo_description: "上海外灘夜景完整攻略，整理交通、拍攝位置、亮燈時間與周邊景點安排。",
    og_image: bundImage,
    schema_faq_json: [
      { question: "外灘夜景幾點去最好？", answer: "建議日落前後抵達，可同時拍到藍調與夜間燈光。" }
    ],
    view_count: 760
  },
  {
    id: "30000000-0000-4000-8000-000000000005",
    title: "上海美食必吃清單",
    slug: "shanghai-must-eat-food-list",
    excerpt: "小籠包、本幫菜、排骨年糕、咖啡廳與夜宵推薦。",
    content:
      "上海美食選擇非常多，第一次可先鎖定小籠包、本幫菜、排骨年糕與經典老字號。熱門餐廳建議避開尖峰用餐時間，或先查詢是否支援線上排隊。",
    cover_image: foodImage,
    category_id: "20000000-0000-4000-8000-000000000005",
    tags: ["美食", "小籠包", "本幫菜", "夜宵"],
    author_id: authorId,
    status: "published",
    published_at: "2026-05-05T08:00:00.000Z",
    seo_title: "上海美食必吃清單：小籠包、本幫菜與老字號",
    seo_description: "整理上海自由行必吃美食、經典餐廳、預算與熱門區域，適合台灣旅客收藏。",
    og_image: foodImage,
    schema_faq_json: [
      { question: "上海必吃料理有哪些？", answer: "小籠包、本幫紅燒菜、排骨年糕、鮮肉月餅與生煎都很具代表性。" }
    ],
    view_count: 900
  }
];

export const attractions: Attraction[] = [
  {
    id: "40000000-0000-4000-8000-000000000001",
    name: "外灘",
    slug: "the-bund",
    english_name: "The Bund",
    description: "上海最具代表性的黃浦江濱水景觀，能一次欣賞歷史建築群與陸家嘴天際線。",
    address: "上海市黃浦區中山東一路",
    district: "黃浦區",
    latitude: 31.2401,
    longitude: 121.4908,
    opening_hours: "全天開放",
    ticket_price: "免費",
    transport_info: "地鐵 2 / 10 號線南京東路站步行約 10 分鐘",
    cover_image: bundImage,
    gallery: [bundImage, shanghaiHero],
    category: "必去",
    tags: ["夜景", "免費", "攝影"],
    rating: 4.8,
    is_featured: true,
    seo_title: "上海外灘攻略：交通、夜景、拍照點",
    seo_description: "外灘是上海必去景點，整理交通方式、夜景拍攝點、附近美食住宿與順遊路線。"
  },
  {
    id: "40000000-0000-4000-8000-000000000002",
    name: "東方明珠",
    slug: "oriental-pearl-tower",
    english_name: "Oriental Pearl Tower",
    description: "陸家嘴地標觀景塔，可俯瞰黃浦江兩岸與上海城市天際線。",
    address: "上海市浦東新區世紀大道 1 號",
    district: "浦東新區",
    latitude: 31.2397,
    longitude: 121.4998,
    opening_hours: "09:00-21:00",
    ticket_price: "依官方票種為準",
    transport_info: "地鐵 2 號線陸家嘴站步行約 5 分鐘",
    cover_image: shanghaiHero,
    gallery: [shanghaiHero, bundImage],
    category: "夜景",
    tags: ["觀景台", "親子", "地標"],
    rating: 4.5,
    is_featured: true,
    seo_title: "東方明珠攻略：門票、交通與觀景重點",
    seo_description: "上海東方明珠旅遊攻略，含交通、門票、觀景角度與附近景點住宿推薦。"
  },
  {
    id: "40000000-0000-4000-8000-000000000003",
    name: "上海迪士尼",
    slug: "shanghai-disneyland",
    english_name: "Shanghai Disneyland",
    description: "華語旅客親子自由行熱門主題樂園，適合安排完整一天。",
    address: "上海市浦東新區川沙新鎮黃趙路 310 號",
    district: "浦東新區",
    latitude: 31.144,
    longitude: 121.657,
    opening_hours: "依官方營業時間為準",
    ticket_price: "依日期浮動",
    transport_info: "地鐵 11 號線迪士尼站",
    cover_image: disneyImage,
    gallery: [disneyImage],
    category: "親子",
    tags: ["迪士尼", "門票", "Klook"],
    rating: 4.7,
    is_featured: true,
    seo_title: "上海迪士尼攻略：交通、門票與設施安排",
    seo_description: "上海迪士尼一日遊景點頁，整理交通、票券、附近住宿與相關攻略文章。"
  },
  {
    id: "40000000-0000-4000-8000-000000000004",
    name: "豫園",
    slug: "yu-garden",
    english_name: "Yu Garden",
    description: "明代江南園林與老城廂商圈，適合搭配城隍廟與小吃行程。",
    address: "上海市黃浦區安仁街 218 號",
    district: "黃浦區",
    latitude: 31.2272,
    longitude: 121.4921,
    opening_hours: "09:00-16:30",
    ticket_price: "依季節票價為準",
    transport_info: "地鐵 10 / 14 號線豫園站",
    cover_image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=65",
    gallery: [],
    category: "必去",
    tags: ["園林", "老街", "小吃"],
    rating: 4.4,
    is_featured: false,
    seo_title: "上海豫園攻略：門票、交通與城隍廟順遊",
    seo_description: "豫園景點介紹，含交通、開放時間、票價、附近美食與上海老城廂路線。"
  },
  {
    id: "40000000-0000-4000-8000-000000000005",
    name: "南京路步行街",
    slug: "nanjing-road",
    english_name: "Nanjing Road Pedestrian Street",
    description: "上海經典商業街，適合購物、散步並一路走到外灘。",
    address: "上海市黃浦區南京東路",
    district: "黃浦區",
    latitude: 31.235,
    longitude: 121.475,
    opening_hours: "全天開放",
    ticket_price: "免費",
    transport_info: "地鐵 1 / 2 / 8 號線人民廣場站或 2 / 10 號線南京東路站",
    cover_image: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=900&q=65",
    gallery: [],
    category: "購物",
    tags: ["購物", "免費", "夜景"],
    rating: 4.3,
    is_featured: true,
    seo_title: "南京路步行街攻略：購物、交通與外灘路線",
    seo_description: "上海南京路步行街旅遊攻略，整理交通、購物動線與外灘順遊安排。"
  }
];

export const restaurants: Restaurant[] = [
  {
    id: "50000000-0000-4000-8000-000000000001",
    name: "南翔饅頭店",
    slug: "nanxiang-mantou-dian",
    description: "上海小籠包代表老店，豫園周邊人氣極高。",
    address: "上海市黃浦區豫園路 85 號",
    district: "黃浦區",
    latitude: 31.2279,
    longitude: 121.492,
    phone: "+86 21 6355 4206",
    opening_hours: "09:00-20:00",
    average_price: 250,
    cuisine_type: "小籠包",
    cover_image: foodImage,
    gallery: [foodImage],
    menu_images: [],
    rating: 4.2,
    is_featured: true,
    seo_title: "南翔饅頭店：上海小籠包老店攻略",
    seo_description: "南翔饅頭店餐廳介紹，含地址、交通、人均消費、附近景點住宿與美食攻略。"
  },
  {
    id: "50000000-0000-4000-8000-000000000002",
    name: "海底撈",
    slug: "haidilao-shanghai",
    description: "服務細緻的連鎖火鍋，適合多人與宵夜場。",
    address: "上海多分店",
    district: "黃浦區",
    latitude: 31.235,
    longitude: 121.475,
    phone: "",
    opening_hours: "依分店公告",
    average_price: 650,
    cuisine_type: "火鍋",
    cover_image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=65",
    gallery: [],
    menu_images: [],
    rating: 4.5,
    is_featured: true,
    seo_title: "上海海底撈攻略：分店、排隊與點餐提醒",
    seo_description: "上海海底撈餐廳資訊，適合火鍋、宵夜與多人用餐，整理預算與交通建議。"
  },
  {
    id: "50000000-0000-4000-8000-000000000003",
    name: "老吉士",
    slug: "old-jesse",
    description: "上海本幫菜名店，紅燒肉、蟹粉豆腐等菜色受歡迎。",
    address: "上海市徐匯區天平路 41 號",
    district: "徐匯區",
    latitude: 31.207,
    longitude: 121.443,
    phone: "+86 21 6282 9260",
    opening_hours: "11:00-14:00, 17:00-22:00",
    average_price: 900,
    cuisine_type: "本幫菜",
    cover_image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=65",
    gallery: [],
    menu_images: [],
    rating: 4.4,
    is_featured: true,
    seo_title: "老吉士上海本幫菜攻略",
    seo_description: "老吉士餐廳介紹，含本幫菜推薦、人均消費、地址與附近景點安排。"
  },
  {
    id: "50000000-0000-4000-8000-000000000004",
    name: "佳家湯包",
    slug: "jia-jia-tang-bao",
    description: "人民廣場周邊人氣湯包店，適合早餐或午餐。",
    address: "上海市黃浦區黃河路 90 號",
    district: "黃浦區",
    latitude: 31.236,
    longitude: 121.47,
    phone: "",
    opening_hours: "07:30-20:00",
    average_price: 180,
    cuisine_type: "小籠包",
    cover_image: foodImage,
    gallery: [],
    menu_images: [],
    rating: 4.3,
    is_featured: false,
    seo_title: "佳家湯包攻略：人民廣場小籠包推薦",
    seo_description: "佳家湯包餐廳資訊，整理地址、營業時間、人均消費與附近住宿景點。"
  },
  {
    id: "50000000-0000-4000-8000-000000000005",
    name: "光明邨大酒家",
    slug: "guangmingcun-restaurant",
    description: "上海老字號餐廳與熟食名店，鮮肉月餅與本幫菜都受歡迎。",
    address: "上海市黃浦區淮海中路 588 號",
    district: "黃浦區",
    latitude: 31.221,
    longitude: 121.468,
    phone: "",
    opening_hours: "10:00-21:00",
    average_price: 350,
    cuisine_type: "本幫菜",
    cover_image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=65",
    gallery: [],
    menu_images: [],
    rating: 4.1,
    is_featured: true,
    seo_title: "光明邨大酒家攻略：上海老字號美食",
    seo_description: "光明邨大酒家介紹，含推薦菜、人均消費、地址與上海老字號美食路線。"
  }
];

export const hotels: Hotel[] = [
  {
    id: "60000000-0000-4000-8000-000000000001",
    name: "上海外灘 W 酒店",
    slug: "w-shanghai-the-bund",
    description: "北外灘設計型高端飯店，適合重視江景與潮流風格的旅客。",
    address: "上海市虹口區旅順路 66 號",
    district: "虹口區",
    latitude: 31.2507,
    longitude: 121.5006,
    star_rating: 5,
    price_range: "高價位",
    cover_image: hotelImage,
    gallery: [hotelImage],
    rating: 4.7,
    agoda_url: "https://www.agoda.com/search?city=3987",
    booking_url: "https://www.booking.com/searchresults.html?ss=Shanghai",
    trip_url: "https://www.trip.com/hotels/list?city=2",
    is_featured: true,
    seo_title: "上海外灘 W 酒店住宿攻略",
    seo_description: "上海外灘 W 酒店介紹，含地點、房價區間、附近景點、美食與 Agoda Booking 預訂連結。"
  },
  {
    id: "60000000-0000-4000-8000-000000000002",
    name: "上海和平飯店",
    slug: "fairmont-peace-hotel",
    description: "外灘經典歷史飯店，適合想體驗老上海建築氛圍的旅客。",
    address: "上海市黃浦區南京東路 20 號",
    district: "黃浦區",
    latitude: 31.239,
    longitude: 121.4905,
    star_rating: 5,
    price_range: "高價位",
    cover_image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=65",
    gallery: [],
    rating: 4.8,
    agoda_url: "https://www.agoda.com/search?city=3987",
    booking_url: "https://www.booking.com/searchresults.html?ss=Shanghai",
    trip_url: "https://www.trip.com/hotels/list?city=2",
    is_featured: true,
    seo_title: "上海和平飯店：外灘歷史飯店住宿攻略",
    seo_description: "上海和平飯店住宿介紹，整理外灘位置、星級、價格區間、附近景點與訂房連結。"
  },
  {
    id: "60000000-0000-4000-8000-000000000003",
    name: "上海浦東麗思卡爾頓",
    slug: "ritz-carlton-shanghai-pudong",
    description: "陸家嘴高樓景觀飯店，適合想看外灘夜景與高端住宿體驗的旅客。",
    address: "上海市浦東新區世紀大道 8 號",
    district: "浦東新區",
    latitude: 31.2368,
    longitude: 121.5019,
    star_rating: 5,
    price_range: "高價位",
    cover_image: hotelImage,
    gallery: [],
    rating: 4.8,
    agoda_url: "https://www.agoda.com/search?city=3987",
    booking_url: "https://www.booking.com/searchresults.html?ss=Shanghai",
    trip_url: "https://www.trip.com/hotels/list?city=2",
    is_featured: true,
    seo_title: "上海浦東麗思卡爾頓住宿攻略",
    seo_description: "上海浦東麗思卡爾頓飯店介紹，含陸家嘴位置、夜景、附近景點與訂房連結。"
  },
  {
    id: "60000000-0000-4000-8000-000000000004",
    name: "上海迪士尼樂園酒店",
    slug: "shanghai-disneyland-hotel",
    description: "迪士尼園區主題飯店，適合親子旅客與早入園行程。",
    address: "上海市浦東新區申迪西路 1009 號",
    district: "浦東新區",
    latitude: 31.148,
    longitude: 121.66,
    star_rating: 5,
    price_range: "高價位",
    cover_image: disneyImage,
    gallery: [],
    rating: 4.6,
    agoda_url: "https://www.agoda.com/search?city=3987",
    booking_url: "https://www.booking.com/searchresults.html?ss=Shanghai%20Disney",
    trip_url: "https://www.trip.com/hotels/list?city=2",
    is_featured: true,
    seo_title: "上海迪士尼樂園酒店住宿攻略",
    seo_description: "上海迪士尼樂園酒店介紹，整理親子住宿、園區交通、房價區間與票券搭配。"
  },
  {
    id: "60000000-0000-4000-8000-000000000005",
    name: "上海南京路附近飯店",
    slug: "nanjing-road-nearby-hotel",
    description: "人民廣場與南京東路周邊的高便利住宿選擇，適合第一次上海自由行。",
    address: "上海市黃浦區南京路周邊",
    district: "黃浦區",
    latitude: 31.235,
    longitude: 121.476,
    star_rating: 4,
    price_range: "中價位",
    cover_image: hotelImage,
    gallery: [],
    rating: 4.3,
    agoda_url: "https://www.agoda.com/search?city=3987",
    booking_url: "https://www.booking.com/searchresults.html?ss=Nanjing%20Road%20Shanghai",
    trip_url: "https://www.trip.com/hotels/list?city=2",
    is_featured: true,
    seo_title: "上海南京路附近飯店推薦",
    seo_description: "南京路附近住宿推薦，適合上海第一次自由行，整理交通、價格區間與附近景點。"
  }
];

export const affiliateLinks: AffiliateLink[] = [
  {
    id: "70000000-0000-4000-8000-000000000001",
    title: "Klook 上海迪士尼門票",
    provider: "klook",
    type: "ticket",
    related_type: "attraction",
    related_id: "40000000-0000-4000-8000-000000000003",
    url: "https://www.klook.com/",
    commission_note: "上海迪士尼票券分潤連結，請替換為實際 affiliate URL。",
    is_active: true,
    click_count: 0
  },
  {
    id: "70000000-0000-4000-8000-000000000002",
    title: "Klook 上海一日遊",
    provider: "klook",
    type: "tour",
    related_type: "article",
    related_id: "30000000-0000-4000-8000-000000000001",
    url: "https://www.klook.com/",
    commission_note: "上海行程體驗 affiliate URL placeholder。",
    is_active: true,
    click_count: 0
  },
  {
    id: "70000000-0000-4000-8000-000000000003",
    title: "Agoda 上海飯店",
    provider: "agoda",
    type: "hotel",
    related_type: "hotel",
    related_id: "60000000-0000-4000-8000-000000000001",
    url: "https://www.agoda.com/search?city=3987",
    commission_note: "Agoda 上海飯店 affiliate URL placeholder。",
    is_active: true,
    click_count: 0
  },
  {
    id: "70000000-0000-4000-8000-000000000004",
    title: "Booking 上海飯店",
    provider: "booking",
    type: "hotel",
    related_type: "hotel",
    related_id: "60000000-0000-4000-8000-000000000002",
    url: "https://www.booking.com/searchresults.html?ss=Shanghai",
    commission_note: "Booking.com 上海飯店 affiliate URL placeholder。",
    is_active: true,
    click_count: 0
  },
  {
    id: "70000000-0000-4000-8000-000000000005",
    title: "Travelpayouts 上海飯店比價",
    provider: "travelpayouts",
    type: "hotel",
    related_type: "article",
    related_id: "30000000-0000-4000-8000-000000000003",
    url: "https://www.booking.com/searchresults.html?ss=Shanghai",
    original_url: "https://www.booking.com/searchresults.html?ss=Shanghai",
    sub_id: "homepage-hotel",
    commission_note: "Travelpayouts partner link placeholder，請在後台生成正式連結。",
    is_active: true,
    click_count: 0
  }
];

export const adPlacements: AdPlacement[] = [
  { id: "80000000-0000-4000-8000-000000000001", name: "首頁上方", placement: "home_top_970x250", size: "970x250", ad_type: "adsense", adsense_slot: null, image_url: null, target_url: null, is_active: true },
  { id: "80000000-0000-4000-8000-000000000002", name: "首頁中段", placement: "home_middle_728x90", size: "728x90", ad_type: "adsense", adsense_slot: null, image_url: null, target_url: null, is_active: true },
  { id: "80000000-0000-4000-8000-000000000003", name: "文章文首", placement: "article_top_728x90", size: "728x90", ad_type: "adsense", adsense_slot: null, image_url: null, target_url: null, is_active: true },
  { id: "80000000-0000-4000-8000-000000000004", name: "文章文中", placement: "article_middle_300x250", size: "300x250", ad_type: "adsense", adsense_slot: null, image_url: null, target_url: null, is_active: true },
  { id: "80000000-0000-4000-8000-000000000005", name: "文章文末", placement: "article_bottom_336x280", size: "336x280", ad_type: "adsense", adsense_slot: null, image_url: null, target_url: null, is_active: true }
];

export function getCategory(id: string) {
  return categories.find((category) => category.id === id);
}

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug && article.status === "published");
}

export function getAttractionBySlug(slug: string) {
  return attractions.find((attraction) => attraction.slug === slug);
}

export function getRestaurantBySlug(slug: string) {
  return restaurants.find((restaurant) => restaurant.slug === slug);
}

export function getHotelBySlug(slug: string) {
  return hotels.find((hotel) => hotel.slug === slug);
}

export function getRelatedArticles(tags: string[], currentSlug?: string, limit = 3) {
  return articles
    .filter((article) => article.status === "published" && article.slug !== currentSlug)
    .sort((a, b) => {
      const aScore = a.tags.filter((tag) => tags.includes(tag)).length;
      const bScore = b.tags.filter((tag) => tags.includes(tag)).length;
      return bScore - aScore || b.view_count - a.view_count;
    })
    .slice(0, limit);
}

export function getNearbyByDistrict<T extends { district: string }>(items: T[], district: string, limit = 3) {
  return items.filter((item) => item.district === district).slice(0, limit);
}

export function getAffiliateLinksFor(relatedType: string, relatedId: string) {
  return affiliateLinks.filter(
    (link) => link.is_active && link.related_type === relatedType && link.related_id === relatedId
  );
}

export const mapMarkers = [
  ...attractions.map((item) => ({ ...item, markerType: "景點" as const, href: `/attractions/${item.slug}` })),
  ...restaurants.map((item) => ({ ...item, markerType: "美食" as const, href: `/food/${item.slug}` })),
  ...hotels.map((item) => ({ ...item, markerType: "住宿" as const, href: `/hotels/${item.slug}` }))
];
