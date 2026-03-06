import { Package, User } from './types';

// モックデータ（packages.js から変換）
const initialPackages: Package[] = [
  { id: '1000000001', trackingNumber: '60001', deliveryDate: '2025-12-17', recipient: '株式会社アオイ商事', address: '東京都千代田区丸の内1-1-1', productName: '業務用コピー用紙 A4', quantity: 50, assignedTo: '', picked: false },
  { id: '1000000002', trackingNumber: '60002', deliveryDate: '2025-12-17', recipient: '田中製作所', address: '神奈川県横浜市西区みなとみらい2-2-1', productName: 'オフィスチェア ブラック', quantity: 5, assignedTo: '', picked: false },
  { id: '1000000003', trackingNumber: '60003', deliveryDate: '2025-12-17', recipient: '鈴木システムズ株式会社', address: '大阪府大阪市北区梅田3-3-3', productName: '27インチ液晶モニター', quantity: 10, assignedTo: '', picked: false },
  { id: '1000000004', trackingNumber: '60004', deliveryDate: '2025-12-17', recipient: '合同会社フロンティア', address: '福岡県福岡市博多区博多駅前4-4-4', productName: 'ワイヤレスマウス', quantity: 20, assignedTo: '', picked: false },
  { id: '1000000005', trackingNumber: '60005', deliveryDate: '2025-12-17', recipient: '高橋建設株式会社', address: '北海道札幌市中央区北一条西5-5-5', productName: '安全ヘルメット', quantity: 15, assignedTo: '', picked: false },
  { id: '1000000006', trackingNumber: '60006', deliveryDate: '2025-12-17', recipient: '伊藤食品工業', address: '愛知県名古屋市中村区名駅6-6-6', productName: '業務用保存容器セット', quantity: 30, assignedTo: '', picked: false },
  { id: '1000000007', trackingNumber: '60007', deliveryDate: '2025-12-17', recipient: '渡辺ロジスティクス', address: '東京都江東区豊洲7-7-7', productName: 'ダンボール箱 120サイズ', quantity: 100, assignedTo: '', picked: false },
  { id: '1000000008', trackingNumber: '60008', deliveryDate: '2025-12-17', recipient: '株式会社山本デザイン', address: '東京都港区六本木8-8-8', productName: 'デザイン用マーカーセット', quantity: 12, assignedTo: '', picked: false },
  { id: '1000000009', trackingNumber: '60009', deliveryDate: '2025-12-17', recipient: '中村テック株式会社', address: '埼玉県さいたま市大宮区錦町9-9-9', productName: 'LANケーブル 10m', quantity: 25, assignedTo: '', picked: false },
  { id: '1000000010', trackingNumber: '60010', deliveryDate: '2025-12-17', recipient: '小林貿易', address: '兵庫県神戸市中央区三宮町1-2-3', productName: '輸入雑貨詰め合わせ', quantity: 8, assignedTo: '', picked: false },
  { id: '1000000011', trackingNumber: '60011', deliveryDate: '2025-12-17', recipient: '加藤プランニング', address: '東京都渋谷区道玄坂2-3-4', productName: 'ホワイトボード(壁掛け)', quantity: 2, assignedTo: '', picked: false },
  { id: '1000000012', trackingNumber: '60012', deliveryDate: '2025-12-17', recipient: '吉田興業株式会社', address: '千葉県千葉市美浜区中瀬2-6-1', productName: '作業用手袋 Lサイズ', quantity: 50, assignedTo: '', picked: false },
  { id: '1000000013', trackingNumber: '60013', deliveryDate: '2025-12-17', recipient: '佐々木エレクトロニクス', address: '東京都品川区大崎1-11-1', productName: 'USBメモリ 64GB', quantity: 40, assignedTo: '', picked: false },
  { id: '1000000014', trackingNumber: '60014', deliveryDate: '2025-12-17', recipient: '山口販売株式会社', address: '宮城県仙台市青葉区中央1-10-10', productName: '販促用ポスターフレーム', quantity: 10, assignedTo: '', picked: false },
  { id: '1000000015', trackingNumber: '60015', deliveryDate: '2025-12-17', recipient: '松本クリエイティブ', address: '京都府京都市下京区烏丸通10-10', productName: 'タブレット端末', quantity: 5, assignedTo: '', picked: false },
  { id: '1000000016', trackingNumber: '60016', deliveryDate: '2025-12-17', recipient: '井上商会', address: '広島県広島市中区基町11-11', productName: '事務用ファイル 10冊組', quantity: 20, assignedTo: '', picked: false },
  { id: '1000000017', trackingNumber: '60017', deliveryDate: '2025-12-17', recipient: '木村ネットワークス', address: '東京都新宿区西新宿2-8-1', productName: 'Wi-Fiルーター', quantity: 7, assignedTo: '', picked: false },
  { id: '1000000018', trackingNumber: '60018', deliveryDate: '2025-12-17', recipient: '林田メディカル', address: '大阪府吹田市江坂町1-23-4', productName: '衛生マスク(箱)', quantity: 60, assignedTo: '', picked: false },
  { id: '1000000019', trackingNumber: '60019', deliveryDate: '2025-12-17', recipient: '清水不動産管理', address: '東京都世田谷区玉川2-21-1', productName: '鍵管理ボックス', quantity: 3, assignedTo: '', picked: false },
  { id: '1000000020', trackingNumber: '60020', deliveryDate: '2025-12-17', recipient: '山崎サービス株式会社', address: '神奈川県川崎市川崎区駅前本町12-12', productName: '清掃用洗剤 業務用', quantity: 15, assignedTo: '', picked: false },
  { id: '1000000091', trackingNumber: '60091', deliveryDate: '2025-12-18', recipient: '佐藤商事株式会社', address: '東京都千代田区大手町1-2-1', productName: 'コピー用紙 A4 500枚x5冊', quantity: 10, assignedTo: '1000000003', picked: false },
  { id: '1000000092', trackingNumber: '60092', deliveryDate: '2025-12-18', recipient: '高橋ITソリューション', address: '東京都新宿区西新宿3-2-1', productName: 'メカニカルキーボード', quantity: 5, assignedTo: '1000000003', picked: false },
  { id: '1000000093', trackingNumber: '60093', deliveryDate: '2025-12-18', recipient: '株式会社グリーンライフ', address: '長野県松本市中央1-5-5', productName: '除草剤 10L', quantity: 3, assignedTo: '1000000003', picked: false },
  { id: '1000000094', trackingNumber: '60094', deliveryDate: '2025-12-18', recipient: '木下ベーカリー', address: '東京都目黒区自由が丘2-1-1', productName: '製パン用イースト 500g', quantity: 20, assignedTo: '1000000003', picked: false },
  { id: '1000000095', trackingNumber: '60095', deliveryDate: '2025-12-18', recipient: '鈴木歯科医院', address: '神奈川県横浜市中区元町1-10', productName: '使い捨て手袋 Mサイズ', quantity: 50, assignedTo: '1000000003', picked: false },
  { id: '1000000096', trackingNumber: '60096', deliveryDate: '2025-12-18', recipient: '合同会社ネクストギア', address: '愛知県名古屋市中村区名駅3-1', productName: 'HDMIケーブル 2.0m', quantity: 15, assignedTo: '1000000003', picked: false },
  { id: '1000000097', trackingNumber: '60097', deliveryDate: '2025-12-18', recipient: '大塚事務機', address: '大阪府大阪市中央区本町2-2-2', productName: 'シュレッダーメンテナンスオイル', quantity: 8, assignedTo: '1000000003', picked: false },
  { id: '1000000098', trackingNumber: '60098', deliveryDate: '2025-12-18', recipient: '福井テキスタイル', address: '福井県福井市大手3-1-1', productName: 'ポリエステル生地 10mロール', quantity: 2, assignedTo: '1000000003', picked: false },
  { id: '1000000099', trackingNumber: '60099', deliveryDate: '2025-12-18', recipient: '株式会社山際建設', address: '埼玉県さいたま市浦和区高砂1-1', productName: '反射ベスト オレンジ', quantity: 30, assignedTo: '1000000003', picked: false },
  { id: '1000000100', trackingNumber: '60100', deliveryDate: '2025-12-18', recipient: '北海シーフード', address: '北海道札幌市中央区北三条西1-1', productName: '冷凍ホタテ貝柱 1kg', quantity: 12, assignedTo: '1000000003', picked: false },
];

