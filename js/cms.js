/* ═══════════════════════════════════════════════
   鴻匠工程 — CMS Content Loader v1.0
   Reads from localStorage and applies to pages.
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  const KEY      = 'hj_cms_v1';
  const AUTH_KEY = 'hj_auth_v2';

  /* Helper: escape HTML */
  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  const CAT_LABELS = {
    water: '水電工程', interior: '室內裝修',
    design: '設計規劃', commercial: '商業空間'
  };

  // Maps page filename to gallery category filter (null = no filter)
  const PAGE_CAT = {
    'service-water.html': 'water',
    'service-interior.html': 'interior',
    'service-design.html': 'design',
    'service-maintenance.html': null
  };

  const CMS_SCHEMA = {



    "service-water.html": {
        "name": "服務：水電工程",
        "items": [
            {
                "group": "主視覺 (Hero)",
                "key": "hero.title",
                "label": "大標題",
                "type": "text",
                "default": "專業水電<br /><span class=\"blue\">配管工程</span>"
            },
            {
                "group": "主視覺 (Hero)",
                "key": "hero.desc",
                "label": "副標題/引言",
                "type": "textarea",
                "default": "給排水系統規劃配管、電氣迴路設計、弱電系統整合，確保每一處管線安全耐用、符合建築法規標準。"
            },
            {
                "group": "主視覺 (Hero)",
                "key": "hero.experience",
                "label": "專業經驗標語",
                "type": "text",
                "default": "20年專業經驗"
            },
            {
                "group": "核心服務卡片",
                "key": "card.1.title",
                "label": "卡片1 標題",
                "type": "text",
                "default": "給排水配管"
            },
            {
                "group": "核心服務卡片",
                "key": "card.1.desc",
                "label": "卡片1 內文",
                "type": "textarea",
                "default": "自來水管全室更換、熱水管路安裝、廚衛排水配管、管路防漏處理"
            },
            {
                "group": "核心服務卡片",
                "key": "card.2.title",
                "label": "卡片2 標題",
                "type": "text",
                "default": "電氣迴路配線"
            },
            {
                "group": "核心服務卡片",
                "key": "card.2.desc",
                "label": "卡片2 內文",
                "type": "textarea",
                "default": "全室電氣迴路設計、配電箱更換、插座開關更新、照明迴路安裝"
            },
            {
                "group": "核心服務卡片",
                "key": "card.3.title",
                "label": "卡片3 標題",
                "type": "text",
                "default": "弱電系統整合"
            },
            {
                "group": "核心服務卡片",
                "key": "card.3.desc",
                "label": "卡片3 內文",
                "type": "textarea",
                "default": "網路線佈設、電視天線、門禁對講機、監視系統、智能家居配線"
            },
            {
                "group": "核心服務卡片",
                "key": "card.4.title",
                "label": "卡片4 標題",
                "type": "text",
                "default": "消防緊急系統"
            },
            {
                "group": "核心服務卡片",
                "key": "card.4.desc",
                "label": "卡片4 內文",
                "type": "textarea",
                "default": "消防灑水管配管、緊急照明配線、火警感知器、避雷針接地工程"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.title",
                "label": "項目1 標題",
                "type": "text",
                "default": "給水排水系統規劃與配管"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "自來水管全室更換（PPR / PVC 管材）"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "熱水器管路安裝與更新"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "廚房廁所排水配管"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "管路防漏處理與測試"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "水壓測試與品質驗收"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "給水加壓馬達安裝"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "衛生設備安裝（馬桶/浴缸/洗手台）"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "鑄鐵管汰換為新式管材"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.title",
                "label": "項目2 標題",
                "type": "text",
                "default": "電氣迴路規劃與配線"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "全室電氣迴路設計規劃"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "配電箱更換（無熔絲開關）"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "插座 / 開關全室更新"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "照明迴路規劃安裝"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "空調電源迴路配線"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "廚房大功率設備迴路"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "接地線施工"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "用電安全檢查報告"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.title",
                "label": "項目3 標題",
                "type": "text",
                "default": "弱電系統整合佈設"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "網路線（Cat6）全室佈設"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "電視天線 / 有線電視"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "門禁對講機系統"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "保全監視系統配線"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "智能家居系統整合"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "音響系統佈線"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "弱電箱彙整美化"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "光纖入戶配線"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.title",
                "label": "項目4 標題",
                "type": "text",
                "default": "消防與緊急系統"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "消防灑水頭配管"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "緊急照明電源配線"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "消防廣播系統"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "火警感知器安裝"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "避雷針接地工程"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "備用電源 UPS 配置"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "緊急出口指示燈"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "消防系統年度維護"
            }
        ]
    },
    "service-interior.html": {
        "name": "服務：室內裝修",
        "items": [
            {
                "group": "主視覺 (Hero)",
                "key": "hero.title",
                "label": "大標題",
                "type": "text",
                "default": "精緻室內<br /><span class=\"blue\">裝修工程</span>"
            },
            {
                "group": "主視覺 (Hero)",
                "key": "hero.desc",
                "label": "副標題/引言",
                "type": "textarea",
                "default": "客廳、廚房、衛浴到全室翻新，融合美學設計與工藝施工，打造符合您生活品味的理想居家。"
            },
            {
                "group": "主視覺 (Hero)",
                "key": "hero.experience",
                "label": "專業經驗標語",
                "type": "text",
                "default": "20年專業經驗"
            },
            {
                "group": "核心服務卡片",
                "key": "card.1.title",
                "label": "卡片1 標題",
                "type": "text",
                "default": "客廳・餐廳"
            },
            {
                "group": "核心服務卡片",
                "key": "card.1.desc",
                "label": "卡片1 內文",
                "type": "textarea",
                "default": "天花板、地板、牆面、造型電視牆、間接照明、隔間牆施工"
            },
            {
                "group": "核心服務卡片",
                "key": "card.2.title",
                "label": "卡片2 標題",
                "type": "text",
                "default": "廚房改造"
            },
            {
                "group": "核心服務卡片",
                "key": "card.2.desc",
                "label": "卡片2 內文",
                "type": "textarea",
                "default": "系統廚具、流理台面材、磁磚鋪設、抽油煙機管路配合"
            },
            {
                "group": "核心服務卡片",
                "key": "card.3.title",
                "label": "卡片3 標題",
                "type": "text",
                "default": "衛浴改造"
            },
            {
                "group": "核心服務卡片",
                "key": "card.3.desc",
                "label": "卡片3 內文",
                "type": "textarea",
                "default": "防水工程、磁磚鋪設、馬桶浴缸安裝、乾濕分離施工"
            },
            {
                "group": "核心服務卡片",
                "key": "card.4.title",
                "label": "卡片4 標題",
                "type": "text",
                "default": "全室翻新"
            },
            {
                "group": "核心服務卡片",
                "key": "card.4.desc",
                "label": "卡片4 內文",
                "type": "textarea",
                "default": "舊屋整建、壁癌處理、管線汰換、全室粉刷一次到位"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.title",
                "label": "項目1 標題",
                "type": "text",
                "default": "客廳・餐廳施工"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "天花板輕鋼架 / 矽酸鈣板工程"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "造型天花板設計施作"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "地板鋪設（磁磚 / 木地板 / 石材）"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "牆面粉刷與裝飾"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "電視牆造型設計"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "間接照明施工"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "窗簾盒施作"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "隔間牆施工"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.title",
                "label": "項目2 標題",
                "type": "text",
                "default": "廚房裝修工程"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "廚房系統廚具安裝"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "流理台面材鋪設"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "廚房磁磚拆除重鋪"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "抽油煙機管路配合"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "嵌入式廚具安裝"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "廚房水電配合施工"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "廚房防水工程"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "廚房門更換"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.title",
                "label": "項目3 標題",
                "type": "text",
                "default": "衛浴改造工程"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "衛浴全室防水工程"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "磁磚拆除及重新鋪設"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "馬桶 / 浴缸 / 淋浴拉門安裝"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "浴室鏡櫃 / 收納安裝"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "乾濕分離施工"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "排風設備安裝"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "浴室暖風機安裝"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "五金配件更換"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.title",
                "label": "項目4 標題",
                "type": "text",
                "default": "臥室・書房工程"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "系統衣櫃規劃安裝"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "書桌書架客製製作"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "臥室地板鋪設"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "滑門拉門安裝"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "臥室燈光規劃"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "更衣間規劃施作"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "窗戶氣密施工"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "窗簾軌道安裝"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.title",
                "label": "項目5 標題",
                "type": "text",
                "default": "舊屋翻新整合"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "壁癌處理與防水補強"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "管線全室汰換"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "隔間牆調整拆除"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "門窗框更換"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "外牆防水施工"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "地板底層整平"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "全室粉刷翻新"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "陽台外推 / 整修"
            }
        ]
    },
    "service-design.html": {
        "name": "服務：設計規劃",
        "items": [
            {
                "group": "主視覺 (Hero)",
                "key": "hero.title",
                "label": "大標題",
                "type": "text",
                "default": "空間設計<br /><span class=\"blue\">量身規劃</span>"
            },
            {
                "group": "主視覺 (Hero)",
                "key": "hero.desc",
                "label": "副標題/引言",
                "type": "textarea",
                "default": "由專業室內設計師主導，從風格定義到施工圖面，全程陪伴您完成理想空間的每一個細節。"
            },
            {
                "group": "主視覺 (Hero)",
                "key": "hero.experience",
                "label": "專業經驗標語",
                "type": "text",
                "default": "20年專業經驗"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.title",
                "label": "項目1 標題",
                "type": "text",
                "default": "風格定義與概念規劃"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "風格喜好分析"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "生活動線規劃"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "空間機能需求評估"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "色彩計畫提案"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "材質板製作"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "燈光氛圍規劃"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "家具配置建議"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "預算分配規劃"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.title",
                "label": "項目2 標題",
                "type": "text",
                "default": "平面配置與 3D 效果圖"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "現況丈量與平面繪製"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "平面配置方案比較"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "3D 空間模擬效果圖"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "材料選色 3D 呈現"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "各場域施工透視圖"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "視角調整與修改確認"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "鳥瞰全室配置圖"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "夜間燈光效果模擬"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.title",
                "label": "項目3 標題",
                "type": "text",
                "default": "施工圖面與材料規格"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "詳細施工平面圖"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "天花板施工圖"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "立面施工圖"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "水電整合圖"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "材料規格書製作"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "建材樣品確認"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "建材代購服務"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "施工規格說明書"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.title",
                "label": "項目4 標題",
                "type": "text",
                "default": "工程監造與施工管理"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "工程進度排程管理"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "施工廠商協調溝通"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "現場施工品質監督"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "設計變更處理"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "驗收前品質確認"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "完工後缺失清查"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "材料進場驗收"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "施工照片記錄"
            }
        ]
    },
    "service-maintenance.html": {
        "name": "服務：維修保固",
        "items": [
            {
                "group": "主視覺 (Hero)",
                "key": "hero.title",
                "label": "大標題",
                "type": "text",
                "default": "完工之後<br /><span class=\"blue\">全程守護</span>"
            },
            {
                "group": "主視覺 (Hero)",
                "key": "hero.desc",
                "label": "副標題/引言",
                "type": "textarea",
                "default": "完工不是終點，兩年保固是我們的承諾。24小時緊急維修專線，讓您安心享受理想空間。"
            },
            {
                "group": "主視覺 (Hero)",
                "key": "hero.experience",
                "label": "專業經驗標語",
                "type": "text",
                "default": "20年專業經驗"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.title",
                "label": "項目1 標題",
                "type": "text",
                "default": "兩年工程保固服務"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "水電工程保固兩年"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "結構施工保固兩年"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "防水工程保固兩年"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "系統傢具保固兩年"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "保固範圍透明說明"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "保固申請快速回應"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "到府檢修不加收費用"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "維修記錄完整建檔"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.title",
                "label": "項目2 標題",
                "type": "text",
                "default": "緊急維修服務"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "24小時維修專線"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "水管漏水緊急搶修"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "電路跳電故障排除"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "排水堵塞疏通"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "緊急門窗修復"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "颱風後損害修繕"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "優先排程不等待"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "夜間假日均可出勤"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.title",
                "label": "項目3 標題",
                "type": "text",
                "default": "定期維護保養"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "年度水電安全檢查"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "管線使用狀況評估"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "電氣設備安全測試"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "空調系統定期保養"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "防水層定期檢查"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "維修保養記錄建檔"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "老化零件提前更換建議"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "用電效率評估報告"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.title",
                "label": "項目4 標題",
                "type": "text",
                "default": "舊屋診斷服務"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "免費到府現況評估"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "壁癌原因診斷"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "漏水源頭追蹤"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "管線老化評估"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "用電安全檢查"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "裝修工程需求評估"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "改善方案建議"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "費用估算報告"
            }
        ]
    }
,

    "index.html": {
        "name": "首頁",
        "items": [
            {
                "group": "主視覺 (Hero)",
                "key": "hero.title",
                "label": "大標題",
                "type": "text",
                "default": "為您打造<br /><span class=\"blue\">理想空間</span>"
            },
            {
                "group": "主視覺 (Hero)",
                "key": "hero.desc",
                "label": "副標題/引言",
                "type": "textarea",
                "default": "專業室內設計與裝修團隊，提供住宅、商辦、商業空間等全方位解決方案。"
            },
            {
                "group": "專業服務區塊",
                "key": "services.title",
                "label": "區塊標題",
                "type": "text",
                "default": "完整的工程<br /><span class=\"blue\">解決方案</span>"
            },
            {
                "group": "專業服務區塊",
                "key": "services.desc",
                "label": "區塊副標",
                "type": "textarea",
                "default": "從基礎水電到精緻裝修，提供全方位的居家工程服務，讓您的空間煥然一新。"
            },
            {
                "group": "專業服務區塊",
                "key": "services.1.title",
                "label": "服務一標題",
                "type": "text",
                "default": "水電工程"
            },
            {
                "group": "專業服務區塊",
                "key": "services.1.desc",
                "label": "服務一簡述",
                "type": "textarea",
                "default": "全室管線更新、迴路規劃、衛浴設備安裝。"
            },
            {
                "group": "專業服務區塊",
                "key": "services.2.title",
                "label": "服務二標題",
                "type": "text",
                "default": "室內裝修"
            },
            {
                "group": "專業服務區塊",
                "key": "services.2.desc",
                "label": "服務二簡述",
                "type": "textarea",
                "default": "客變規劃、老屋翻新、風格營造與施工。"
            },
            {
                "group": "專業服務區塊",
                "key": "services.3.title",
                "label": "服務三標題",
                "type": "text",
                "default": "設計規劃"
            },
            {
                "group": "專業服務區塊",
                "key": "services.3.desc",
                "label": "服務三簡述",
                "type": "textarea",
                "default": "專業設計師諮詢、3D圖面與施工圖繪製。"
            },
            {
                "group": "專業服務區塊",
                "key": "services.4.title",
                "label": "服務四標題",
                "type": "text",
                "default": "售後保固"
            },
            {
                "group": "專業服務區塊",
                "key": "services.4.desc",
                "label": "服務四簡述",
                "type": "textarea",
                "default": "完工後兩年保固，提供緊急維修專線。"
            },
            {
                "group": "關於我們區塊",
                "key": "about.title",
                "label": "區塊標題",
                "type": "text",
                "default": "精工細節<br /><span class=\"blue\">每一個細節都是承諾</span>"
            },
            {
                "group": "關於我們區塊",
                "key": "about.desc",
                "label": "區塊內文",
                "type": "textarea",
                "default": "鴻匠工程成立於 2004 年，專注住宅與商業空間的水電工程與室內裝修。<br>我們擁有由資深師傅組成的施工團隊，秉持「品質第一，客戶至上」的經營理念。<br>二十年來累積過八百件完工案例，深受客戶信賴。"
            },
            {
                "group": "關於我們區塊",
                "key": "about.feat1",
                "label": "特點一",
                "type": "text",
                "default": "國家認證乙級技術士證照"
            },
            {
                "group": "關於我們區塊",
                "key": "about.feat2",
                "label": "特點二",
                "type": "text",
                "default": "每日工區照片進度回報"
            },
            {
                "group": "關於我們區塊",
                "key": "about.feat3",
                "label": "特點三",
                "type": "text",
                "default": "優質建材嚴選，拒絕偷工減料"
            },
            {
                "group": "關於我們區塊",
                "key": "about.feat4",
                "label": "特點四",
                "type": "text",
                "default": "完工後兩年工程品質保固"
            },
            {
                "group": "客戶見證區塊",
                "key": "testi.title",
                "label": "區塊標題",
                "type": "text",
                "default": "聽聽，他們的好評<span class=\"blue\"> 回饋</span>"
            },
            {
                "group": "客戶見證區塊",
                "key": "testi.1.text",
                "label": "評價一 內容",
                "type": "textarea",
                "default": "鴻匠的師傅非常專業，工期抓得很準，沒有影響到正常生活作息。工程品質無可挑剔！"
            },
            {
                "group": "客戶見證區塊",
                "key": "testi.1.author",
                "label": "評價一 客戶",
                "type": "text",
                "default": "林先生"
            },
            {
                "group": "客戶見證區塊",
                "key": "testi.1.role",
                "label": "評價一 身份",
                "type": "text",
                "default": "台北市・全室裝修客戶"
            },
            {
                "group": "客戶見證區塊",
                "key": "testi.2.text",
                "label": "評價二 內容",
                "type": "textarea",
                "default": "水電工程做得非常仔細，管線走線整齊美觀，師傅還主動幫忙修了幾個小隱患，令人安心。"
            },
            {
                "group": "客戶見證區塊",
                "key": "testi.2.author",
                "label": "評價二 客戶",
                "type": "text",
                "default": "陳小姐"
            },
            {
                "group": "客戶見證區塊",
                "key": "testi.2.role",
                "label": "評價二 身份",
                "type": "text",
                "default": "新北市・水電工程客戶"
            },
            {
                "group": "客戶見證區塊",
                "key": "testi.3.text",
                "label": "評價三 內容",
                "type": "textarea",
                "default": "報價實在，沒有隱藏費用，施工過程每天拍照回報，遇到小問題也立刻安排師傅處理。"
            },
            {
                "group": "客戶見證區塊",
                "key": "testi.3.author",
                "label": "評價三 客戶",
                "type": "text",
                "default": "張先生"
            },
            {
                "group": "客戶見證區塊",
                "key": "testi.3.role",
                "label": "評價三 身份",
                "type": "text",
                "default": "台中市・廚房改造客戶"
            },
            {
                "group": "底部行動呼籲 (CTA)",
                "key": "cta.title",
                "label": "CTA 標題",
                "type": "text",
                "default": "開始您的裝修計畫<br />今天就聯繫我們"
            },
            {
                "group": "底部行動呼籲 (CTA)",
                "key": "cta.desc",
                "label": "CTA 副標",
                "type": "text",
                "default": "免費到府估價 · 透明報價 · 二年保固 · 全台接案"
            },
            {
                "group": "底部行動呼籲 (CTA)",
                "key": "cta.btn",
                "label": "CTA 按鈕文字",
                "type": "text",
                "default": "立即免費諮詢"
            },
            { "group": "頁尾與聯絡資訊 (Footer)", "key": "footer.tagline", "label": "品牌標語 / 鴻匠工程下方介紹", "type": "textarea", "default": "二十年工藝傳承，讓每一個空間都成為值得驕傲的作品。" },
            { "group": "頁尾與聯絡資訊 (Footer)", "key": "footer.phone1", "label": "聯絡電話 1 (主)", "type": "text", "default": "(02) 2345-6789" },
            { "group": "頁尾與聯絡資訊 (Footer)", "key": "footer.phone2", "label": "聯絡電話 2 (手機)", "type": "text", "default": "0912-345-678" },
            { "group": "頁尾與聯絡資訊 (Footer)", "key": "footer.email", "label": "電子郵件", "type": "text", "default": "service@hongjiang.com.tw" },
            { "group": "頁尾與聯絡資訊 (Footer)", "key": "footer.address", "label": "服務區域", "type": "text", "default": "台北・新北・桃園・台中・全台接洽" },
            { "group": "頁尾與聯絡資訊 (Footer)", "key": "footer.hours", "label": "服務時間", "type": "text", "default": "週一至週六 08:00 — 18:00" },
            { "group": "頁尾與聯絡資訊 (Footer)", "key": "footer.copyright", "label": "版權與統一編號", "type": "text", "default": "© 2024 鴻匠工程有限公司 · 統一編號：12345678" }
        ]
    },
    "about.html": {
        "name": "關於我們",
        "items": [
            {
                "group": "主視覺 (Hero)",
                "key": "hero.title",
                "label": "大標題",
                "type": "text",
                "default": "二十年工藝<br /><span class=\"blue\">傳承與堅持</span>"
            },
            {
                "group": "主視覺 (Hero)",
                "key": "hero.desc",
                "label": "副標題/引言",
                "type": "textarea",
                "default": "從一份對工藝的熱忱出發，鴻匠工程二十年來守護每一個家庭的居住品質。"
            },
            {
                "group": "品牌理念",
                "key": "mission.title",
                "label": "區塊標題",
                "type": "text",
                "default": "做工程，也是做<span class=\"blue\">良心</span>"
            },
            {
                "group": "品牌理念",
                "key": "mission.desc",
                "label": "區塊內文",
                "type": "textarea",
                "default": "許多人對裝修的印象是「水很深」、「常常追加預算」。我們成立的初衷，就是希望打破這個刻板印象。<br><br>我們堅持透明報價、不隨便追加工程款。每一個案子，我們都當成自己的家來做。選用合規安全的線材管料，按部就班施工，因為隱蔽工程才是決定一個家能住多久的關鍵。"
            },
            {
                "group": "里程碑",
                "key": "timeline.title",
                "label": "區塊標題",
                "type": "text",
                "default": "成長與<span class=\"blue\">里程碑</span>"
            },
            {
                "group": "里程碑",
                "key": "timeline.1.year",
                "label": "里程碑一 年份",
                "type": "text",
                "default": "2004"
            },
            {
                "group": "里程碑",
                "key": "timeline.1.title",
                "label": "里程碑一 標題",
                "type": "text",
                "default": "創立鴻匠水電工程行"
            },
            {
                "group": "里程碑",
                "key": "timeline.1.desc",
                "label": "里程碑一 簡述",
                "type": "textarea",
                "default": "從三個師傅的小團隊開始，專注於社區家庭水電維修。"
            },
            {
                "group": "里程碑",
                "key": "timeline.2.year",
                "label": "里程碑二 年份",
                "type": "text",
                "default": "2012"
            },
            {
                "group": "里程碑",
                "key": "timeline.2.title",
                "label": "里程碑二 標題",
                "type": "text",
                "default": "擴大服務範疇"
            },
            {
                "group": "里程碑",
                "key": "timeline.2.desc",
                "label": "里程碑二 簡述",
                "type": "textarea",
                "default": "引進室內設計師團隊，提供從設計到施工的一條龍服務。"
            },
            {
                "group": "里程碑",
                "key": "timeline.3.year",
                "label": "里程碑三 年份",
                "type": "text",
                "default": "2020"
            },
            {
                "group": "里程碑",
                "key": "timeline.3.title",
                "label": "里程碑三 標題",
                "type": "text",
                "default": "商業空間服務上線"
            },
            {
                "group": "里程碑",
                "key": "timeline.3.desc",
                "label": "里程碑三 簡述",
                "type": "textarea",
                "default": "承接連鎖品牌店面、商辦大樓等中大型專案。"
            },
            {
                "group": "里程碑",
                "key": "timeline.4.year",
                "label": "里程碑四 年份",
                "type": "text",
                "default": "2024"
            },
            {
                "group": "里程碑",
                "key": "timeline.4.title",
                "label": "里程碑四 標題",
                "type": "text",
                "default": "全台服務網絡啟動"
            },
            {
                "group": "里程碑",
                "key": "timeline.4.desc",
                "label": "里程碑四 簡述",
                "type": "textarea",
                "default": "突破區域限制，團隊擴編至30人，承接全台各地的裝修需求。"
            }
        ]
    },
    "gallery.html": {
        "name": "作品相冊",
        "items": [
            {
                "group": "主視覺 (Hero)",
                "key": "hero.title",
                "label": "大標題",
                "type": "text",
                "default": "為每個空間<br /><span class=\"orange\">留下紀錄</span>"
            },
            {
                "group": "主視覺 (Hero)",
                "key": "hero.desc",
                "label": "副標題/引言",
                "type": "textarea",
                "default": "看看我們如何將客戶的想法化為真實的質感空間。"
            }
        ]
    },
    "contact.html": {
        "name": "聯絡我們",
        "items": [
            {
                "group": "主視覺 (Hero)",
                "key": "hero.title",
                "label": "大標題",
                "type": "text",
                "default": "開始您的<br /><span class=\"blue\">裝修計畫</span>"
            },
            {
                "group": "主視覺 (Hero)",
                "key": "hero.desc",
                "label": "副標題/引言",
                "type": "textarea",
                "default": "歡迎透過電話、LINE 或填寫表單與我們聯繫，免費到府估價，透明合理收費。"
            },
            {
                "group": "表單區塊",
                "key": "form.title",
                "label": "表單標題",
                "type": "text",
                "default": "線上諮詢表單"
            },
            {
                "group": "表單區塊",
                "key": "form.desc",
                "label": "表單說明",
                "type": "textarea",
                "default": "請留下您的聯絡方式與需求簡述，我們將於 1-2 個工作天內與您聯繫。"
            }
        ]
    },
    "service-water.html": {
        "name": "服務：水電工程",
        "items": [
            {
                "group": "主視覺 (Hero)",
                "key": "hero.title",
                "label": "大標題",
                "type": "text",
                "default": "專業水電<br /><span class=\"blue\">配管工程</span>"
            },
            {
                "group": "主視覺 (Hero)",
                "key": "hero.desc",
                "label": "副標題/引言",
                "type": "textarea",
                "default": "給排水系統規劃配管、電氣迴路設計、弱電系統整合，確保每一處管線安全耐用、符合建築法規標準。"
            },
            {
                "group": "核心服務卡片",
                "key": "card.1.title",
                "label": "卡片1 標題",
                "type": "text",
                "default": "給排水配管"
            },
            {
                "group": "核心服務卡片",
                "key": "card.1.desc",
                "label": "卡片1 內文",
                "type": "textarea",
                "default": "自來水管全室更換、熱水管路安裝、廚衛排水配管、管路防漏處理"
            },
            {
                "group": "核心服務卡片",
                "key": "card.2.title",
                "label": "卡片2 標題",
                "type": "text",
                "default": "電氣迴路配線"
            },
            {
                "group": "核心服務卡片",
                "key": "card.2.desc",
                "label": "卡片2 內文",
                "type": "textarea",
                "default": "全室電氣迴路設計、配電箱更換、插座開關更新、照明迴路安裝"
            },
            {
                "group": "核心服務卡片",
                "key": "card.3.title",
                "label": "卡片3 標題",
                "type": "text",
                "default": "弱電系統整合"
            },
            {
                "group": "核心服務卡片",
                "key": "card.3.desc",
                "label": "卡片3 內文",
                "type": "textarea",
                "default": "網路線佈設、電視天線、門禁對講機、監視系統、智能家居配線"
            },
            {
                "group": "核心服務卡片",
                "key": "card.4.title",
                "label": "卡片4 標題",
                "type": "text",
                "default": "消防緊急系統"
            },
            {
                "group": "核心服務卡片",
                "key": "card.4.desc",
                "label": "卡片4 內文",
                "type": "textarea",
                "default": "消防灑水管配管、緊急照明配線、火警感知器、避雷針接地工程"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.title",
                "label": "項目1 標題",
                "type": "text",
                "default": "給水排水系統規劃與配管"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "自來水管全室更換（PPR / PVC 管材）"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "熱水器管路安裝與更新"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "廚房廁所排水配管"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "管路防漏處理與測試"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "水壓測試與品質驗收"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "給水加壓馬達安裝"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "衛生設備安裝（馬桶/浴缸/洗手台）"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "鑄鐵管汰換為新式管材"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.title",
                "label": "項目2 標題",
                "type": "text",
                "default": "電氣迴路規劃與配線"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "全室電氣迴路設計規劃"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "配電箱更換（無熔絲開關）"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "插座 / 開關全室更新"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "照明迴路規劃安裝"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "空調電源迴路配線"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "廚房大功率設備迴路"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "接地線施工"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "用電安全檢查報告"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.title",
                "label": "項目3 標題",
                "type": "text",
                "default": "弱電系統整合佈設"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "網路線（Cat6）全室佈設"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "電視天線 / 有線電視"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "門禁對講機系統"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "保全監視系統配線"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "智能家居系統整合"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "音響系統佈線"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "弱電箱彙整美化"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "光纖入戶配線"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.title",
                "label": "項目4 標題",
                "type": "text",
                "default": "消防與緊急系統"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "消防灑水頭配管"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "緊急照明電源配線"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "消防廣播系統"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "火警感知器安裝"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "避雷針接地工程"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "備用電源 UPS 配置"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "緊急出口指示燈"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "消防系統年度維護"
            }
        ]
    },
    "service-interior.html": {
        "name": "服務：室內裝修",
        "items": [
            {
                "group": "主視覺 (Hero)",
                "key": "hero.title",
                "label": "大標題",
                "type": "text",
                "default": "精緻室內<br /><span class=\"blue\">裝修工程</span>"
            },
            {
                "group": "主視覺 (Hero)",
                "key": "hero.desc",
                "label": "副標題/引言",
                "type": "textarea",
                "default": "客廳、廚房、衛浴到全室翻新，融合美學設計與工藝施工，打造符合您生活品味的理想居家。"
            },
            {
                "group": "核心服務卡片",
                "key": "card.1.title",
                "label": "卡片1 標題",
                "type": "text",
                "default": "客廳・餐廳"
            },
            {
                "group": "核心服務卡片",
                "key": "card.1.desc",
                "label": "卡片1 內文",
                "type": "textarea",
                "default": "天花板、地板、牆面、造型電視牆、間接照明、隔間牆施工"
            },
            {
                "group": "核心服務卡片",
                "key": "card.2.title",
                "label": "卡片2 標題",
                "type": "text",
                "default": "廚房改造"
            },
            {
                "group": "核心服務卡片",
                "key": "card.2.desc",
                "label": "卡片2 內文",
                "type": "textarea",
                "default": "系統廚具、流理台面材、磁磚鋪設、抽油煙機管路配合"
            },
            {
                "group": "核心服務卡片",
                "key": "card.3.title",
                "label": "卡片3 標題",
                "type": "text",
                "default": "衛浴改造"
            },
            {
                "group": "核心服務卡片",
                "key": "card.3.desc",
                "label": "卡片3 內文",
                "type": "textarea",
                "default": "防水工程、磁磚鋪設、馬桶浴缸安裝、乾濕分離施工"
            },
            {
                "group": "核心服務卡片",
                "key": "card.4.title",
                "label": "卡片4 標題",
                "type": "text",
                "default": "全室翻新"
            },
            {
                "group": "核心服務卡片",
                "key": "card.4.desc",
                "label": "卡片4 內文",
                "type": "textarea",
                "default": "舊屋整建、壁癌處理、管線汰換、全室粉刷一次到位"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.title",
                "label": "項目1 標題",
                "type": "text",
                "default": "客廳・餐廳施工"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "天花板輕鋼架 / 矽酸鈣板工程"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "造型天花板設計施作"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "地板鋪設（磁磚 / 木地板 / 石材）"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "牆面粉刷與裝飾"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "電視牆造型設計"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "間接照明施工"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "窗簾盒施作"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "隔間牆施工"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.title",
                "label": "項目2 標題",
                "type": "text",
                "default": "廚房裝修工程"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "廚房系統廚具安裝"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "流理台面材鋪設"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "廚房磁磚拆除重鋪"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "抽油煙機管路配合"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "嵌入式廚具安裝"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "廚房水電配合施工"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "廚房防水工程"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "廚房門更換"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.title",
                "label": "項目3 標題",
                "type": "text",
                "default": "衛浴改造工程"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "衛浴全室防水工程"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "磁磚拆除及重新鋪設"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "馬桶 / 浴缸 / 淋浴拉門安裝"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "浴室鏡櫃 / 收納安裝"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "乾濕分離施工"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "排風設備安裝"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "浴室暖風機安裝"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "五金配件更換"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.title",
                "label": "項目4 標題",
                "type": "text",
                "default": "臥室・書房工程"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "系統衣櫃規劃安裝"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "書桌書架客製製作"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "臥室地板鋪設"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "滑門拉門安裝"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "臥室燈光規劃"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "更衣間規劃施作"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "窗戶氣密施工"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "窗簾軌道安裝"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.title",
                "label": "項目5 標題",
                "type": "text",
                "default": "舊屋翻新整合"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "壁癌處理與防水補強"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "管線全室汰換"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "隔間牆調整拆除"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "門窗框更換"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "外牆防水施工"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "地板底層整平"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "全室粉刷翻新"
            },
            {
                "group": "詳細服務項目 5",
                "key": "acc.5.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "陽台外推 / 整修"
            }
        ]
    },
    "service-design.html": {
        "name": "服務：設計規劃",
        "items": [
            {
                "group": "主視覺 (Hero)",
                "key": "hero.title",
                "label": "大標題",
                "type": "text",
                "default": "空間設計<br /><span class=\"blue\">量身規劃</span>"
            },
            {
                "group": "主視覺 (Hero)",
                "key": "hero.desc",
                "label": "副標題/引言",
                "type": "textarea",
                "default": "由專業室內設計師主導，從風格定義到施工圖面，全程陪伴您完成理想空間的每一個細節。"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.title",
                "label": "項目1 標題",
                "type": "text",
                "default": "風格定義與概念規劃"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "風格喜好分析"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "生活動線規劃"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "空間機能需求評估"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "色彩計畫提案"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "材質板製作"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "燈光氛圍規劃"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "家具配置建議"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "預算分配規劃"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.title",
                "label": "項目2 標題",
                "type": "text",
                "default": "平面配置與 3D 效果圖"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "現況丈量與平面繪製"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "平面配置方案比較"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "3D 空間模擬效果圖"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "材料選色 3D 呈現"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "各場域施工透視圖"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "視角調整與修改確認"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "鳥瞰全室配置圖"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "夜間燈光效果模擬"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.title",
                "label": "項目3 標題",
                "type": "text",
                "default": "施工圖面與材料規格"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "詳細施工平面圖"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "天花板施工圖"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "立面施工圖"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "水電整合圖"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "材料規格書製作"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "建材樣品確認"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "建材代購服務"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "施工規格說明書"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.title",
                "label": "項目4 標題",
                "type": "text",
                "default": "工程監造與施工管理"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "工程進度排程管理"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "施工廠商協調溝通"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "現場施工品質監督"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "設計變更處理"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "驗收前品質確認"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "完工後缺失清查"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "材料進場驗收"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "施工照片記錄"
            }
        ]
    },
    "service-maintenance.html": {
        "name": "服務：維修保固",
        "items": [
            {
                "group": "主視覺 (Hero)",
                "key": "hero.title",
                "label": "大標題",
                "type": "text",
                "default": "完工之後<br /><span class=\"blue\">全程守護</span>"
            },
            {
                "group": "主視覺 (Hero)",
                "key": "hero.desc",
                "label": "副標題/引言",
                "type": "textarea",
                "default": "完工不是終點，兩年保固是我們的承諾。24小時緊急維修專線，讓您安心享受理想空間。"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.title",
                "label": "項目1 標題",
                "type": "text",
                "default": "兩年工程保固服務"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "水電工程保固兩年"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "結構施工保固兩年"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "防水工程保固兩年"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "系統傢具保固兩年"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "保固範圍透明說明"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "保固申請快速回應"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "到府檢修不加收費用"
            },
            {
                "group": "詳細服務項目 1",
                "key": "acc.1.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "維修記錄完整建檔"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.title",
                "label": "項目2 標題",
                "type": "text",
                "default": "緊急維修服務"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "24小時維修專線"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "水管漏水緊急搶修"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "電路跳電故障排除"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "排水堵塞疏通"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "緊急門窗修復"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "颱風後損害修繕"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "優先排程不等待"
            },
            {
                "group": "詳細服務項目 2",
                "key": "acc.2.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "夜間假日均可出勤"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.title",
                "label": "項目3 標題",
                "type": "text",
                "default": "定期維護保養"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "年度水電安全檢查"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "管線使用狀況評估"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "電氣設備安全測試"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "空調系統定期保養"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "防水層定期檢查"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "維修保養記錄建檔"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "老化零件提前更換建議"
            },
            {
                "group": "詳細服務項目 3",
                "key": "acc.3.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "用電效率評估報告"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.title",
                "label": "項目4 標題",
                "type": "text",
                "default": "舊屋診斷服務"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.1",
                "label": "條列 1",
                "type": "text",
                "default": "免費到府現況評估"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.2",
                "label": "條列 2",
                "type": "text",
                "default": "壁癌原因診斷"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.3",
                "label": "條列 3",
                "type": "text",
                "default": "漏水源頭追蹤"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.4",
                "label": "條列 4",
                "type": "text",
                "default": "管線老化評估"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.5",
                "label": "條列 5",
                "type": "text",
                "default": "用電安全檢查"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.6",
                "label": "條列 6",
                "type": "text",
                "default": "裝修工程需求評估"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.7",
                "label": "條列 7",
                "type": "text",
                "default": "改善方案建議"
            },
            {
                "group": "詳細服務項目 4",
                "key": "acc.4.li.8",
                "label": "條列 8",
                "type": "text",
                "default": "費用估算報告"
            }
        ]
    }
  };


  const CMS = {
    data: null,

    /* Load CMS data from localStorage */
    load() {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) this.data = JSON.parse(raw);
      } catch (e) { this.data = null; }
      return this.data;
    },

    /* Save CMS data to localStorage */
    save(data) {
      try {
        localStorage.setItem(KEY, JSON.stringify(data));
        this.data = data;
        return true;
      } catch (e) { return false; }
    },

    /* Get data with fallback to default */
    getData() {
      return this.data || this.getDefault();
    },

    /* Default data (mirrors the static HTML) */
    getDefault() {
      return {
        gallery: [
          { id: '1',  src: 'https://picsum.photos/seed/hj01/800/600', title: '現代簡約三房公寓',    category: 'interior',   meta: '台北市大安區・40坪・2024.03', visible: true },
          { id: '2',  src: 'https://picsum.photos/seed/hj02/800/600', title: '商辦大樓全棟水電更新', category: 'water',      meta: '新北市・680坪・2024.01',   visible: true },
          { id: '3',  src: 'https://picsum.photos/seed/hj03/800/600', title: '廚房衛浴全面翻新',    category: 'interior',   meta: '台中市・28坪・2023.11',    visible: true },
          { id: '4',  src: 'https://picsum.photos/seed/hj04/800/600', title: '透天厝全屋翻修設計',  category: 'design',     meta: '台北市士林區・65坪・2023.09', visible: true },
          { id: '5',  src: 'https://picsum.photos/seed/hj05/800/600', title: '餐飲店面空間改造',    category: 'commercial', meta: '桃園市・35坪・2023.07',    visible: true },
          { id: '6',  src: 'https://picsum.photos/seed/hj06/800/600', title: '老公寓水電全面更新',  category: 'water',      meta: '台北市萬華區・24坪・2023.05', visible: true },
          { id: '7',  src: 'https://picsum.photos/seed/hj07/800/600', title: '北歐風格兩房裝修',    category: 'interior',   meta: '新北市板橋區・32坪・2023.04', visible: true },
          { id: '8',  src: 'https://picsum.photos/seed/hj08/800/600', title: '小坪數機能空間設計',  category: 'design',     meta: '台北市中山區・18坪・2023.03', visible: true },
          { id: '9',  src: 'https://picsum.photos/seed/hj09/800/600', title: '辦公室空間整體翻新',  category: 'commercial', meta: '台北市內湖區・80坪・2023.01', visible: true },
          { id: '10', src: 'https://picsum.photos/seed/hj10/800/600', title: '電梯大廈全室裝修',    category: 'interior',   meta: '桃園市・45坪・2022.12',    visible: true },
          { id: '11', src: 'https://picsum.photos/seed/hj11/800/600', title: '社區管線整體汰換',    category: 'water',      meta: '新北市新店區・120坪・2022.10', visible: true },
          { id: '12', src: 'https://picsum.photos/seed/hj12/800/600', title: '精品風格主臥套房設計', category: 'design',     meta: '台北市大安區・25坪・2022.08', visible: true }
        ],
        news: [],
        contact: {
          phone1:  '(02) 2345-6789',
          phone2:  '0912-345-678',
          email:   'service@hongjiang.com.tw',
          region:  '台北・新北・桃園・台中・全台接洽',
          hours:   '週一至週六 08:00 — 18:00'
        }
      };
    },

    /* Apply CMS overrides to current page DOM */
    apply() {
      const d = this.data;
      if (!d) return; // No CMS data → keep original HTML

      const page    = location.pathname.split('/').pop() || 'index.html';
      const gallery = (d.gallery || []).filter(i => i.visible !== false);



      /* Helper: render a gallery item card */
      function galleryItemHTML(item) {
        const cat = CAT_LABELS[item.category] || item.category || '';
        return `<div class="gallery-item"
             data-cat="${esc(item.category)}"
             data-full="${esc(item.src)}"
             data-title="${esc(item.title)}"
             data-meta="${esc(item.meta)}">
          <img src="${esc(item.src)}" alt="${esc(item.title)}" loading="lazy" />
          <div class="gallery-item-overlay">
            <div class="gallery-item-cat">${esc(cat)}</div>
            <div class="gallery-item-title">${esc(item.title)}</div>
          </div>
          <div class="gallery-zoom">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
          </div>
        </div>`;
      }

      /* gallery.html — full grid */
      try {
      if (page === 'gallery.html') {
        const grid = document.querySelector('.gallery-grid');
        if (grid && gallery.length) {
          grid.innerHTML = gallery.map(galleryItemHTML).join('');
          const cnt = document.querySelector('.filter-count span');
          if (cnt) cnt.textContent = gallery.length;
        }
      }

      /* index.html — preview grid + news */
      if (page === 'index.html' || page === '') {
        const preview = document.querySelector('.gallery-preview-grid');
        if (preview && gallery.length) {
          preview.innerHTML = gallery.slice(0, 5).map(galleryItemHTML).join('');
        }
        this._applyNews(d.news || []);
      }

      /* Service pages — filter by category */
      if (page in PAGE_CAT) {
        const cat      = PAGE_CAT[page];
        const filtered = cat ? gallery.filter(i => i.category === cat) : gallery;
        const grid     = document.querySelector('.gallery-grid');
        if (grid && filtered.length) {
          grid.innerHTML = filtered.map(galleryItemHTML).join('');
        }
      }
      } catch(e) { console.warn('CMS gallery apply error:', e); }

      /* Generic data-cms binding for ANY page */
      if (d.pages) {
        document.querySelectorAll('[data-cms]').forEach(el => {
          const attr = el.getAttribute('data-cms');
          if (attr) {
            let key = null;
            let pageData = null;
            if (attr.startsWith(page + '.')) {
              key = attr.slice(page.length + 1);
              pageData = d.pages[page];
            } else if (attr.startsWith('global.')) {
              key = attr.slice(7);
              pageData = d.pages['index.html'];
            }
            
            if (key && pageData && pageData[key] !== undefined) {
              if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.value = pageData[key];
              } else {
                el.innerHTML = pageData[key];
              }
            }
          }
        });
        
        // Apply footer tagline manually since it doesn't have data-cms
        if (d.pages['index.html'] && d.pages['index.html']['footer.tagline']) {
          const taglineEl = document.querySelector('.footer-tagline');
          if (taglineEl) taglineEl.innerHTML = esc(d.pages['index.html']['footer.tagline']).replace(/\n/g, '<br />');
        }
      }

      /* contact.html — contact info */
      if (page === 'contact.html' && d.pages && d.pages['index.html']) {
        this._applyContact(d.pages['index.html']);
      }
    },

    _applyContact(c) {
      const vals = document.querySelectorAll('.c-value');
      if (vals[0]) vals[0].innerHTML = `${esc(c['footer.phone1'])}<br />${esc(c['footer.phone2'])}`;
      if (vals[1]) vals[1].textContent = c['footer.email']   || '';
      if (vals[2]) vals[2].textContent = c['footer.address'] || '';
      if (vals[3]) vals[3].textContent = c['footer.hours']   || '';
    },

    _applyNews(news) {
      const visible = news.filter(n => n.visible !== false);
      if (!visible.length) return;

      document.getElementById('cms-news')?.remove();

      const cta = document.querySelector('.cta-banner');
      if (!cta) return;

      const sec = document.createElement('section');
      sec.id = 'cms-news';
      sec.className = 'section-gap';
      sec.style.background = 'var(--surface)';
      sec.innerHTML = `
        <div class="container">
          <div style="text-align:center;margin-bottom:48px;" class="reveal">
            <div class="label" style="justify-content:center;margin-bottom:12px;">最新消息</div>
            <div class="section-divider" style="margin:12px auto 0;"></div>
            <h2 class="section-title" style="margin-top:16px;">鴻匠<span class="blue"> 最新動態</span></h2>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;">
            ${visible.slice(0, 6).map(n => `
              <article class="card reveal" style="padding:24px;cursor:default;">
                <div style="font-size:11px;color:var(--text-subtle);font-weight:600;letter-spacing:.06em;margin-bottom:8px;text-transform:uppercase;">
                  ${esc(n.category || '最新消息')} · ${esc(n.date || '')}
                </div>
                <h3 style="font-size:17px;font-weight:700;margin-bottom:10px;line-height:1.4;">${esc(n.title)}</h3>
                <p style="font-size:14px;color:var(--text-muted);line-height:1.75;">
                  ${esc((n.content || '').slice(0, 150))}${(n.content || '').length > 150 ? '…' : ''}
                </p>
              </article>`).join('')}
          </div>
        </div>`;
      cta.before(sec);
    },

    /* Initialize default CMS users if none exist */
    initAuth() {
      if (!localStorage.getItem(AUTH_KEY)) {
        // Default: admin@hongjiang.com / HongJiang2024
        const hash = hashPwd('HongJiang2024');
        localStorage.setItem(AUTH_KEY, JSON.stringify({
          users: [{ email: 'admin@hongjiang.com', name: '系統管理員', hash, role: 'admin' }]
        }));
      }
    }
  };

  function hashPwd(str) {
    const input = 'hj2024:' + str;
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < input.length; i++) {
      const c = input.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 0x9e3779b9);
      h2 = Math.imul(h2 ^ c, 0x5f4a0bc5);
    }
    h1 ^= Math.imul(h1 ^ (h2 >>> 15), 0x1b873593);
    h2 ^= Math.imul(h2 ^ (h1 >>> 13), 0xce4b5ce3);
    h1 ^= (h2 >>> 16); h2 ^= (h1 >>> 16);
    return (h1 >>> 0).toString(16).padStart(8,'0') + (h2 >>> 0).toString(16).padStart(8,'0');
  }

  // Expose
  window.CMS     = CMS;
  window.CMS_SCHEMA = CMS_SCHEMA;
  window.hashPwd = hashPwd;

  CMS.load();
  CMS.initAuth();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CMS.apply());
  } else {
    CMS.apply();
  }

  // Listen for localStorage changes from other windows/iframes
  window.addEventListener('storage', (e) => {
    if (e.key === 'hj_cms_v1') {
      CMS.load();
      CMS.apply();
    }
  });
})();