const initialUsers: User[] = [
  { id: '1000000000', name: '田中', authority: 3 },
  { id: '1000000001', name: '佐藤', authority: 3 },
  { id: '1000000002', name: '鈴木', authority: 3 },
  { id: '1000000003', name: '高橋', authority: 3 },
  { id: '1000000004', name: '伊藤', authority: 3 },
  { id: '1000000005', name: '渡辺', authority: 3 },
  { id: '1000000006', name: '山本', authority: 3 },
  { id: '1000000007', name: '中村', authority: 3 },
  { id: '1000000008', name: '小林', authority: 3 },
  { id: '1000000009', name: '加藤', authority: 3 },
];

// セッション中のデータを保持するモジュールレベルの変数
let packagesDb: Package[] = JSON.parse(JSON.stringify(initialPackages));

export function getPackages(date?: string): Package[] {
  const copy: Package[] = JSON.parse(JSON.stringify(packagesDb));
  if (!date) return copy;
  return copy.filter((p) => p.deliveryDate === date);
}

export function getUsers(authority?: number): User[] {
  if (authority === undefined) return initialUsers;
  return initialUsers.filter((u) => u.authority === authority);
}

export function savePackages(data: Package[]): void {
  packagesDb = JSON.parse(JSON.stringify(data));
}
